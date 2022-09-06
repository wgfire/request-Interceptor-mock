/* eslint-disable no-shadow */
import { DevToolRequestItem, globalDataProps, mockDataItem } from '../utils/type';
import { isNotifications, resetMax } from './notifications';

console.log('This is background page!');
// 数据通过webRequest 存起来
let mockData: mockDataItem[];
chrome.storage.local.get('mockData', (res) => {
    console.log(res, '读取的本地数据');
    const { mockData } = res;
    start(Array.isArray(mockData) ? mockData : []);
});
const proxyNotifications = (item: mockDataItem) => {
    const domain = item.url.match(/^(https?):\/\/(.*?)\//);
    const url = item.url.match(/(?<=^(https?):\/\/(.*?)\/)\S+/g);
    isNotifications({
        title: `拦截提醒:${domain ? domain[0] : ''}`,
        url: item.url,
        message: `${url ? url[0] : ''}-已被拦截代理`,
    });
};
const errorNotifications = (item: { url: string }) => {
    resetMax(2);
    isNotifications({
        title: `提醒:`,
        url: item.url,
        message: `当前地址请求失败:${item.url ? item.url : ''}`,
    });
};

const actionMap: { [key: string]: (fn: (arg: any) => void, arg: any) => void } = {
    getMock: (fn: (arg: any) => void) => {
        console.log('收到来自content-script的消息：发送mock数据', mockData);
        fn(mockData);
    },
    setMock: (fn: (arg: globalDataProps) => void, arg: globalDataProps) => {
        const mockData = arg.mockData.filter((el: mockDataItem) => el.switch === true);
        const obj = JSON.parse(JSON.stringify(arg));
        obj.mockData = mockData;
        chrome.storage.local.set({ globalData: obj }, () => {
            console.log('更新background globalData 成功', obj);
        });
        // 发送给content 消息，将popup里更新的好的数据通过content在传到pagescript里。
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0] ? tabs[0].id! : 0, { action: 'setMock', to: 'content', data: arg });
        });
        fn(arg);
    },
    clearMock: (fn: (arg: any) => void, arg: any) => {
        chrome.storage.local.clear().then((res) => {
            console.log('清除后台数据', res);
            fn(arg);
        });
    },
    toggle: (fn: (arg: any) => void, arg: any) => {
        // 在转发给content-script进行切换展开,content作用域用tabs发
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, { action: 'toggle', to: 'content', data: '' });
        });
    },
    update: (fn: (arg: mockDataItem) => void, arg: any) => {
        // 将实时拦截的请求发送给popup
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log('background更新mock数据到popup', arg, tabs);
            if (arg.switch) {
                proxyNotifications(arg);
            }
            chrome.runtime.sendMessage({ action: 'update', to: 'devtools', data: arg });
        });
    },
    updateRequestInfo: (fn: (arg: any) => void, arg: DevToolRequestItem) => {
        // 将devtool实时拦截的请求信息补充给popup界面展示
        console.log('background收到devtool', arg);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log('background更新mock数据到popup', arg, tabs);
            chrome.tabs.sendMessage(tabs[0] ? tabs[0].id! : 2, { action: 'updateRequestInfo', to: 'popup', data: arg });
        });
    },

    error: (fn: (arg: mockDataItem) => void, arg: { url: string }) => {
        // 请求失败进行提醒
        errorNotifications(arg);
    },

    onload: () => {
        // 页面加载完成后，重置提醒次数,代理是弹出一次
        resetMax(3);
        // 页面加载完 由于devtools还是存在的所以需要清空里面的mock数据
        chrome.runtime.sendMessage({ action: 'load', to: 'devtools', data: [] });
    },
    reload: () => {
        // 重新加载界面
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, { action: 'reload', to: 'content', data: undefined });
        });
    },
};
const start = (data: any) => {
    console.log(data);
    mockData = data.length > 0 ? data : [];
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
        if (request.to === 'background') {
            console.log('后台收到消息：', request);
            try {
                actionMap[request.action](sendResponse, request.data);
            } catch {
                console.log(request, '未找到执行函数');
            }
        }
    });
};
