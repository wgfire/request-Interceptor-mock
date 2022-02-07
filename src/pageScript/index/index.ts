console.log(window.Mock);
const Mock = window.Mock;
if (Mock) {
    const mockData = Mock.mock({
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
    });
    Mock.mock('https://api-tools-test.mycaigou.com/account/get-list?o=dhtz', 'POST', () => {
        console.log('拦截到请求');
        return mockData;
    });
    console.log('拦截到请求', new Date().getTime());
}
