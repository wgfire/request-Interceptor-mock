// /**
//  * xhr代理类
//  * @class XhrProxy
//  * 能够代理xhr的所有属性方法，并且拦截了on开头的属性
//  */
//@ts-nocheck
const proxProperty = {
    onload(this: XMLHttpRequest, event: Event): void {
        console.log(this, '加载完成');
    },
    onreadystatechange(this: XMLHttpRequest, ev: Event) {
        console.log('监听链接', Date.now(), this.responseURL, this.readyState);
    },
};

const OriginXhr = window.XMLHttpRequest;
class XMLHttpRequestSelf extends XMLHttpRequest {
    private OriginXhr = window.XMLHttpRequest;
    private originXhr = new OriginXhr();
    override status = 200;
    constructor() {
        super();
        // console.log(this, '用户的实例');
        // this.writeProperty('onreadystatechange', proxProperty.onreadystatechange);
        // this.writeProperty('onload', proxProperty.onload);
        this.setProxy(proxProperty);
    }
    responseText: string =
        '{"status":true,"msg":"","data":{"total":"105","data":[{"user_id":"3a037b1f-4d46-87bf-e9f2-f9772667a10e","supplier_name":"广州浦ddd耳照明有限公司","name":"fyq","account":"G000282-01","mobile":"15926417689","post":"经理","section":null,"is_admin":"1","is_invite":"0","status":"2"},{"user_id":"3a037b0b-5ecc-dfed-d04d-9fcb3abcca9f","supplier_name":"上海天夏景观规划设计有限公司","name":"周权","account":"G000123-02","mobile":"18371058370","post":"Cto","section":null,"is_admin":"1","is_invite":"0","status":"2"},{"user_id":"3a03615d-394b-a36d-9f4c-2e3af2bbebe4","supplier_name":"辽宁东林瑞那斯股份有限公司","name":"fyq","account":"G000280-01","mobile":"15926417689","post":"33","section":null,"is_admin":"1","is_invite":"0","status":"2"},{"user_id":"3a033db1-5a54-a5af-711d-fd43e4d9c332","supplier_name":"山东朗进科技股份有限公司","name":"sa","account":"G000277-01","mobile":"15927297861","post":"123","section":null,"is_admin":"1","is_invite":"0","status":"2"},{"user_id":"3a033dae-6c26-2ae2-7c7c-1f378c58af5d","supplier_name":"云南网星大数据科技股份有限公司","name":"sa","account":"G000276-01","mobile":"15927297861","post":"123","section":null,"is_admin":"1","is_invite":"0","status":"2"},{"user_id":"3a033d52-a116-074d-b4be-52353e731082","supplier_name":"武汉聚电科技有限责任公司","name":"sa","account":"G000275-01","mobile":"15927297861","post":"测试","section":null,"is_admin":"1","is_invite":"0","status":"2"},{"user_id":"3a033943-1c44-ff22-6813-18baff1e8d16","supplier_name":"北京天天网联信息科技有限公司","name":"wl","account":"G000274-01","mobile":"18500040722","post":"ld","section":null,"is_admin":"1","is_invite":"0","status":"2"},{"user_id":"3a033941-c49f-cd54-2b62-80fbea1c33d8","supplier_name":"北京海奥生态环保有限公司","name":"wl","account":"G000273-01","mobile":"18500040722","post":"开发","section":null,"is_admin":"1","is_invite":"0","status":"2"},{"user_id":"3a033932-8cf6-2a65-aac0-56f53aa7f543","supplier_name":"东莞市儒德五金科技有限公司","name":"汪爽爽","account":"G000272-01","mobile":"18086618597","post":"测试","section":null,"is_admin":"1","is_invite":"0","status":"2"},{"user_id":"3a02e1f9-d12a-96c4-ce51-6c00fdfb6e45","supplier_name":"北京万茂房地产开发有限公司","name":"罗天使","account":"G000271-01","mobile":"18123330777","post":null,"section":null,"is_admin":"1","is_invite":"0","status":"2"}],"page":1,"pageSize":"10"}}';
    writeProperty(key: keyof XMLHttpRequest, value: any) {
        // @ts-ignore
        this[key] = value;
    }
    open(method: string, url: string | URL): void {
        console.log(this, '打开链接', url);
        this.open(method, url);
    }
    send(body?: Document | XMLHttpRequestBodyInit | null): void {
        try {
            this.send(body);
            console.log(body, '发送数据');
        } catch (error) {
            console.log(error, '发送失败');
        }
    }
    setRequestHeader(key: string, value: string): void {
        console.log(this, 'setRequestHeader', key, value);
        this.setRequestHeader(key, value);
    }
    getAllResponseHeaders(): string {
        console.log(this, 'getAllResponseHeaders');
        return this.getAllResponseHeaders();
    }
    onload: (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any = function () {
        console.log(this, '加载完成');
    };
    onreadystatechange: (this: XMLHttpRequest, ev: Event) => any = function () {
        console.log('监听链接', this.responseURL, this.readyState);
    };
    onerror: (this: XMLHttpRequest, ev: Event) => any = function () {
        console.log(this, '加载失败');
    };
    addEventListeners(): void {
        this.originXhr.addEventListener('load', this.onload.bind(this.originXhr));
        this.originXhr.addEventListener('readystatechange', this.onreadystatechange.bind(this.originXhr));
        this.originXhr.addEventListener('error', this.onerror.bind(this.originXhr));
    }

    setProxy(proxyMap: typeof proxProperty) {
        console.log(this, 'setProxy', this.originXhr);

        const proxy = new Proxy(this.OriginXhr, {
            construct: (T) => {
                // 每次都要实例一个新的代理对象，不然有些接口会被取消掉
                this.originXhr = new T();
                console.log('开始代理', T);
                // 添加监听事件到当前的this上
                this.addEventListeners();
                return new Proxy(this.originXhr, {
                    get: (target: XMLHttpRequest, key: keyof XMLHttpRequest) => {
                        const type = typeof target[key];
                        console.log(target, key, 'get', type);
                        if (type === 'function' && this[key]) {
                            // 绑定send 和open方法 用于修改这个方法的参数
                            return this[key].bind(this.originXhr);
                        } else {
                            // 如果是number 、string 则可以用mcok的数据返回
                            console.log('mock', target, key, this[key]);
                            if (target.responseURL.includes('list')) {
                                return this[key] || target[key];
                            }
                            return target[key];
                        }

                        //  return target[key];
                    },
                    set: (target: XMLHttpRequest, key: keyof XMLHttpRequest, value) => {
                        console.log(target, key, value, 'set');
                        const targets = target;
                        try {
                            // @ts-ignore
                            targets[key] = value;
                        } catch (error) {
                            console.log(error, key, value, 'set error');
                        }
                        return true;
                    },
                });
            },
        });

        window.XMLHttpRequest = proxy;
    }
}

const initXhr = function (): any {
    // window.XMLHttpRequest = XMLHttpRequestSelf;
    // new MyXhr();
    // const ajaxProxy = new AjaxProxy();
    // ajaxProxy.proxyAjax({});
    const data = new XMLHttpRequestSelf();
    return data;
};

export default initXhr;

// class AjaxProxy {
//     // 缓存原生的 XMLHttpRequest 对象
//     private RealXMLHttpRequest: typeof XMLHttpRequest;
//     // 缓存原生的 XMLHttpRequest 对象实例 用来后续的 setter 里的 type 检查
//     private realXMLHttpRequest: XMLHttpRequest;

//     /**
//      * @description 代理 Ajax 的方法，调用这个方法开始代理原生 XMLHttpRequest 对象
//      * @author Lazy Duke
//      * @date 2019-10-27
//      * @param {ProxyMap} proxyMap
//      * @returns
//      */
//     public proxyAjax = (proxyMap: ProxyMap) => {
//         // 参数校验
//         if (proxyMap == null) {
//             throw new TypeError('proxyMap can not be undefined or null');
//         }

//         // 缓存操作，并防止多重代理
//         this.RealXMLHttpRequest = this.RealXMLHttpRequest || window['XMLHttpRequest'];
//         this.realXMLHttpRequest = this.realXMLHttpRequest || new window['XMLHttpRequest']();

//         const that = this;

//         // 代理 XMLHttpRequest 对象
//         const proxy = new Proxy(this.RealXMLHttpRequest, {
//             // 代理 new 操作符
//             construct(Target) {
//                 const xhr = new Target();
//                 // 代理 XMLHttpRequest 对象实例
//                 const xhrProxy = new Proxy(xhr, {
//                     // 代理 读取属性 操作
//                     get(target, p, receiver) {
//                         let type = '';
//                         try {
//                             type = typeof that.realXMLHttpRequest[p]; // 在某些浏览器可能会抛出错误
//                         } catch (error) {
//                             console.error(error);
//                             return target[p];
//                         }

//                         // 代理一些属性诸如 response, responseText...
//                         if (type !== 'function') {
//                             // 通过缓存属性值进 _xxx，代理一些 只读属性
//                             const v = that.hasOwnProperty(`_${p.toString()}`) ? that[`_${p.toString()}`] : target[p];
//                             const attrGetterProxy = (proxyMap[p] || {})['getter'];
//                             return (typeof attrGetterProxy === 'function' && attrGetterProxy.call(target, v, receiver)) || v;
//                         }

//                         // 代理一些属性诸如 open, send...
//                         return (...args) => {
//                             let newArgs = args;
//                             if (proxyMap[p]) {
//                                 const result = proxyMap[p].call(target, args, receiver);
//                                 // 返回值为 true，终止方法
//                                 if (result === true) {
//                                     return;
//                                 }
//                                 // 返回其他 truthy 值，当做新参数传入
//                                 if (result) {
//                                     newArgs = typeof result === 'function' ? result.call(target, ...args) : result;
//                                 }
//                             }
//                             return target[p].call(target, ...newArgs);
//                         };
//                     },
//                     // 代理 设置属性值 操作
//                     set(target, p, value, receiver) {
//                         let type = '';
//                         try {
//                             type = typeof that.realXMLHttpRequest[p]; // 在某些浏览器可能会抛出错误
//                         } catch (error) {
//                             console.error(error);
//                         }

//                         // 禁止修改一些原生方法如 open,send...
//                         if (type === 'function') {
//                             throw new Error(`${p.toString()} in XMLHttpRequest can not be reseted`);
//                         }

//                         // 代理一些事件属性诸如 onreadystatechange,onload...
//                         if (typeof proxyMap[p] === 'function') {
//                             target[p] = () => {
//                                 proxyMap[p].call(target, receiver) || value.call(receiver);
//                             };
//                         } else {
//                             // 代理一些属性如 response, responseText
//                             const attrSetterProxy = (proxyMap[p] || {})['setter'];
//                             try {
//                                 target[p] =
//                                     (typeof attrSetterProxy === 'function' && attrSetterProxy.call(target, value, receiver)) ||
//                                     (typeof value === 'function' ? value.bind(receiver) : value);
//                             } catch (error) {
//                                 // 代理只读属性是会抛出错误
//                                 if (attrSetterProxy === true) {
//                                     // 如果该 只读属性 的 代理setter 为 true
//                                     // 将 value 缓存进 _xxx
//                                     that[`_${p.toString()}`] = value;
//                                 } else {
//                                     throw error;
//                                 }
//                             }
//                         }
//                         return true;
//                     },
//                 });
//                 return xhrProxy;
//             },
//         });

//         window['XMLHttpRequest'] = proxy;
//         return this.RealXMLHttpRequest;
//     };

//     /**
//      * @description 取消代理 Ajax 的方法，调用这个方法取消代理原生 XMLHttpRequest 对象
//      * @author Lazy Duke
//      * @date 2019-10-27
//      * @returns
//      */
//     public unProxyAjax = () => {
//         if (this.RealXMLHttpRequest) {
//             window['XMLHttpRequest'] = this.RealXMLHttpRequest;
//         }
//         this.RealXMLHttpRequest = undefined;
//     };
// }

// export interface ProxyMap {
//     readyState?: AttrProxy<number>;
//     response?: AttrProxy<any>;
//     responseText?: AttrProxy<string>;
//     responseType?: AttrProxy<XMLHttpRequestResponseType>;
//     responseURL?: AttrProxy<string>;
//     responseXML?: AttrProxy<Document | null>;
//     status?: AttrProxy<number>;
//     statusText?: AttrProxy<string>;
//     timeout?: AttrProxy<number>;
//     withCredentials?: AttrProxy<boolean>;
//     upload?: AttrProxy<XMLHttpRequestUpload>;
//     UNSENT?: AttrProxy<number>;
//     OPENED?: AttrProxy<number>;
//     HEADERS_RECEIVED?: AttrProxy<number>;
//     LOADING?: AttrProxy<number>;
//     DONE?: AttrProxy<number>;

//     onreadystatechange?: (xhr: FullWritableXMLHTTPRequest) => void;
//     onabort?: (xhr: FullWritableXMLHTTPRequest) => void;
//     onerror?: (xhr: FullWritableXMLHTTPRequest) => void;
//     onload?: (xhr: FullWritableXMLHTTPRequest) => void;
//     onloadend?: (xhr: FullWritableXMLHTTPRequest) => void;
//     onloadstart?: (xhr: FullWritableXMLHTTPRequest) => void;
//     onprogress?: (xhr: FullWritableXMLHTTPRequest) => void;
//     ontimeout?: (xhr: FullWritableXMLHTTPRequest) => void;

//     open?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
//     abort?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
//     getAllResponseHeaders?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
//     getResponseHeader?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
//     overrideMimeType?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
//     send?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
//     setRequestHeader?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
//     addEventListener?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
//     removeEventListener?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
// }

// export interface AttrProxy<T> {
//     setter?: boolean | SetGetFn<T>;
//     getter?: boolean | SetGetFn<T>;
// }

// export interface SetGetFn<T> {
//     (this: XMLHttpRequest, value: T, xhr: XMLHttpRequest): T;
// }

// export type FullWritableXMLHTTPRequest = XMLHttpRequestUpload & WtritableAttrs;
// export interface WtritableAttrs {
//     readyState: number;
//     response: any;
//     responseText: string;
//     responseURL: string;
//     responseXML: Document | null;
//     status: number;
//     statusText: string;
//     upload: XMLHttpRequestUpload;
//     DONE: number;
//     HEADERS_RECEIVED: number;
//     LOADING: number;
//     OPENED: number;
//     UNSENT: number;
// }
