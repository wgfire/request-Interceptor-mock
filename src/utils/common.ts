export function injectCustomJs(jsPath: string = 'lib/mock.js') {
    return new Promise((resolve) => {
        jsPath = jsPath;
        var temp = document.createElement('script');
        temp.setAttribute('type', 'text/javascript');
        temp.setAttribute('async', 'true');
        // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
        temp.src = chrome.extension.getURL(jsPath);
        document.documentElement.appendChild(temp);
        temp.onload = function () {
            // 放在页面不好看，执行完后移除掉
            //  this.parentNode.removeChild(this);
            resolve(true);
            console.log('注入完成'); // 这里的window 和 页面上的window 除了document对象共享之外，其他变量不共享。
        };
 
    });
}

export function observerProxy(obj: object, onchange: (target: any) => void): any {
    let handler = {
        get(target: any, key: string, receiver: any) {
            console.log('获取：' + key);
            // 如果是对象，就递归添加 proxy 拦截
            if (typeof target[key] === 'object' && target[key] !== null) {
                return observerProxy(target[key], onchange);
            }
            return Reflect.get(target, key, receiver);
        },
        set(target: any, key: string, value: any, receiver: any) {
            console.log(key + '-数据改变了', value);
            onchange && onchange(target);
            return Reflect.set(target, key, value, receiver);
        },
    };
    return new Proxy(obj, handler);
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
 export function debounce(func:Function, wait:number, immediate:boolean) {
    let timeout:number | null;
    return  (...args:any[]) => {
      //@ts-ignore
      const context:any = this;
      //const args = [...arguments];
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        const callNow = !timeout;
        timeout = setTimeout(() => {
          timeout = null;
        }, wait)
        if (callNow) func.apply(context, args)
      }
      else {
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait);
      }
    }
  }
  
