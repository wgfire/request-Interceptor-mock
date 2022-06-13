/**
 * xhr代理类
 * @class XhrProxy
 * 能够代理xhr的所有属性方法，并且拦截了on开头的属性
 */

const initXhrs = function (): void {
    // @ts-ignore 重新定义window下的xmlHttpRequest类型
    window.XMLHttpRequest = function (): typeof window.XMLHttpRequest {
        const xhr = this as unknown as XMLHttpRequest; // this为空对象
        console.log(xhr, this, 'xhr的实例');

        // const xhrProxy = new Proxy(xhr, {
        //     get(target, key: string) {
        //         console.log(target, key, 'xhr代理');
        //         if (key.indexOf('on') === 0) {
        //             return function (...arg: any[]) {
        //                 const eventName = key.slice(2);
        //                 const event = new Event(eventName, { bubbles: true, cancelable: false }) as Events;
        //                 //  event.detail = [...arg];
        //                 event.data = arg;
        //                 document.dispatchEvent(event);
        //             };
        //         }
        //         return target;
        //     },
        //     set(target, p, value, receiver) {
        //         console.log(target, p, value, receiver, 'xhr代理');
        //         return Reflect.set(target, p, value, receiver);
        //     },
        // });
        return xhr as unknown as typeof window.XMLHttpRequest;
    };
};

export default initXhrs;
