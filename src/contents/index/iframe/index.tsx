import { useEffect } from 'react';

console.log('我是准备拦截器交互的界面');

export const Iframe: React.FC<{ mockData: any }> = (props) => {
    let { mockData } = props;
    const switchClickHandel = (open: boolean) => {
        // 发送通知 告诉content,由content在转发给pagescript
        console.log('x');
        mockData[0].switch = open;
        window.postMessage({
            action: 'start',
            to: 'pageScript',
            mockData: mockData,
        });
    };
    useEffect(() => {
        console.log(mockData, '拦截数据变化');
    }, [mockData]);
    return (
        <div>
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
