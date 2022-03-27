import { BaseXhr, hooksProps } from './baseXhr';
// import { mockUrl } from './message';
import type { configProps, mockDataItem } from './utils';
import { switchFindUrl, findUrlBuyMock, createMockItem } from './utils';
//@ts-nocheck

let mockUrl: any = null;
let xhr: ProxyXhr | null = null;
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
        this.instance = null;
        this.instance = new ProxyXhr(this.hooks, this.afterHooks);
    }

    setRequestHeader(header: object, xhr: any) {
        Object.keys(header).forEach((el) => {
            /// @ts-ignore
            xhr.setRequestHeader(el, header[el]);
        });
    }
    setRequestInfo(config: configProps, xhr: any) {
        // 主要利用config里的url 找寻 需要修改的请求对象 // 可修改请求头,一些请求属性
        // const data = findUrlBuyMock(config);
        switchFindUrl(
            config,
            (data) => {
                const { request } = data;
                Object.keys(request.headers).length > 0 &&
                    this.setRequestHeader(request.headers, xhr);
                xhr.timeout = request.timeout; //  用户如果设置的话 会覆盖当前的属性
                console.log(request.timeout, '设置了超时时间');
            },
            mockUrl,
        );
    }
    setRequestData(config: configProps) {
        const data = findUrlBuyMock(config, mockUrl);
        if (data && data.switch) {
            const { request } = data;
            return request.data;
        } else {
            return config.data;
        }
    }
    setResponseData(config: configProps, xhr: any) {
        // 修改返回的reponse数据
        switchFindUrl(
            config,
            (data) => {
                console.log(config, data, '找到修改的地方');
                xhr.responseText = data.response;
            },
            mockUrl,
        );
    }
}
/**
 * 先执行open 随后触发onreadystatechange一次 最后 执行send
 */

export const setMockData = (mockData: mockDataItem[]) => {
    mockUrl = mockData;
    console.log('xhr里的mockData数据', mockUrl);
};
export const initXhr = (): ProxyXhr => {
    if (xhr) {
        return xhr;
    }
    xhr = new ProxyXhr(
        {
            send: function (body: any) {
                try {
                    ProxyXhr.config.data = body ? JSON.parse(body[0]) : null;
                    xhr!.setResponseData(ProxyXhr.config, this);
                    const data = xhr!.setRequestData(ProxyXhr.config);
                    console.log(data, '数据data');
                    //    xhr.reqListData.push(ProxyXhr.config)
                    // this.resetConfig();
                    // 修改请求信息
                    return data;
                } catch (error) {
                    console.log(error);
                }
            },
            open: function (data: any) {
                console.log(new Date().getTime(), '打开链接');
                const [, url] = data;
                ProxyXhr.config.url = url;
            },
            onreadystatechange: function () {
                if (this.readyState === 1) {
                    // this.setRequestHeader('x-wg','x')
                    xhr!.setRequestInfo(ProxyXhr.config, this); // 等于1的时候修改请求信息
                    console.log('等于1的时候', this);
                } else if (this.readyState === 2) {
                }
                console.log('监听链接', new Date().getTime(), this.responseURL, this.readyState);
            },
            onload: function (event: any) {
                console.log('插件监听-获取完成', event, this['responseText']);
                //@ts-ignore
                let item = createMockItem({ xhr: this });
                console.log(item, '创建的item');
                window.postMessage({
                    to: 'iframe',
                    action: 'update',
                    data: item,
                });
            },
            onerror: function (event: any) {
                console.log('插件监听-错误', event);
            },
        },
        {
            send: function (originData: any, newData: any) {
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
