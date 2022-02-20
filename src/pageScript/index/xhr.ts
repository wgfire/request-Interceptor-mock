/** 2022年/二月/16日/星期三
*@reviewType.Perf
*@reviewContent By Name
1.重写xhr请求支持修改响应头和请求头
*/
// @ts-nocheck
interface originalXhrInterface extends XMLHttpRequest {}
const originXhr = new window.XMLHttpRequest();
const Overload: XMLHttpRequest = {
    onreadystatechange(ev: XMLHttpRequestEventMap['readystatechange']) {
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
    },
};
class Xhr extends XMLHttpRequest {
      constructor () {
        super()
        // for(let selfAttr in Overload) {
        //     console.log(selfAttr,'self')
        //     originXhr[selfAttr] = Overload[selfAttr].bind(originXhr)
        // }

        // for (let attr in originXhr) {
        //     if(attr==='onreadystatechange'){
        //         originXhr[attr] = this.onreadystatechange
        //     }

        //     if (typeof originXhr[attr] === 'function') {
        //         this[attr] = originXhr[attr].bind(originXhr);
        //     } else {
        //         this[attr] = originXhr[attr];
               
        //     }
        // }

    }
    send(body?: Document | XMLHttpRequestBodyInit | null): void {
        console.log(body,'body');
        super.send(body)
        
    }
    onreadystatechange (ev: XMLHttpRequestEventMap['readystatechange']) {
        console.log('状态改变', this.readyState, this.responseURL,this.responseText);
        if (this.readyState == 4) {
            console.log('请求完成');
        }
    }

}
const proxied =  window.XMLHttpRequest.prototype.open
// const onreadystatechange   = window.XMLHttpRequest.prototype.onreadystatechange
 
window.XMLHttpRequest.prototype.open = function () {
    console.log( arguments );
    return proxied.apply(this, [].slice.call(arguments));
}


// window.XMLHttpRequest = Xhr
// req.prototype.open = function (method, url) {
//     if (url) {
//         // 成立的情况，原样发送
//         console.log('拦截');

//         req.prototype.open = xhr.open;
//         xhr.open(method, url);
//     } else {
//         // 不成立的时候，进行拦截处理
//         //  处理函数
//     }
// };






// class AnyXHR {
//     /**
//      * 构造函数
//      * @param {*} hooks 
//      * @param {*} execedHooks 
//      */
//       constructor(hooks = handel, execedHooks = {}) {
//         // 单例
//         if (AnyXHR.instance) {
//           return AnyXHR.instance;
//         }
     
//         this.XHR = window.XMLHttpRequest;
     
//         this.hooks = hooks;
//         this.execedHooks = execedHooks;
//         this.init();
     
//         AnyXHR.instance = this;
//       }
     
//       /**
//        * 初始化 重写xhr对象
//        */
//       init() {
//         let _this = this;
     
//         window.XMLHttpRequest = function() {
//           this._xhr = new _this.XHR();
     
//           _this.overwrite(this);
//         }
     
//       }
     
//       /**
//        * 添加勾子
//        * @param {*} key 
//        * @param {*} value 
//        */
//       add(key, value, execed = false) {
//         if (execed) {
//           this.execedHooks[key] = value;
//         } else {
//           this.hooks[key] = value;
//         }
//         return this;
//       }
     
//       /**
//        * 处理重写
//        * @param {*} xhr 
//        */
//       overwrite(proxyXHR) {
//         for (let key in proxyXHR._xhr) {
          
//           if (typeof proxyXHR._xhr[key] === 'function') {
//             this.overwriteMethod(key, proxyXHR);
//             continue;
//           }
     
//           this.overwriteAttributes(key, proxyXHR);
//         }
//       }
     
//       /**
//        * 重写方法
//        * @param {*} key 
//        */
//       overwriteMethod(key, proxyXHR) {
//         let hooks = this.hooks;
//         let execedHooks = this.execedHooks;
     
//         proxyXHR[key] = (...args) => {
//           // 拦截
//         //   if (hooks[key] && (hooks[key].call(proxyXHR, args) === false)) {
//         //     return;
//         //   }
          
//           // 执行方法本体
//           const res = proxyXHR._xhr[key].apply(proxyXHR._xhr, args);
     
//           // 方法本体执行后的钩子
//           execedHooks[key] && execedHooks[key].call(proxyXHR._xhr, res);
     
//           return res;
//         };
//       }
     
//       /**
//        * 重写属性
//        * @param {*} key 
//        */
//       overwriteAttributes(key, proxyXHR) {
//         Object.defineProperty(proxyXHR, key, this.setProperyDescriptor(key, proxyXHR));
//       }
     
//       /**
//        * 设置属性的属性描述
//        * @param {*} key 
//        */
//       setProperyDescriptor(key, proxyXHR) {
//         let obj = Object.create(null);
//         let _this = this;
     
//         obj.set = function(val) {
     
//           // 如果不是on打头的属性
//           if (!key.startsWith('on')) {
//             proxyXHR['__' + key] = val;
//             return;
//           }
     
//           if (_this.hooks[key]) {
     
//             this._xhr[key] = function(...args) {
//               (_this.hooks[key].call(proxyXHR), val.apply(proxyXHR, args));
//             }
     
//             return;
//           }
     
//           this._xhr[key] = val;
//         }
     
//         obj.get = function() {
//           return proxyXHR['__' + key] || this._xhr[key];
//         }
     
//         return obj;
//       }
     
//       /**
//        * 获取实例
//        */
//       getInstance() {
//         return AnyXHR.instance;
//       }
     
//       /**
//        * 删除钩子
//        * @param {*} name 
//        */
//       rmHook(name, isExeced = false) {
//         let target = (isExeced ? this.execedHooks : this.hooks);
//         delete target[name];
//       }
     
//       /**
//        * 清空钩子
//        */
//       clearHook() {
//         this.hooks = {};
//         this.execedHooks = {};
//       }
     
//       /**
//        * 取消监听
//        */
//       unset() {
//         window.XMLHttpRequest = this.XHR;
//       }
     
//       /**
//        * 重新监听
//        */
//       reset() {
//         AnyXHR.instance = null;
//         AnyXHR.instance = new AnyXHR(this.hooks, this.execedHooks);
//       }
//     }

// new AnyXHR({
//     send:function(body) {
//         console.log(JSON.parse(body[0]),'body');
//         return true
//     },
//     open:function(method) {
//         console.log(method,'method');
//     }

// })