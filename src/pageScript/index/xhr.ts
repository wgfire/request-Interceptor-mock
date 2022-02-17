/** 2022年/二月/16日/星期三
*@reviewType.Perf
*@reviewContent By Name
1.重写xhr请求支持修改响应头和请求头
*/
// @ts-nocheck
interface originalXhrInterface extends XMLHttpRequest {}
const originXhr = new window.XMLHttpRequest();
const Overload:XMLHttpRequest = {
    
    onreadystatechange (ev: XMLHttpRequestEventMap['readystatechange']) {
        console.log('状态改变', this.readyState, this.responseURL);
        if (this.readyState == 4) {
            console.log('请求完成');
        } 
    },
    send(body?: Document | XMLHttpRequestBodyInit | null): void {
        console.log(body, 'body');
      
    },
    setRequestHeader(name: string, value: string): void {
        console.log(name, value);
    }
}
class Xhr  {
      constructor () {
        console.log(this)
        // for(let selfAttr in Overload) {
        //     console.log(selfAttr,'self')
        //     originXhr[selfAttr] = Overload[selfAttr].bind(originXhr)
        // }
      
        for (let attr in originXhr) {
            if(attr==='onreadystatechange'){
                originXhr[attr] = this.onreadystatechange
            }
            if(attr==='send'){
                originXhr[attr] = this.send
            }
          

            if (typeof originXhr[attr] === 'function') {
                this[attr] = originXhr[attr].bind(originXhr);
            } else {
                this[attr] = originXhr[attr];
            }
        }
    
    }
    onreadystatechange (ev: XMLHttpRequestEventMap['readystatechange']) {
        console.log('状态改变', this.readyState, this.responseURL);
        if (this.readyState == 4) {
            console.log('请求完成');
        } 
    }
    send(body?: Document | XMLHttpRequestBodyInit | null): void {
        console.log(body, 'body');

    }
}

window.XMLHttpRequest = Xhr;
