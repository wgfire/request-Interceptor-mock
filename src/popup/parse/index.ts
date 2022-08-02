/** 2022年/七月/18日/星期一
*@reviewType.Perf
*@reviewContent By Name
1.定义转换数据相关的方法
*/

import { mockDataItem } from '../../utils/type';

/** 返回删选项对应的面板key */
const getDefaultKey = (panelData: UrlNumberDataInterface[], ruleInput: string): string => {
    let result = '';
    const reg = new RegExp(ruleInput, 'g');
    panelData.forEach((el) => {
        const isTrue = el.data.some((dataItem) => {
            const testArray = [dataItem.url, dataItem.response, dataItem.originResponse];
            return testArray.some((item) => reg.test(item));
        });
        isTrue ? (result = el.url) : '';
    });

    return result;
};
export interface UrlNumberDataInterface {
    url: string;
    switch: boolean;
    number: number;
    data: mockDataItem[];
    id: number;
    [key: string]: any;
}
/** 根据mockData 获取转换的mock面板数据 以及删选项对应的面板key */
export function getUrlNumberData(data: mockDataItem[], ruleInput: string): { activeKey: string; panelData: UrlNumberDataInterface[] } {
    let panelData: UrlNumberDataInterface[] = [];
    let activeKey = '';
    const temObj = {} as UrlNumberDataInterface;
    // const temArr: Array<TableDataInterFace> = [];
    // 将每个域名分类
    data.forEach((el) => {
        const domain = el.url.match(/^(https?):\/\/(.*?)\//);
        if (domain && domain[0]) {
            const url = domain[0].replace(/https?:\/\//, '').slice(0, 10);
            if (temObj[url]) {
                temObj[url].number += 1;
                temObj[url].data.push(el);
            } else {
                temObj[url] = {
                    number: 1,
                    data: [el],
                    switch: true,
                    url,
                };
            }
        }
    });

    panelData = Object.values(temObj).map((item: UrlNumberDataInterface, index) => {
        const assign = Object.assign(item);
        assign.switch = assign.data.some((_: mockDataItem) => _.switch === true);
        assign.id = index;
        return assign;
    });
    activeKey = panelData.length <= 0 ? '' : !ruleInput ? panelData[0].url : getDefaultKey(panelData, ruleInput);
    console.log(panelData, 'result', activeKey);
    return { activeKey, panelData };
}
