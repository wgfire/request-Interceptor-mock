export interface configProps {
    url: string;
    data: any;
    header: any;
}
export interface mockDataItem {
    statu: number;
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
    [key: string]: any;
}
/**当前config 下 是否存在与mockUrl里 */
export const findUrlBuyMock = (url: string, mockUrl: mockDataItem[]) => {
    const mockData = mockUrl || [];
    console.log(url, '找寻链接', mockData);
    const index = mockData.findIndex((el: any) => {
        return el.url === url;
    });
    return index > -1 ? mockUrl[index] : false;
};

export const switchFindUrl = (config: configProps, fn: (data: mockDataItem) => any, mockUrl: mockDataItem[]) => {
    const data = findUrlBuyMock(config.url, mockUrl);
    if (data && data.switch) {
        fn(data);
    }
};
export const parseResponseHeaders = (xhr: any) => {
    // 解析响应标头
    let headers = xhr.getAllResponseHeaders();
    let arr = headers.trim().split(/[\r\n]+/);

    // Create a map of header names to values
    const headerMap:{[key:string]:any} = {};
    arr.forEach(function (line:string) {
        let parts = line.split(': ');
        let header = parts.shift();
        let value = parts.join(': ');
        headerMap[header!] = value;
    });
    console.log(headerMap,'响应头解析')
    return headerMap
};

export const createMockItem = ({ xhr }: { xhr: any; mockUrl: mockDataItem[] }): mockDataItem => {
    const obj: mockDataItem = {
        statu: 200,
        switch: false,
        cancel: false,
        url: xhr.responseURL,
        request: {
            headers: {},
            timeout: 200,
            data: xhr['__realitySendData'],
            originData: xhr['__originSendData'],
        },
        response: xhr['responseText'],
        originResponse: xhr._xhr['responseText'],
    };
    return obj;
};
