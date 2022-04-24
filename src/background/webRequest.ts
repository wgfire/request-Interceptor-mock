/** 2022年/二月/09日/星期三
*@reviewType.Perf
*@reviewContent By Name
1.对webrequest进行拦截，得到请求列表
2.支持api查询筛选
*/

// chrome.webRequest.onBeforeRequest.addListener(
//     (detail) => {
//         console.log(detail, '发送前结果');
//     },
//     { urls: ['*://*/*'], types: ['xmlhttprequest'] },
//     ['extraHeaders', 'blocking'],
// );

// chrome.webRequest.onResponseStarted.addListener(
//     (detail) => {
//         console.log(detail, '响应结果');
//         return { responseHeaders: detail.responseHeaders };
//     },
//     { urls: ['*://*/*'], types: ['xmlhttprequest'] },
//     ['responseHeaders', 'extraHeaders'],
// );

// chrome.webRequest.onErrorOccurred.addListener(
//     (detail) => {
//         console.log(detail, '出错了');
//         return { requestHeaders: detail.responseHeaders };
//     },
//     { urls: ['*://*/*'], types: ['xmlhttprequest'] },
// );
