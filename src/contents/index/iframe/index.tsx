console.log('我是准备拦截器交互的界面');
let iframe: HTMLIFrameElement = document.createElement('iframe');
// 只在最顶层页面嵌入iframe
if (window.self === window.top) {
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            iframe.className = 'api-interceptor';
            iframe.style.setProperty('height', '100%', 'important');
            iframe.style.setProperty('width', '450px', 'important');
            iframe.style.setProperty('min-width', '1px', 'important');
            iframe.style.setProperty('position', 'fixed', 'important');
            iframe.style.setProperty('top', '0', 'important');
            iframe.style.setProperty('right', '0', 'important');
            iframe.style.setProperty('left', 'auto', 'important');
            iframe.style.setProperty('bottom', 'auto', 'important');
            iframe.style.setProperty('z-index', '9999999999999', 'important');
            iframe.style.setProperty('transform', 'translateX(470px)', 'important');
            iframe.style.setProperty('transition', 'all .4s', 'important');
            iframe.style.setProperty('box-shadow', '0 0 15px 2px rgba(0,0,0,0.12)', 'important');
            iframe.frameBorder = 'none';
            iframe.src = chrome.extension.getURL('iframe/index.html');
            document.body.appendChild(iframe);
            let show = false;

            chrome.runtime.onMessage.addListener((response) => {
                if (response.action == 'toggle') {
                    show = !show;
                    iframe.style.setProperty(
                        'transform',
                        show ? 'translateX(0)' : 'translateX(470px)',
                        'important',
                    );
                }

                return true;
            });
        }
    };
}
