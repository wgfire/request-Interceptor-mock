import { createMockItem, findUrlBuyMock, IsIncludeUrlBuyMock, switchFindUrl } from '../../utils/pagescript';
import type { configProps, globalDataProps, mockDataItem } from '../../utils/type';
import { BaseXhr, hooksProps } from './baseXhr';

const xhrData: globalDataProps = {
    mockData: [],
    config: { withCredentials: true, proxySwitch: true, interactionStatus: 'small' },
};
let xhr: ProxyXhr | null;
class ProxyXhr extends BaseXhr {
    static config: configProps = {
        url: '',
        header: {},
        data: {},
    }; // 当前请求的信息文件
    reqListData: mockDataItem[] = [];
    constructor(hooks: hooksProps, afterHooks?: hooksProps) {
        super();
        this.originXhr = window.XMLHttpRequest;
        this.hooks = hooks;
        this.afterHooks = afterHooks ?? {};
        this.instance = this;
        this.init();
    }
    /**
     * 重置config
     */
    resetConfig() {
        ProxyXhr.config = {
            url: '',
            header: {},
            data: {},
        };
    }

    /**
     * 重新监听
     */
    reset() {
        this.instance = undefined;
        this.instance = new ProxyXhr(this.hooks, this.afterHooks);
    }

    setRequestHeaderData(headers: any, proxy: any) {
        try {
            if (typeof headers === 'string') {
                headers = JSON.parse(headers);
            }
            Object.keys(headers).forEach((el) => {
                console.log(headers[el], '设置了请求头');
                proxy.setRequestHeader(el, headers[el]);
            });
        } catch {}
    }
    setRequestInfo(config: configProps, xhr: any) {
        // 主要利用config里的url 找寻 需要修改的请求对象 // 可修改请求头,一些请求属性
        switchFindUrl(
            config.url,
            (data) => {
                const { request } = data;
                const headers = data.showOriginHeader ? request.originHeaders : request.headers;
                Object.keys(headers).length > 0 && this.setRequestHeaderData(headers, xhr);
                xhr.timeout = request.timeout; //  用户如果设置的话 会覆盖当前的属性
                console.log(request.timeout, '设置了超时时间');
            },
            xhrData.mockData,
        );
    }
    setRequestData(config: configProps) {
        const data = findUrlBuyMock(config.url, xhrData.mockData);
        if (data && data.switch) {
            const { request } = data;
            if (data.showOriginData) {
                // 如果用户设置了显示原始数据,那么就发送原生请求数据
                return config.data;
            }
            return request.data;
        }
        return config.data;
    }
    setResponseData(config: configProps, xhr: any) {
        // 修改返回的reponse数据
        switchFindUrl(
            config.url,
            (data) => {
                console.log(config, data, '找到修改的地方', xhrData.mockData);
                if (data.showOriginResponse) {
                    // 如果用户显示原生响应数据
                    xhr.responseText = data.originResponse;
                } else {
                    xhr.responseText = data.response;
                }
            },
            xhrData.mockData,
        );
    }
}
/**
 * 先执行open 随后触发onreadystatechange一次 最后 执行send
 */

export const setMockData = (data: globalDataProps) => {
    xhrData.mockData = data.mockData;
    xhrData.config = data.config;
    console.log('xhr里的mockData数据', xhrData.mockData);
};
export const cancelProxyXhr = () => {
    xhr!.unset();
    xhr = null;
    console.log('取消了代理xhr');
};
export const initXhr = (data: globalDataProps): ProxyXhr => {
    setMockData(data);
    if (xhr) {
        return xhr;
    }
    xhr = new ProxyXhr(
        {
            send(body: any) {
                try {
                    ProxyXhr.config.data = body ? body[0] : undefined;
                    xhr!.setResponseData(ProxyXhr.config, this);
                    const data = xhr!.setRequestData(ProxyXhr.config);
                    return data;
                } catch (error) {
                    console.log(error);
                }
            },
            open(data: any) {
                const [, url] = data;
                let mockItem = IsIncludeUrlBuyMock(url, xhrData.mockData);
                let proxyUrl = mockItem ? (mockItem.proxy.switch && mockItem.proxy.url ? mockItem.proxy.url : url) : url;
                console.log(Date.now(), '打开链接', url, '代理链接', proxyUrl);
                ProxyXhr.config.url = url;
                this._xhr.withCredentials = xhrData.config.withCredentials;
                data[1] = proxyUrl;
                return data;
            },
            onreadystatechange() {
                if (this.readyState === 1) {
                    this.status = 200; // 开启代理的默认状态都是200 ，这样404的时候客户端不会报错，能够拿到模拟的数据
                    xhr!.setRequestInfo(ProxyXhr.config, this); // 等于1的时候修改请求信息
                } else if (this.readyState === 4) {
                    // 更新原始数据
                    switchFindUrl(
                        this.responseURL,
                        (data) => {
                            if (data.showOriginResponse) {
                                this.responseText = this._xhr.responseText;
                            }
                        },
                        xhrData.mockData,
                    );
                }
                console.log('监听链接', Date.now(), this.responseURL, this.readyState);
            },
            onload(event: any) {
                try {
                    console.log('插件监听-获取完成', event, this);
                    const data = findUrlBuyMock(this.responseURL, xhrData.mockData);
                    const item = createMockItem({ xhr: this });
                    item.switch = data ? data.switch : false; // 为了让background 弹出通知所以开启switch
                    console.log(item, '创建的item');
                    // 将popup界面改成iframe加载后 通信链路巨长
                    window.postMessage({
                        to: 'content',
                        action: 'update',
                        data: item,
                    });
                } catch (error) {
                    console.log(error);
                }
            },
            onerror(event: any) {
                console.log('插件监听-错误', event);
            },
        },
        {
            send(originData: any, newData: any) {
                try {
                    // 用来进行通信
                    console.log(originData, newData, this, 'after回调');
                    //   let item = createMockItem({xhr:this,originData,newData})
                } catch (error) {
                    console.log(error);
                }
            },
        },
    );

    console.log(xhr, '替换的对象', xhr.getInstance());
    return xhr;
};

// initXhr()
