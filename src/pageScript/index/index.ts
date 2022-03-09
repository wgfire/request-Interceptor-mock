import './proxyXhr'
const Mock = window.Mock;
window.addEventListener('message', (e) => {
    if (e.data.action === 'start') actionMap.start(e.data.mockData);
});

const startXhr = (mockData: any) => {
    refreshMockAction(mockData);
};
const actionMap = {
    start: startXhr,
};

export const refreshMockAction = (mockData: Array<any>) => {
    // 重新用mockjs 执行一遍对应数据的拦截逻辑
    mockData.forEach((item) => {
        if (item.switch) {
            Mock.mock(item.api, 'POST', () => {
                console.log('拦截到请求');
                return Mock.mock(item.headData.body)
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
