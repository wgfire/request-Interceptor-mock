console.log('This is background page!');
import { observerProxy } from '../utils/common';
import './webRequest';
// 数据通过webRequest 存起来

window.mockData = [
    {
        id: 0,
        projectId: 0,
        switch: true,
        api: 'https://api-tools-test.mycaigou.com/account/get-list?o=gyltest',
        headData: {
            body: {
                data: {
                    'data|1-2': [
                        {
                            user_id: '3a016e0a-90c5-6f94-3e10-ba0665fbcd39',
                            supplier_name: '中国二十冶集团有限公司',
                            'name|1-3': '邓-=-',
                        },
                    ],
                    page: 1,
                    pageSize: '10',
                    total: '209',
                },
                msg: '',
                status: true,
            },
            status: 200,
        },
    },
];

const mockDataChange = (target: any) => {
    // 当在popup改变mockdata时 触发改变
    // 此时将数据重新发给pageScript 执行新的拦截逻辑
    console.log(target);
    //    sendMessageToContent(target);  // 在background里对content发送消息，有时候会发送失败
};

window.mockData = observerProxy(window.mockData, mockDataChange);

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log('发送消息');
        chrome.tabs.sendMessage(tabs[0].id!, { to: 'content', action: 'toggle' });
    });
});

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
    console.log('收到来自content-script的消息：发送mock数据', window.mockData);
    if (request.to === 'background' && request.action === 'getMock') sendResponse(window.mockData);
});
