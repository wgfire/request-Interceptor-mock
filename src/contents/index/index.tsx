import { injectCustomJs, postMockDataToScript } from '../../utils/common';

/** 2022年/二月/10日/星期四
*@reviewType.Perf
*@reviewContent By Name
1.接受popup里的事件 刷新mock的数据列表
2.当页面加载完成之后，自动执行开启了mock的url-像background发送消息获取mock列表
*/
import './style.scss';

console.log(`Current page show`);

let mockData: any;
let show = false; // iframe是否展开的字段
const iframe: HTMLIFrameElement = document.createElement('iframe');
const actionMap: any = {
    toggle: (request: any, sendResponse: () => void) => {
        console.log('收到popup的toggle事件');
        show = !show;
        iframe?.style.setProperty('transform', show ? 'translateX(0px)' : 'translateX(480px)', 'important');
    },
    setMock: (request: any, sendResponse: () => void) => {
        console.log('收到popup的setMock事件,转发给pagescript');
        postMockDataToScript(request.data);
    },
    update: (data: any, sendResponse: () => void) => {
        console.log('收到pagescript的update事件,转发给background到popup', data);
        chrome.runtime.sendMessage({ to: 'background', action: 'update', data });
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
            iframe.src = chrome.runtime.getURL('popup.html');
            document.body.append(iframe);
            console.log('iframe插入成功', iframe);
        }
    });
}
/** 发送消息给后台获取mockdata 通信由于是异步的很费时间，所以在content直接取 */
chrome.storage.local.get('mockData', (res) => {
    console.log(res, '读取的本地数据');
    mockData = res.mockData; // 这个mockData 给 popup界面使用
    createPopup();
    injectCustomJs('js/pageScript.js').then(() => {
        postMockDataToScript(mockData); //  需要在js挂载成功之后 再去发送消息
    });
});

window.addEventListener('message', (event) => {
    // 接受pagescript的消息的
    const { action, data } = event.data;
    if (actionMap[action]) {
        actionMap[action](data);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.to === 'content') {
        console.log(request, sender, 'content收到消息');
        const name = request.action as string;
        actionMap[name] && actionMap[name](request, sendResponse);
    }
});
