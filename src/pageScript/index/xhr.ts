/** 2022年/二月/16日/星期三
*@reviewType.Perf
*@reviewContent By Name
1.重写xhr请求支持修改响应头和请求头
*/
// @ts-nocheck
interface originalXhrInterface extends XMLHttpRequest {}
const originXhr = new window.XMLHttpRequest();

class Xhr {
    constructor() {
        console.log('XX', this.__proto__);
        for (let selfAttr in this.__proto__) {
            console.log(selfAttr, 'selfAttr');

            // if (this.__proto__.hasOwnProperty(selfAttr)) {
            //     console.log(selfAttr, 'selfAttr');
            //     originXhr[selfAttr] = this[selfAttr];
            // }
        }
        // for (let attr in originXhr) {
        //     if (typeof originXhr[attr] === 'function') {
        //         this[attr] = originXhr[attr].bind(originXhr);
        //     } else {
        //         this[attr] = originXhr[attr];
        //     }
        // }
    }
    send(body?: Document | XMLHttpRequestBodyInit | null): void {
        console.log(body, 'body');
    }
    setRequestHeader(name: string, value: string): void {
        console.log(name, value);
    }
}

window.XMLHttpRequest = Xhr;
