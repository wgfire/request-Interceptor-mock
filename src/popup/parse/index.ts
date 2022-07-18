/** 2022年/七月/18日/星期一
*@reviewType.Perf
*@reviewContent By Name
1.定义转换数据相关的方法
*/

import { mockDataItem } from '../../utils/type';

/**
 * 将mockdata的数据进行根据url进行分类，将同一个url里的放在一起
 */
export interface UrlNumberDataInterface {
    url: string;
    switch: boolean;
    number: number;
    data: mockDataItem[];
    id: number;
    [key: string]: any;
}
export function getUrlNumberData(data: mockDataItem[]): UrlNumberDataInterface[] {
    let result: UrlNumberDataInterface[] = [];
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
                    url: url,
                };
            }
        }
    });

    result = Object.values(temObj).map((el: UrlNumberDataInterface, index) => {
        el.switch = el.data.some((el) => el.switch === true);
        el.id = index;
        return el;
    });
    console.log(result, 'result');
    return result;
}
