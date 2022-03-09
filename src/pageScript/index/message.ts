// 处理接受消息的行为

export const MockUrl = [
    {
        statu: 200, // 状态
        switch: true, // 是否开启拦截
        cancel: false, // 是否取消请求
        url: 'https://api-tools-test.mycaigou.com/tenant/tenant-list',
        request: {
            // 请求携带的信息
            headers: [{}],
            timeout: 2000,
            data: {}, // 请求携带的数据
        },
        response: {
            data: {
                bid_system_version_note: [
                    {
                        erp_version: 'v4.0',
                        version_name: '采招ERP4.0',
                    },
                    {
                        erp_version: 'v3.5',
                        version_name: '采招ERP3.5',
                    },
                    '…',
                ],
                list: [
                    {
                        tenant_id: 'cz_60c022e3e01c2',
                        tenant_code: 'cqdydc',
                        portal_type: 'new',
                        tenant_name: '重庆东原地产MOCK',
                        bid_app_code: 'cgbid',
                        bid_system_version: 'v3.5',
                        bid_lease_start_time: '2021-06-08',
                        bid_lease_end_time: '2021-07-08',
                        bid_is_enable: '1',
                        bid_isbuyout: '1',
                        material_app_code: 'material',
                        material_system_version: 'v3.5',
                        material_lease_start_time: '2021-06-08',
                        material_lease_end_time: '2021-07-08',
                        material_is_enable: '0',
                        material_isbuyout: '1',
                        material_left_time: '已禁用',
                        bid_left_time: '买断',
                        address_url: 'https://home-test.myyscm.com/cqdydc',
                        app_type: ['material', 'cgbid'],
                        label_list: [
                            {
                                note_id: '201d7cee-c5aa-11eb-b960-6c92bf475505',
                                note_name: '多租户(主)',
                                tenant_id: 'cz_60c022e3e01c2',
                            },
                        ],
                        cgbid_manager_info: null,
                        material_manager_info: null,
                    },
                ],
                total: '365',
            },
            msg: '',
            status: true,
        },
    },
];
