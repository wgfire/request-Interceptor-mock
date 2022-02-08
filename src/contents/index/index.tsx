import './style.scss';
import { injectCustomJs } from '../../utils/common';
console.log(`Current page show`);
injectCustomJs('lib/mock.js').then(() => {
    injectCustomJs('js/pageScript.js');
}); // 注入mock js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.to === 'content') {
        console.log(request, sender, 'content收到消息');
        // 转发给pagescript内容
        window.postMessage({
            action: 'start',
            to: 'pageScript',
            mockData: request.mockData,
        });
        if (sendResponse) sendResponse();
    }
});
