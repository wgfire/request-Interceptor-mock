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
        originData:any;
        [key: string]: any;
    };
    response: any;
    originResponse:any;
    [key: string]: any;
}
/**当前config 下 是否存在与mockUrl里 */
export const findUrlBuyMock = (config: configProps, mockUrl: mockDataItem[]) => {
    const mockData = mockUrl || [];
    const index = mockData.findIndex((el: any) => {
        return el.url === config.url;
    });
    return index > -1 ? mockUrl[index] : false;
};

export const switchFindUrl = (
    config: configProps,
    fn: (data: mockDataItem) => any,
    mockUrl: mockDataItem[],
) => {
    const data = findUrlBuyMock(config, mockUrl);
    if (data && data.switch) {
        fn(data);
    }
};

export const createMockItem = ({
    xhr,
}: {
    xhr: any;
    originData: Object;
    newData: Object;
}): mockDataItem => {
    const obj: mockDataItem = {
        statu: 200,
        switch: false,
        cancel: false,
        url: xhr.responseURL,
        request: {
            headers: {},
            timeout: 200,
            data: xhr['__realitySendData'],
            originData: xhr['__orginSendData'],
        },
        response:JSON.parse(xhr['responseText']) ,
        originResponse:JSON.parse(xhr._xhr['responseText'])
    };
    return obj;
};
