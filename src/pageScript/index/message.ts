import type { globalDataPorps } from '../../utils/type';
import { proxyFetch } from './proxyFetch';
import { initXhr } from './proxyXhr';

// 处理接受消息的行为
// import {mockDataItem} from './utils'

window.addEventListener('message', (e) => {
    if (e.data.action === 'start') {
        actionMap.start(e.data.globalData);
        console.log(e, 'pagescript接受到消息');
    }
});

export const refreshMockAction = (globalData: globalDataPorps) => {
    // 重新设置mock数据
    initXhr(globalData);
    proxyFetch(globalData['mockData']);
};
const actionMap = {
    start: refreshMockAction,
};
