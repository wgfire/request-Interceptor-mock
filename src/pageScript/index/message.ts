import type { globalDataProps } from '../../utils/type';
import { proxyFetch, cancelProxyFetch } from './proxyFetch';
import { initXhr, cancelProxyXhr } from './proxyXhr';

// 处理接受消息的行为
// import {mockDataItem} from './utils'

window.addEventListener('message', (e) => {
    if (e.data.to === 'pageScript') {
        console.log(e, 'pageScript接受到消息');
        const name = e.data.action as string;
        actionMap[name](e.data.globalData);
    }
});

export const refreshMockAction = (globalData: globalDataProps) => {
    // 重新设置mock数据
    initXhr(globalData);
    proxyFetch(globalData);
};
/**
 * 取消代理
 */
const cancelMock = () => {
    cancelProxyXhr();
    cancelProxyFetch();
};
const actionMap: { [key: string]: any } = {
    start: refreshMockAction,
    cancel: cancelMock,
};
