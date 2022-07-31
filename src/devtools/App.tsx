import { useCallback, useEffect, useRef } from 'react';

import { DevToolRequestItem } from '../utils/type';

import './App.scss';

const App = (): JSX.Element => {
    const requestData = useRef<DevToolRequestItem[]>([]);
    const timer = useRef<number | undefined>();
    const requestFinishHandel = (request: chrome.devtools.network.Request) => {
        const obj: DevToolRequestItem = {
            wait: request.timings.wait,
            url: request.request.url as string,
            priority: request._priority as string,
        };
        console.log(request, 'xx');
        if (timer.current) {
            requestData.current.push(obj);
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            // 将收集好的requestdata 给到background
            console.log(requestData.current, '更新的数据');
            chrome.runtime.sendMessage({
                to: 'background',
                data: requestData.current,
                action: 'updateRequestinfo',
            });
            requestData.current = [];
        }, 1000);
    };
    const onRequestFinished = useCallback((): void => {
        const requestType = new Set(['fetch', 'xhr']);
        chrome.devtools.network.onRequestFinished.addListener((request) => {
            if (requestType.has(request._resourceType as string)) {
                requestFinishHandel(request);
            }
        });
    }, []);
    useEffect(() => {
        console.log('App', chrome.devtools);
        onRequestFinished();
        return () => {
            chrome.devtools.network.onRequestFinished.removeListener(requestFinishHandel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="app">
            <h1 className="title">MT插件面板，开发建设中....</h1>
        </div>
    );
};

export default App;
