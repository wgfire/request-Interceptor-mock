// /**
//  * xhr代理类
//  * @class XhrProxy
//  * 能够代理xhr的所有属性方法，并且拦截了on开头的属性
//  */
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
    readonly originXhr = new OriginXhr();
    override status = 200;
    constructor() {
        super();
        // console.log(this, '用户的实例');
        // this.writeProperty('onreadystatechange', proxProperty.onreadystatechange);
        // this.writeProperty('onload', proxProperty.onload);
        this.setProxy(proxProperty);
    }
    // onload: ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any) | null = function () {
    //     console.log(this, '加载完成');
    // };
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
        console.log('监听链接', Date.now(), this.responseURL, this.readyState);
    };

    setProxy(proxyMap: typeof proxProperty) {
        console.log(this, 'setProxy');
        const proxy = new Proxy(OriginXhr, {
            construct: (T) => {
                console.log('开始代理', T);
                this.originXhr.addEventListener('load', this.onload.bind(this.originXhr));
                this.originXhr.addEventListener('readystatechange', this.onreadystatechange.bind(this.originXhr));
                return new Proxy(this.originXhr, {
                    get: (target: XMLHttpRequest, key: keyof XMLHttpRequest) => {
                        const type = typeof target[key];
                        console.log(target, key, 'get');
                        if (type === 'function' && this[key]) {
                            return this[key].bind(this.originXhr);
                        }
                        if (type === 'function') {
                            console.log(target, key, 'function');
                            return target[key].bind(this.originXhr);
                        }

                        return target[key];
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

const initXhrs = function (): XMLHttpRequestSelf {
    // window.XMLHttpRequest = XMLHttpRequestSelf;
    // new MyXhr();
    const data = new XMLHttpRequestSelf();
    return data;
};

export default initXhrs;

// class MyXhr extends XMLHttpRequest {
//     private readonly xhr = new XMLHttpRequest();

//     response = '';

//     responseText = '';

//     status = 0;

//     onload = null;

//     onreadystatechange = null;

//     constructor() {
//         super();
//         console.log(this, '实例');
//         this.proxyAttrs();
//     }

//     private proxyAttrs() {
//         // eslint-disable-next-line no-restricted-syntax
//         for (const key in this.xhr) {
//             if (['responseText', 'response', 'status'].includes(key)) {
//                 // 不做任何事情，这三个属性将在 MyXhr 中获取
//             } else if (key === 'onload') {
//                 this.xhr.onload = (...args) => {
//                     // this.overrideResponse();
//                     this.onload?.(...args);
//                 };
//             } else if (key === 'onreadystatechange') {
//                 this.xhr.onreadystatechange = (...args) => {
//                     if (this.xhr.readyState === 4) {
//                         // this.overrideResponse();
//                     }
//                     this.onreadystatechange?.(...args);
//                 };
//             } else {
//                 Object.defineProperty(this, key, {
//                     get: () => {
//                         console.log(key, 'key');
//                         if (key === 'send') {
//                             console.log('get', key);
//                             return this.send.bind(this.xhr);
//                         }
//                         if (this.xhr[key] instanceof Function) {
//                             return this.xhr[key].bind(this.xhr);
//                         }
//                         return this.xhr[key];
//                     },
//                     set: (value) => (this.xhr[key] = value),
//                 });
//             }
//         }
//     }
// }
