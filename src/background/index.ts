console.log('This is background page!');
import { observerProxy } from '../utils/common';
import './webRequest';
// 数据通过webRequest 存起来
export interface mockDataInterfaceItem {
 statu:number,
 switch:boolean,
 cancel:boolean,
 url:string,
 request:{
     headers:any[];
     timeout:number;
     data:any
 }
 response:any
}
window.mockData = [
    {
        statu: 200, // 状态
        switch: true, // 是否开启拦截
        cancel: false, // 是否取消请求
        url: 'https://api-tools-test.mycaigou.com/message/erp-template-list?o=gyltest',
        request: {
            // 请求携带的信息
            headers: {},
            timeout: 2000,
            data: {
                data:{},
                token:"3a028a07-bb7b-6dab-87d8-dad64f29ddd3",
                name:"wg"
            }, // 请求携带的数据
        },
        response: {
            data: {
                list:[{
                    "id": "3a0209d9-ce46-b8f8-3214-25830e3b0fc6",
                    "business_type": "1",
                    "title": "test",
                    "msg_code": "test-zq",
                    "erp_version": "default",
                    "site_template_id": "t-site-test-zq",
                    "sms_template_id": "t-sms-test-zq",
                    "email_template_id": "",
                    "ycg_wechat_template_id": "",
                    "remark": "tsest",
                    "created_by": "王港mock",
                    "created_time": "2022-02-14 18:00:14",
                    "modified_by": null,
                    "modified_time": "2022-02-14 18:00:14",
                    "is_deleted": "0",
                    "message_type_code": "1",
                    "is_edit": true
                }],
                total: "95"
            },
       
            msg: '操作成功',
            status: true,
        },
    },
    {
        statu: 200, // 状态
        switch: true, // 是否开启拦截
        cancel: false, // 是否取消请求
        url: 'https://api-tools-test.mycaigou.com/message/erp-record-list?o=gyltest',
        request: {
            // 请求携带的信息
            headers: {},
            timeout: 2000,
            data: {}, // 请求携带的数据
        },
        response: {
            data: {
                list:[{
                    "id": "133",
                    "tenant_id": "cz_607e37c4c8637",
                    "msg_code": "test-zq",
                    "title": "test",
                    "sms_template_id": "t-sms-test-zq",
                    "sms_content": "asdf",
                    "site_template_id": "t-site-test-zq",
                    "site_content": "asdf",
                    "site_message_type_code": "1",
                    "detail_url": "",
                    "detail_target_menu": "",
                    "wechat_template_id": null,
                    "wechat_content": null,
                    "wechat_remark": null,
                    "apply_reason": "tsest",
                    "reject_reason": "",
                    "from": "portal",
                    "status": "2",
                    "verify_by": "陈思思mock",
                    "verify_on": "2022-02-14 18:00:14",
                    "created_by": "mock",
                    "created_on": "2021-12-20 15:31:04",
                    "modified_by": "39fc28af-e1f4-4ae6-4861-ebca84bc04b6",
                    "modified_on": "2021-12-20 15:31:04",
                    "is_deleted": "0"
                }],
                total: "27"
            },
       
            msg: '操作成功',
            status: true,
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
