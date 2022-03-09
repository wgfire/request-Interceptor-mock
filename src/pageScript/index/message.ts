// 处理接受消息的行为

export const MockUrl = [
    {
        statu: 200, // 状态
        switch: true, // 是否开启拦截
        cancel: false, // 是否取消请求
        url: 'https://api-tools-test.mycaigou.com/message/erp-template-list?o=gyltest',
        request: {
            // 请求携带的信息
            headers: [],
            timeout: 2000,
            data: {}, // 请求携带的数据
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
            headers: [],
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
