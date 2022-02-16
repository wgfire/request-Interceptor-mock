/** 2022年/二月/16日/星期三
*@reviewType.Perf
*@reviewContent By Name
1.重写xhr请求支持修改响应头和请求头
*/
interface originalXhrInterface extends XMLHttpRequest {}

// class Xhr extends XMLHttpRequest {
//     constructor() {
//         super();
//     }
//     send(body?: Document | XMLHttpRequestBodyInit | null): void {
//         console.log(body, 'body');
//         super.send(body);
//     }
//     onreadystatechange = (ev: XMLHttpRequestEventMap['readystatechange']) => {
//         console.log('状态改变', this.readyState, this.responseURL);

//         if (this.readyState == 4) {
//             console.log('请求完成');
//         }

//         super.onreadystatechange?.(ev);
//     };
//     setRequestHeader(name: string, value: string): void {
//         console.log(name, value);
//         super.setRequestHeader(name, value);
//     }
// }

var aa = XMLHttpRequest.prototype.onreadystatechange;

XMLHttpRequest.prototype.onreadystatechange = function () {
    console.log('状态改变', this.readyState, this.responseURL);
    // aa?.apply(this, args);
};

// window.XMLHttpRequest = Xhr;
