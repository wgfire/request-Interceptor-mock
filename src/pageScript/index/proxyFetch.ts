//@ts-nocheck
import { createReadStream, createHeaders, createProxy, mockDataItem, createMockItemForProxy, switchFindUrl } from './utils';
const originFetch = fetch.bind(window);
let mockData: mockDataItem = [
    {
        url: 'https://cg-test.myyscm.com/bms/index.php?r=CzSupplier/api/run&o=qdls&p=cgsupplier.common.site-config',
        switch: true,
        request: {
            data: {},
            headers: {
                'Content-Type': 'application/json',
            },
            originData: {},
        },
        response: '{"result":true,"msg":"","data":{"cgbid":["register_setting","supplier_claimff"]}}',
        originResponse: {},
        showOriginData: false,
        showOriginResponse: false,
    },
];

const myFetch = function (...args) {
    switchFindUrl(
        args[0],
        (item) => {
            // args[1] = item.request;
            return originFetch(...args).then((response) => {
                console.log(args[0], args[1], '拦截的url', index);
                if (index > -1) {
                    // 判断是否要显示原始的请求数据更改请求数据和响应数据
                    const stream = createReadStream(item.response);
                    // 创建一个headers 对象
                    const myHeaders = createHeaders(item.request.headers);
                    const newResponse = new Response(stream, {
                        headers: myHeaders,
                        status: 200, // 此处必须设置为200，ok会变成true,不能直接设置ok的值 ,但是404的话 只要body不为空就可以 fetch只要不是网络错误就是调用then,后面就是promise的then
                        statusText: response.statusText,
                    });
                    console.log(newResponse, '构造的response');
                    const proxy = createProxy(newResponse, response);
                    response = proxy;
                }
                const cloneResponse = response.clone();
                const sendItem = createMockItemForProxy(cloneResponse.url, response);

                return response;
            });
        },
        mockData,
    );

    return originFetch(...args).then((response) => {
        return response;
    });
};
export function proxyFetch(mockData) {
    mockData = mockData;
}
window.fetch = myFetch;
