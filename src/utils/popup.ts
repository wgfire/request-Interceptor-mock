/**
 * popup用到一些工具方法
 */

import { mockDataItem } from '../pageScript/index/utils';

// 根据需要的key返回当前原生的数据
export const getOriginData = (key: string, el: mockDataItem) => {
    let item = null;
    switch (key) {
        case 'header':
            item = el.showOriginHeader ? el.request.originHeaders : el.request.headers;
            break;
        case 'data':
            item = el.showOriginData ? el.request.originData : el.request.data;
            break;
        case 'response':
            item = el.showOriginResponse ? el.originResponse : el.response;
            break;
    }

    return item;
};

// 根据点击的copy类型，复制对应的类型数据
export const copyAction = (type: string, el: mockDataItem) => {
    let copyData = '';
    switch (type) {
        case 'url':
            copyData = el.url;
            break;
        case 'header':
            copyData = getOriginData('header', el);
            break;
        case 'data':
            copyData = getOriginData('data', el);
            break;
        case 'response':
            copyData = getOriginData('response', el);
            break;
    }

    return copyData;
};