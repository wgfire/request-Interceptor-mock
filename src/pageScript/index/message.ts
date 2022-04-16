import { initXhr } from './proxyXhr';
import { proxyFetch } from './proxyFetch';
// 处理接受消息的行为
// import {mockDataItem} from './utils'

window.addEventListener('message', (e) => {
    if (e.data.action === 'start') {
        actionMap.start(e.data.mockData);
        console.log(e, 'pagescript接受到消息');
    }
});

export const refreshMockAction = (data: any) => {
    // 重新设置mock数据
    initXhr(data);
    proxyFetch(data);
};
const actionMap = {
    start: refreshMockAction,
};
