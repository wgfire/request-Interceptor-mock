//@ts-nocheck
/** 2022年/四月/16日/星期六
*@reviewType.Perf
*@reviewContent wg
1 先通过url判断是否走代理fetch
2.如果走代理fetch，则拦截请求，更改请求数据和响应数据，否则返回原生的fetch
3.走代理的情况先拿到请求头和请求数据进行替换，再替换response
4.response的处理，先拿到原始的response，再构造一个新的response，替换原始的response,返回的body是一个文件流对象
*/

import { createReadStream, createProxy, mockDataItem, createMockItemForFetch, IsIncludeUrlBuyMock } from './utils';
const originFetch = fetch.bind(window);
let mockData: mockDataItem = [{ url: '/api/user/login' }];
let change = null; // 是否被替换过

const myFetch = function (...args) {
    const copyArgs = args.slice(0); // 拷贝一份，用户得到原始的的发送body,url是不带域名的
    let [url] = copyArgs;
    //url = window.location.origin + url;
    console.log(copyArgs, url, '原生发送的数据', mockData);
    const item = IsIncludeUrlBuyMock(url, mockData);

    if (item && item.switch) {
        //const sendHeaders = Object.assign(args[1].headers, item.request.headers);
        // 更新原生请求数据
        item.request.originData = copyArgs[1]?.body;
        const sendbody = item.showOriginData ? copyArgs[1]?.body : item.request.data;
        const sendHeader = JSON.parse(item.showOriginHeader ? item.request.originHeaders : item.request.headers);
        args[1] = {
            ...sendHeader,
            // headers: sendHeaders,
            body: sendbody, // 发送原生数据还是模拟数据
        };
        console.log(args, '拦截请求数据');
        return originFetch(...args).then(async (response) => {
            const cloneResponse = response.clone();
            // 这里要拿到response的原生返回的请求和响应数据,进行更新
            const originData = await cloneResponse.json().finally((data) => {
                const sendItem = {
                    ...item,
                    originResponse: JSON.stringify(data || {}),
                };
                window.postMessage({
                    to: 'iframe',
                    action: 'update',
                    data: sendItem,
                });
                return JSON.stringify(data);
            });

            const responseData = item.showOriginResponse ? originData : item.response;

            // 判断是否要显示原始的请求数据更改请求数据和响应数据
            const stream = createReadStream(responseData);
            // 创建一个headers 对象
            //  const myHeaders = createHeaders(sendHeaders);
            const newResponse = new Response(stream, {
                headers: response.headers,
                status: 200, // 此处必须设置为200，ok会变成true,不能直接设置ok的值 ,但是404的话 只要body不为空就可以 fetch只要不是网络错误就是调用then,后面就是promise的then
                statusText: response.statusText,
            });
            newResponse
                .clone()
                .json()
                .then((data) => {
                    console.log('模拟响应数据', data);
                });
            // 对一些属性进行代理 部分属性newResponse，部分response
            const proxy = createProxy(newResponse, response);

            return proxy;
        });
    } else {
        return originFetch(...args).then((response) => {
            // 为了跟xhr保持使用统一将body从请求配置里分离开来

            const sendData = copyArgs[1]?.body;
            delete copyArgs[1]?.body;
            const originsendHeader = JSON.stringify({ ...copyArgs[1] }); // 包含请求头信息和请求body
            const cloneResponse = response.clone();
            cloneResponse.json().finally((data) => {
                const sendItem = createMockItemForFetch({
                    url: cloneResponse.url,
                    data: sendData,
                    originData: sendData,
                    response: JSON.stringify(data || {}),
                    originResponse: JSON.stringify(data || {}),
                    headers: originsendHeader,
                    originHeaders: originsendHeader,
                });
                window.postMessage({
                    to: 'iframe',
                    action: 'update',
                    data: sendItem,
                });
            });

            return response;
        });
    }
};
export function proxyFetch(data) {
    mockData = data['mockData'];
    if (!change) {
        console.log('fetch替换', mockData);
        window.fetch = myFetch;
    }
    change = true;
}

export function cancelProxyFetch() {
    window.fetch = originFetch;
    change = false;
    console.log('取消了代理fetch');
}
