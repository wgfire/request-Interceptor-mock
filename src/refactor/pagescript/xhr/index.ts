/**
 * xhr代理类
 * @class XhrProxy
 * 能够代理xhr的所有属性方法，并且拦截了on开头的属性
 */
const proxProperty = {
    onload: function (this: XMLHttpRequest, event: Event): void {
        console.log(this, '加载完成');
    },
    onreadystatechange: function (this: XMLHttpRequest, ev: Event) {
        console.log('监听链接', Date.now(), this.responseURL, this.readyState);
    },
    send(this: XMLHttpRequestSelf, body?: Document | XMLHttpRequestBodyInit | null): void {
        this.originXhr.send.call(this.originXhr, body);
    },
    open(this: XMLHttpRequestSelf, method: string, url: string | URL): void {
        console.log(Date.now(), '打开链接', url);
        this.originXhr.open(method, url);
    },
};
const originXhr = window.XMLHttpRequest;
class XMLHttpRequestSelf extends XMLHttpRequest {
    readonly originXhr = new originXhr();
    status = 200;
    readonly DONE: number = 1;
    OPENED: number = 1;

    constructor() {
        super();
        console.log(this, '用户的实例');
        this.setProxy();

        this.writeProperty('onload', proxProperty.onload);

        this.writeProperty('onreadystatechange', proxProperty.onreadystatechange);
        this.writePropertys();
        //  this.writeProperty('send', proxProperty.send.bind(this));
        //this.writeProperty('open', proxProperty.open.bind(this));
        // this.writeProperty();
    }

    // onload: ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any) | null = () => {
    //     console.log(this, '加载完成');
    // };

    setProxy() {
        new Proxy(this, {
            get(target: XMLHttpRequestSelf, key: keyof XMLHttpRequestSelf) {
                console.log('get-------------', key);
                if (Object.keys(this).includes(key)) {
                    return target[key];
                }
                return target.originXhr[key as keyof XMLHttpRequest];
            },
            set(target: XMLHttpRequestSelf, key: keyof XMLHttpRequest, value: any) {
                console.log('set------------', key, value);
                //@ts-ignore
                return (target.originXhr[key as keyof XMLHttpRequest] = value); //无法分配到 "DONE" ，因为它是只读属性。
            },
        });
    }
    writeProperty(key: keyof XMLHttpRequest, value: any) {
        //@ts-ignore
        this[key] = value;
    }
    writePropertys() {
        const proxyOn = ['open', 'send'];
        for (let key in this) {
            if (proxyOn.includes(key)) {
                // this.writeProperty(key as keyof XMLHttpRequest, proxProperty[key as keyof typeof proxProperty]);
                //@ts-ignore
                this[key as keyof XMLHttpRequest] = proxProperty[key as keyof typeof proxProperty].bi;
            }
        }
    }
}

const initXhrs = function (): void {
    // @ts-ignore 重新定义window下的xmlHttpRequest类型
    // window.XMLHttpRequest = function (this: XMLHttpRequest): typeof window.XMLHttpRequest {
    //     const proxyXhr = new Proxy(originXhr, {
    //         get(target, key: string): any {
    //             console.log(`get ${key}`);
    //             return target[key];
    //         },
    //     });
    //     console.log(this, 'xhr的实例');

    //     // const xhrProxy = new Proxy(xhr, {
    //     //     get(target, key: string) {
    //     //         console.log(target, key, 'xhr代理');
    //     //         if (key.indexOf('on') === 0) {
    //     //             return function (...arg: any[]) {
    //     //                 const eventName = key.slice(2);
    //     //                 const event = new Event(eventName, { bubbles: true, cancelable: false }) as Events;
    //     //                 //  event.detail = [...arg];
    //     //                 event.data = arg;
    //     //                 document.dispatchEvent(event);
    //     //             };
    //     //         }
    //     //         return target;
    //     //     },
    //     //     set(target, p, value, receiver) {
    //     //         console.log(target, p, value, receiver, 'xhr代理');
    //     //         return Reflect.set(target, p, value, receiver);
    //     //     },
    //     // });
    //     return proxyXhr;
    // };

    window.XMLHttpRequest = XMLHttpRequestSelf;
};

export default initXhrs;
