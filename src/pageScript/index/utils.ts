export interface configProps {
    url: string;
    data: any;
    header: any;
}
export interface mockDataItem {
    status: number;
    switch: boolean;
    cancel: boolean;
    url: string;
    request: {
        headers?: any; //对于fetch 来说这就是个请求配置 包含了请求body
        timeout: number;
        data?: any;
        originData?: any;
        originHeaders?: any;
        [key: string]: any;
    };
    response: any;
    originResponse: any;
    showOriginData?: false;
    showOriginResponse: false; // 默认显示代理的数据
    showOriginHeader?: false; // fetch 的请求body跟xhr不一样，可以在一个请求配置里获取到
    id: string; //根据url和请求body生成唯一id
    type: string; // 代理的类型
    [key: string]: any;
}
/** 当前config 下 是否存在与mockUrl里 */
export const findUrlBuyMock = (url: string, mockUrl: mockDataItem[], key = 'url') => {
    const mockData = mockUrl || [];
    console.log(url, '找寻链接', mockData);
    const index = mockData.findIndex((el: any) => el[key] === url);
    return index > -1 ? mockUrl[index] : false;
};
// 有些api在生产环境是不带域名前缀的是相对地址,所以需要用包含的判断去找，找到就需要拦截
export const IsIncludeUrlBuyMock = (url: string, mockUrl: mockDataItem[]) => {
    const result = mockUrl.find((el: any) => el.url.includes(url));
    console.log(url, '找寻链接', result);
    return result;
};

export const switchFindUrl = (url: string, fn: (data: mockDataItem) => any, mockUrl: mockDataItem[]) => {
    const data = findUrlBuyMock(url, mockUrl);
    if (data && data.switch) {
        fn(data);
    }
};
export const parseResponseHeaders = (xhr: any) => {
    // 解析响应标头
    const headers = xhr.getAllResponseHeaders();
    const arr = headers.trim().split(/[\n\r]+/);

    // Create a map of header names to values
    const headerMap: { [key: string]: any } = {};
    arr.forEach((line: string) => {
        const parts = line.split(': ');
        const header = parts.shift();
        const value = parts.join(': ');
        headerMap[header!] = value;
    });
    console.log(headerMap, '响应头解析');
    return headerMap;
};
const createId = (item: { url: string; data: string }) => {
    const { url, data } = item;
    const id = `${url}${JSON.stringify(data)}`;
    return id;
};

export const createMockItem = ({ xhr }: { xhr: any }): mockDataItem => {
    const obj: mockDataItem = {
        status: 200,
        switch: false,
        cancel: false,
        url: xhr.responseURL,
        request: {
            headers: {},
            originHeaders: {},
            timeout: 200,
            data: xhr.__realitySendData,
            originData: xhr.__originSendData,
        },
        response: xhr.responseText,
        originResponse: xhr._xhr.responseText,
        showOriginData: false,
        showOriginResponse: false,
        showOriginHeader: false,
        id: createId({ url: xhr.responseURL, data: xhr.__originSendData }),
        type: 'X',
    };
    return obj;
};
export const createMockItemForFetch = ({
    url,
    data,
    originData,
    response,
    originResponse,
    headers,
    originHeaders,
}: {
    [key: string]: string;
}): mockDataItem => {
    const obj: mockDataItem = {
        status: 200,
        switch: false,
        cancel: false,
        url,
        request: {
            headers,
            timeout: 200,
            data,
            originData,
            originHeaders,
        },
        response,
        originResponse,
        showOriginData: false,
        showOriginResponse: false,
        id: createId({ url, data: originData }),
        type: 'F',
    };
    return obj;
};

export function createReadStream(text: string) {
    // 将文件字符，创建一个可读流对象，返回给response 对象的body
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(text));
            controller.close();
        },
    });
    return stream;
}
export function createHeaders(headers: string) {
    // 根据对象返回一个headers 对象
    const objHeader = JSON.parse(headers);
    const myHeaders = new Headers();
    Object.keys(objHeader).forEach((el) => {
        myHeaders.append(el, objHeader[el]);
    });
    return myHeaders;
}

interface ResponsePar extends Response {
    [key: string | symbol]: any;
}
export function createProxy(newResponse: Response, response: Response) {
    const proxy = new Proxy(newResponse, {
        get: function (target: ResponsePar, name) {
            switch (name) {
                case 'redirected':
                case 'type':
                case 'url':
                case 'useFinalURL':
                case 'bodyUsed':
                    //@ts-ignore
                    return response[name];
            }
            // headers status ok 主要的字段信息走新的response对象
            return target[name];
        },
        set: function (target, name, value) {
            //console.log(name,value,'被设置的值',target,proxy);
            return (target[name] = value);
        },
    });

    for (let key in proxy) {
        if (typeof proxy[key] === 'function') {
            proxy[key] = proxy[key].bind(newResponse);
        }
    }
    return proxy;
}
