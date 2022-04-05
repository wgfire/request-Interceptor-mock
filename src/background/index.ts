console.log('This is background page!');
import { observerProxy } from '../utils/common';
import './webRequest';
// 数据通过webRequest 存起来

chrome.storage.local.get('mockData', (res) => {
    console.log(res, '读取的本地数据');
    const mockData = res['mockData'];
    start(Array.isArray(mockData)?mockData:[]);
});
const mockDataChange = (target: any) => {
    // 当在popup改变mockdata时 触发改变
    // 此时将数据重新发给pageScript 执行新的拦截逻辑
    console.log(target, '属性被改变');
    //    sendMessageToContent(target);  // 在background里对content发送消息，有时候会发送失败
};

const actionMap: { [key: string]: Function } = {
    getMock: (fn: (arg: any) => void) => {
        console.log('收到来自content-script的消息：发送mock数据', window.mockData);
        fn(window.mockData);
    },
    setMock: (fn: (arg: any) => void, arg: any[]) => {
        window.mockData = arg.filter(el=>{
            return el.switch ===true
        });
        fn(arg);
        chrome.storage.local.set({ mockData: window.mockData }, () => {
            console.log('更新background mockData 成功',window.mockData);
        });
        // 发送给content 消息，将popup里更新的好的数据传递过去。
    },
    clearMock: (fn: (arg: any) => void, arg: any) => {
        chrome.storage.local.clear().then((res) => {
            console.log('清除后台数据', res);
            fn(arg);
        });
    },
};
const start = (data: any) => {
    console.log(data);
    window.mockData = data.length > 0 ? data : [];
    window.mockData = observerProxy(window.mockData, mockDataChange);
    chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
      
        actionMap[request.action](sendResponse, request.data);
    });
};

// chrome.browserAction.onClicked.addListener(function () {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         console.log('发送消息');
//         chrome.tabs.sendMessage(tabs[0].id!, { to: 'content', action: 'toggle' });
//     });
// });

export const mockData  = window.mockData