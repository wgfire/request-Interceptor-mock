export function injectCustomJs(jsPath: string) {
    return new Promise((resolve) => {
        jsPath = jsPath || 'assets/mock.js';
        var temp = document.createElement('script');
        temp.setAttribute('type', 'text/javascript');
        temp.setAttribute('async', 'true');
        // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
        temp.src = chrome.extension.getURL(jsPath);
        temp.onload = function () {
            // 放在页面不好看，执行完后移除掉
            //  this.parentNode.removeChild(this);
            resolve(true);
            console.log('注入完成'); // 这里的window 和 页面上的window 除了document对象共享之外，其他变量不共享。
        };
        document.head.insertBefore(temp, document.head.firstChild);
    });
}
