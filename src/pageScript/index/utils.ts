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
        headers: any;
        timeout: number;
        data: any;
        originData: any;
        [key: string]: any;
    };
    response: any;
    originResponse: any;
    showOriginData: false;
    showOriginResponse: false; // 默认显示代理的数据
    [key: string]: any;
}
/** 当前config 下 是否存在与mockUrl里 */
export const findUrlBuyMock = (url: string, mockUrl: mockDataItem[]) => {
    const mockData = mockUrl || [];
    console.log(url, '找寻链接', mockData);
    const index = mockData.findIndex((el: any) => el.url === url);
    return index > -1 ? mockUrl[index] : false;
};

export const switchFindUrl = (url:string, fn: (data: mockDataItem) => any, mockUrl: mockDataItem[]) => {
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

export const createMockItem = ({xhr }: {xhr:any}): mockDataItem => {
    const obj: mockDataItem = {
        status: 200,
        switch: false,
        cancel: false,
        url: xhr.responseURL,
        request: {
            headers: {},
            timeout: 200,
            data: xhr.__realitySendData,
            originData: xhr.__originSendData,
        },
        response: xhr.responseText,
        originResponse: xhr._xhr.responseText,
        showOriginData: false,
        showOriginResponse: false,
    };
    return obj;
};
export const createMockItemForProxy = ({url,data,originData,response,originResponse}:{[key:string]:string}): mockDataItem => {
    const obj: mockDataItem = {
        status: 200,
        switch: false,
        cancel: false,
        url,
        request: {
            headers: {},
            timeout: 200,
            data,
            originData,
        },
        response,
        originResponse,
        showOriginData: false,
        showOriginResponse: false,
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
export function createHeaders(headers: { [key: string]: any }) {
    // 根据对象返回一个headers 对象
    const myHeaders = new Headers();
    Object.keys(headers).forEach((el) => {
        myHeaders.append(el, headers[el]);
    });
    return myHeaders;
}

interface ResponsePar extends Response {
    [key:string|symbol]:any
}
export function createProxy(newResponse: Response, response: Response) {
    const proxy = new Proxy(newResponse, {
        get: function (target:ResponsePar, name) {
            switch (name) {
                case 'redirected':
                case 'type':
                case 'url':
                case 'useFinalURL':
                case 'body':
                case 'bodyUsed':
                    //@ts-ignore
                return response[name];
            }
            // headers status ok 主要的字段信息走新的response对象
            console.log(name, '获取代理response的值');
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
