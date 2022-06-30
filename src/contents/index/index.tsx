import { injectCustomJs, postMockDataToScript, readStorageAll } from '../../utils/common';
import { mockDataItem } from '../../utils/type';

/** 2022年/二月/10日/星期四
*@reviewType.Perf
*@reviewContent By Name
1.接受popup里的事件 刷新mock的数据列表
2.当页面加载完成之后，自动执行开启了mock的url-像background发送消息获取mock列表
*/
import './style.scss';

console.log(`Current page show`);

let show = false; // iframe是否展开的字段
const iframe: HTMLIFrameElement = document.createElement('iframe');
const actionMap: any = {
    toggle: (request: any) => {
        console.log('收到popup的toggle事件');
        show = !show;
        iframe?.style.setProperty('transform', show ? 'translateX(0px)' : 'translateX(480px)', 'important');
    },
    setMock: (request: any) => {
        console.log('收到popup的setMock事件,转发给pagescript');
        const action = request.data.config.proxySwitch ? 'start' : 'cancel';
        postMockDataToScript(request.data, action);
    },
    update: (data: mockDataItem) => {
        console.log('收到pagescript的update事件,转发给background到popup', data);
        chrome.runtime.sendMessage({ to: 'background', action: 'update', data });
    },
    error: (data: { url: string }) => {
        console.log('content接受到error');
        chrome.runtime.sendMessage({ to: 'background', action: 'error', data });
    },
    reload: (data: any) => {
        console.log('content接受到reload');
        window.top?.location.reload();
    },
};

function createPopup() {
    // 有些网站可能加载的数据比较多，所以还是要在一个回调函数里等document有了在插入
    document.addEventListener('DOMContentLoaded', () => {
        // 只在最顶层页面嵌入iframe
        if (window.self === window.top) {
            iframe.setAttribute('frameborder', 'none');
            iframe.setAttribute('id', 'mt-chrome-extension-iframe');
            iframe.setAttribute('allowfullscreen', 'true'); // 允许iframe全屏
            iframe.src = chrome.extension.getURL('popup.html');
            document.body.append(iframe);
            console.log('iframe插入成功', iframe);
        }
    });
}

function start() {
    const map = readStorageAll();
    chrome.runtime.sendMessage({ to: 'background', action: 'onload' });
    map.then((res) => {
        console.log('读取本地数据', res);
        createPopup();
        injectCustomJs('js/pageScript.js').then(() => {
            if (res.config.proxySwitch) {
                postMockDataToScript(res); //  需要在js挂载成功之后 再去发送消息
            }
        });
    });
}
start();

window.addEventListener('message', (event) => {
    // 接受pagescript的消息的
    const { action, data } = event.data;
    if (actionMap[action]) {
        actionMap[action](data);
    }
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.to === 'content') {
        const name = request.action as string;
        console.log(request, 'content收到消息', name);
        actionMap[name] && actionMap[name](request);
    }
});
