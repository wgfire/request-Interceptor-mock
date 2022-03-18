/** 2022年/二月/10日/星期四
*@reviewType.Perf
*@reviewContent By Name
1.接受popup里的事件 刷新mock的数据列表
2.当页面加载完成之后，自动执行开启了mock的url-像background发送消息获取mock列表
*/
import './style.scss';
import { injectCustomJs } from '../../utils/common';
import ReactDOM from 'react-dom';
import { Iframe } from './iframe';
// import { useEffect, useState } from 'react';
console.log(`Current page show`);

let mockData: any = null;
let popup: HTMLDivElement = document.createElement('div');
let show: boolean = false;
const actionMap: {
    [key: string]: (data?: any) => void;
} = {
    start: (request: any) => {
        // 执行或者刷新mock拦截数据
        window.postMessage({
            action: 'start',
            to: 'pageScript',
            mockData: request.mockData,
        });
    },
    toggle: () => {
        show = !show;
        popup.style.setProperty(
            'transform',
            show ? 'translateX(0)' : 'translateX(450px)',
            'important',
        );
    },
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.to === 'content') {
        console.log(request, sender, 'content收到消息');
        // 转发给pagescript内容
        const name = request.action as string;
        actionMap[name] && actionMap[name](request);
        if (sendResponse) sendResponse();
    }
});

injectCustomJs('js/pageScript.js').then(() => {});

chrome.runtime.sendMessage({ action: 'getMock', to: 'background' }, function (response) {
    if (response) {
        mockData = response;
        console.log(mockData, '获取到的mock数据');
        window.postMessage({
            action: 'start',
            to: 'pageScript',
            mockData: mockData,
        });
    }
});
document.onreadystatechange = function () {
    // 有document的时候 准备插入交互界面
    if (document.readyState === 'complete') {
        popup.setAttribute('id', 'popup');
        document.body.appendChild(popup);
        ReactDOM.render(<Iframe mockData={mockData} />, popup);
        popup.style.setProperty('transform', 'translateX(450px)', 'important');
    }
};


