/* eslint-disable no-restricted-syntax */
/* eslint-disable default-case */
import { mockDataItem } from './type';

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
    const data = findUrlBuyMock(url, mockUrl) || IsIncludeUrlBuyMock(url, mockUrl);
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
export const createId = (item: { url: string; data: string }): string => {
    const { url, data } = item;
    const id = `${url}${data ? JSON.stringify(data) : ''}`;
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
        response: xhr.responseText.replace(/\s/g, ''),
        originResponse: xhr._xhr.responseText.replace(/\s/g, ''),
        showOriginData: true,
        showOriginResponse: false,
        showOriginHeader: true,
        id: createId({ url: xhr.responseURL, data: xhr.__originSendData }),
        proxy: { switch: false, url: '' },
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
        showOriginData: true,
        showOriginResponse: false,
        showOriginHeader: true,
        id: createId({ url, data: originData }),
        proxy: { switch: false, url: '' },
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
        get(target: ResponsePar, name) {
            switch (name) {
                case 'redirected':
                case 'type':
                case 'url':
                case 'bodyUsed':
                    return response[name];
            }
            // headers status ok 主要的字段信息走新的response对象
            return target[name];
        },
        set(target, name, value) {
            // console.log(name,value,'被设置的值',target,proxy);

            return Reflect.set(target, name, value);
        },
    });

    for (const key in proxy) {
        if (typeof proxy[key] === 'function') {
            proxy[key] = proxy[key].bind(newResponse);
        }
    }
    return proxy;
}
