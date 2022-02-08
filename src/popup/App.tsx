import './App.scss';
import React from 'react';
const App: React.FC = () => {
    const bg = chrome.extension.getBackgroundPage();
    const switchClickHandel = (open: boolean) => {
        // 发送通知 告诉pageScript
        console.log('x');
        bg!.mockData[0].switch = open;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, {
                action: 'start', // 操作的行为
                id: 0, // 具体开启的那一条
                projectId: 0, // 在哪一个项目
                to: 'content', // 发送的地址
                headData: {}, // 修改的响应头数据，
                mockData: bg!.mockData,
            });
        });
    };
    React.useEffect(() => {
        console.log(bg?.mockData, bg, '拿到mock数据');
    }, []);
    return (
        <div className="app">
            <h1 className="title">popup page</h1>
            <button
                onClick={() => {
                    switchClickHandel(true);
                }}
            >
                开启拦截
            </button>
            <button
                onClick={() => {
                    switchClickHandel(false);
                }}
            >
                关闭拦截
            </button>
        </div>
    );
};

export default App;
