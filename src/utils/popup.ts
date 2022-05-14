/* eslint-disable default-case */
/**
 * popup用到一些工具方法
 */

import { mockDataItem } from './type';

// 根据需要的key返回当前原生的数据
export const getOriginData = (key: string, el: mockDataItem) => {
    let item;
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
export const copyAction = (type: string[], el: mockDataItem) => {
    let copyData = '';
    type.forEach((element) => {
        switch (element) {
            case 'url':
                copyData += el.url;
                break;
            case 'header':
                copyData += '请求头：';
                copyData += getOriginData('header', el) ?? '';
                break;
            case 'data':
                copyData += '请求数据：';
                copyData += getOriginData('data', el) ?? '';
                break;
            case 'response':
                copyData += '响应数据：';
                copyData += getOriginData('response', el) ?? '';
                break;
        }
    });

    return copyData;
};

export const setObjectValue = (key: string[], el: mockDataItem, value: any): any =>
    // eslint-disable-next-line unicorn/no-array-reduce
    Object.keys(el).reduce((prev, cur) => {
        if (cur === key[0]) {
            const item = { ...el };
            if (key.length === 1) {
                item[cur] = value;
            } else {
                item[cur] = setObjectValue(key.slice(1), item[cur], value);
            }
            return item;
        }
        return prev;
    }, el);
