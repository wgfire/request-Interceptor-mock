console.log('This is background page!');
import { observerProxy } from '../utils/common';
// 数据通过webRequest 存起来

window.mockData = [
    {
        id: 0,
        projectId: 0,
        switch: false,
        api: 'https://api-tools-test.mycaigou.com/account/get-list?o=dhtz',
        headData: {
            body: {
                data: {
                    data: [
                        {
                            user_id: '3a016e0a-90c5-6f94-3e10-ba0665fbcd39',
                            supplier_name: '中国二十冶集团有限公司',
                            name: '邓-=-',
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
// const sendMessageToContent = (target: any) => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id!, {
//             mockData: target,
//             to: 'content', // 发送的地址
//         });
//     });
// };
const mockDataChange = (target: any) => {
    // 当在popup改变mockdata时 触发改变
    // 此时将数据重新发给pageScript 执行新的拦截逻辑
    console.log(target);
  //    sendMessageToContent(target);  // 在background里对content发送消息，有时候会发送失败
};

window.mockData = observerProxy(window.mockData, mockDataChange);
