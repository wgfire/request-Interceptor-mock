//@ts-nocheck
const originFetch = fetch.bind(window);
const myFetch = function (...args: any) {
    const mockData = [
        {
            url: 'https://cg-test.myyscm.com/bms/index.php?r=CzSupplier/api/run&o=qdls&p=cgsupplier.common.site-config',
            switch: true,
            response: '{"result":true,"msg":"","data":{"cgbid":["register_setting","supplier_claimff"]}}',
        },
    ];
    return originFetch(...args).then((response: Response) => {
        const index = mockData.findIndex((item) => item.url === args[0]);
        console.log(args[0], '拦截的url', index);
        if (index > -1) {
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode(mockData[index].response));
                    controller.close();
                },
            });
            const newResponse = new Response(stream, {
                headers: response.headers,
                status: response.status,
                statusText: response.statusText,
            });
            const proxy = new Proxy(newResponse, {
                get: function (target, name) {
                    switch (name) {
                        case 'ok':
                        case 'redirected':
                        case 'type':
                        case 'url':
                        case 'body':
                        case 'bodyUsed':
                            return response[name];
                    }
                    return target[name];
                },
            });

            for (let key in proxy) {
                if (typeof proxy[key] === 'function') {
                    proxy[key] = proxy[key].bind(newResponse);
                }
            }
            console.log('拦截成功', proxy.url);
            return proxy;
        }
        return response;
    });
};
window.fetch = myFetch;
