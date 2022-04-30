export interface configProps {
    url: string;
    data: any;
    header: any;
}
/**
 * 代理的全局配置，目前xhr类型配置跨域携带cookie
 */
export interface globalConfig {
    withCredentials: boolean;
}

export interface globalDataPorps {
    mockData: mockDataItem[];
    config: globalConfig;
}
// export type globalMapData = Map<keyof globalDataPorps, globalDataPorps[keyof globalDataPorps]>;
export interface mockDataItem {
    status: number;
    switch: boolean;
    cancel: boolean;
    url: string;
    request: {
        headers?: any; // 对于fetch 来说这就是个请求配置 包含了请求body
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
    id: string; // 根据url和请求body生成唯一id
    type: string; // 代理的类型
    [key: string]: any;
}
