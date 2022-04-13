import { BaseXhr, hooksProps } from './baseXhr';
import type { configProps, mockDataItem } from './utils';
import { switchFindUrl, findUrlBuyMock, createMockItem } from './utils';

let mockUrl: any ;
let xhr: ProxyXhr | null ;
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

    setRequestHeaderData(headers: any,proxy:any) {
        try {
            if (typeof headers === 'string') {
                headers = JSON.parse(headers);
            }
            Object.keys(headers).forEach((el) => {
                proxy.setRequestHeader(el, headers[el]);
            });
        } catch {}
    }
    setRequestInfo(config: configProps, proxy: any) {
        // 主要利用config里的url 找寻 需要修改的请求对象 // 可修改请求头,一些请求属性
        switchFindUrl(
            config,
            (data) => {
                const { request } = data;
                Object.keys(request.headers).length > 0 && this.setRequestHeaderData(request.headers, xhr);
                proxy.timeout = request.timeout; //  用户如果设置的话 会覆盖当前的属性
                console.log(request.timeout, '设置了超时时间');
            },
            mockUrl,
        );
    }
    setRequestData(config: configProps) {
        const data = findUrlBuyMock(config.url, mockUrl);
        if (data && data.switch) {
            const { request } = data;
            if(data.showOriginData){
                // 如果用户设置了显示原始数据,那么就发送原生请求数据
                return request.originData
            }
            return request.data;
        }
        return config.data;
    }
    setResponseData(config: configProps, xhr: any) {
        // 修改返回的reponse数据
        switchFindUrl(
            config,
            (data) => {
                console.log(config, data, '找到修改的地方', mockUrl);
                if(data.shwoOrginRespon){
                    // 如果用户显示原生响应数据
                    xhr.responseText = data.originResponse
                }else {
                    xhr.responseText = data.response;
                }
                
            },
            mockUrl,
        );
    }
}
/**
 * 先执行open 随后触发onreadystatechange一次 最后 执行send
 */

export const setMockData = (data: any) => {
    // 拿到dom上挂载的mock数据
    const mockData = data; // JSON.parse(document.querySelector('#popup > div > textarea')?.innerHTML!)
    mockUrl = mockData;
    console.log('xhr里的mockData数据', mockUrl);
};
export const initXhr = (data: any): ProxyXhr => {
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
                console.log(Date.now(), '打开链接', url);
                ProxyXhr.config.url = url;
            },
            onreadystatechange() {
                if (this.readyState === 1) {
                    this.status = 200;
                    xhr!.setRequestInfo(ProxyXhr.config, this); // 等于1的时候修改请求信息
                } else if (this.readyState === 2) {
                }
                console.log('监听链接', Date.now(), this.responseURL, this.readyState);
            },
            onload(event: any) {
                console.log('插件监听-获取完成', event, this);
                // 更新原始数据
                const item = createMockItem({ xhr: this });
                console.log(item, '创建的item');
                window.postMessage({
                    to: 'iframe',
                    action: 'update',
                    data: item,
                });
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
