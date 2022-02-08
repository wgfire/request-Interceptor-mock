console.log(window.Mock);
const Mock = window.Mock;
window.addEventListener('message', (e) => {
    console.log(e);
    if (e.data.action === 'start') actionMap.start(e.data.mockData);
});

const startXhr = (mockData: any) => {
    console.log('执行成功');
    refreshMockAction(mockData);
};
const actionMap = {
    start: startXhr,
};

// if (Mock) {
//     const mockData = Mock.mock({
//         data: {
//             data: [
//                 {
//                     user_id: '3a016e0a-90c5-6f94-3e10-ba0665fbcd39',
//                     supplier_name: '中国二十冶集团有限公司',
//                     name: '邓-=-',
//                 },
//             ],
//             page: 1,
//             pageSize: '10',
//             total: '209',
//         },
//         msg: '',
//         status: true,
//     });
//     Mock.mock('https://api-tools-test.mycaigou.com/account/get-list?o=dhtz', 'POST', () => {
//         console.log('拦截到请求');
//         return mockData;
//     });
//     console.log('拦截到请求', new Date().getTime());
// }

export const refreshMockAction = (mockData: Array<any>) => {
    // 重新用mockjs 执行一遍对应数据的拦截逻辑
    mockData.forEach((item) => {
        if (item.switch) {
            Mock.mock(item.api, 'POST', () => {
                console.log('拦截到请求');
                return item.headData.body;
            });
        } else {
            deleteMockUrl(item.api);
            console.log(Mock);
        }
    });
};

export const deleteMockUrl = (url: string) => {
    // 关闭后需要删除mock的拦截的url
    try {
        Object.keys(Mock._mocked).forEach((item) => {
            if (Mock._mocked[item].rurl === url) {
                delete Mock._mocked[item];
                console.log('删除成功', url, Mock._mocked[url]);
            }
        });
    } catch (error) {}
};
