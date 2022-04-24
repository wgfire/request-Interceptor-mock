// import './webRequest';

import { observerProxy } from '../utils/common';
import { mockDataItem } from '../pageScript/index/utils';

console.log('This is background page!');
// 数据通过webRequest 存起来
let mockData: mockDataItem[];
chrome.storage.local.get('mockData', (res) => {
    console.log(res, '读取的本地数据');
    const { mockData } = res;
    start(Array.isArray(mockData) ? mockData : []);
});
const mockDataChange = (target: any) => {
    // 当在popup改变mockdata时 触发改变
    // 此时将数据重新发给pageScript 执行新的拦截逻辑
    console.log(target, '属性被改变');
    //    sendMessageToContent(target);  // 在background里对content发送消息，有时候会发送失败
};

const actionMap: { [key: string]: (fn: (arg: any) => void, arg: any) => void } = {
    getMock: (fn: (arg: any) => void) => {
        console.log('收到来自content-script的消息：发送mock数据', mockData);
        fn(mockData);
    },
    setMock: (fn: (arg: any) => void, arg: mockDataItem[]) => {
        mockData = arg.filter((el) => el.switch === true);
        fn(arg);
        chrome.storage.local.set({ mockData: mockData }, () => {
            console.log('更新background mockData 成功', mockData);
        });
        // 发送给content 消息，将popup里更新的好的数据通过content在传到pagescript里。
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, { action: 'setMock', to: 'content', data: arg });
        });
    },
    clearMock: (fn: (arg: any) => void, arg: any) => {
        chrome.storage.local.clear().then((res) => {
            console.log('清除后台数据', res);
            fn(arg);
        });
    },
    toggle: (fn: (arg: any) => void, arg: any) => {
        // 在转发给content-script进行切换展开。
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, { action: 'toggle', to: 'content', data: '' });
        });
    },
    update: (fn: (arg: any) => void, arg: any) => {
        // 将实时拦截的请求发送给popup
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log('background更新mock数据到popup', arg);
            chrome.tabs.sendMessage(tabs[0].id!, { action: 'update', to: 'popup', data: arg });
        });
    },
};
const start = (data: any) => {
    console.log(data);
    mockData = data.length > 0 ? data : [];
    mockData = observerProxy(mockData, mockDataChange);
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
        if (request.to === 'background') {
            console.log('后台收到来自content-script的消息：', request);
            actionMap[request.action](sendResponse, request.data);
        }
    });
};

// chrome.browserAction.onClicked.addListener(function () {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         console.log('发送消息');
//         chrome.tabs.sendMessage(tabs[0].id!, { to: 'content', action: 'toggle' });
//     });
// });
