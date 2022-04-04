import {initXhr} from './proxyXhr'
// 处理接受消息的行为
 // import {mockDataItem} from './utils'

window.addEventListener('message', (e) => {
    console.log(e,'pagescript接受到消息')
    if (e.data.action === 'start') actionMap.start();
});



export const refreshMockAction = () => {
    // 重新设置mock数据
    initXhr()
 
};
const actionMap = {
    start: refreshMockAction,
};

export const deleteMockUrl = (url: string) => {
    // 关闭后需要删除mock的拦截的url
   console.log(url)
};
