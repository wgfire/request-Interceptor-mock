/** 2022年/二月/10日/星期四
*@reviewType.Perf
*@reviewContent By Name
1.接受popup里的事件 刷新mock的数据列表
2.当页面加载完成之后，自动执行开启了mock的url-像background发送消息获取mock列表
*/
import './style.scss';
import { injectCustomJs } from '../../utils/common';
import ReactDOM from 'react-dom';
import { Iframe } from './iframe';
import { useEffect, useState } from 'react';
console.log(`Current page show`);

let mockData: any = null;
const actionMap: {
    [key: string]: (data?: any) => void;
} = {
    start: (mockData: any) => {
        // 执行或者刷新mock拦截数据
        window.postMessage({
            action: 'start',
            to: 'pageScript',
            mockData: mockData,
        });
    },
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.to === 'content') {
        console.log(request, sender, 'content收到消息');
        // 转发给pagescript内容
        const name = request.action as string;
        actionMap[name](request.mockData);
        if (sendResponse) sendResponse();
    }
});

const aj = document.createElement('div');
aj.setAttribute('id', 'aj');
document.body.appendChild(aj);
let show = false;

chrome.runtime.onMessage.addListener((response) => {
    if (response.action == 'toggle') {
        show = !show;
        aj.style.setProperty(
            'transform',
            show ? 'translateX(0)' : 'translateX(470px)',
            'important',
        );
    }

    return true;
});

const App: React.FC = () => {
    const [iMockData, setImockData] = useState(mockData);
    const getMockData = () => {
        // 向后端发送消息获取mock列表
        chrome.runtime.sendMessage({ action: 'getMock', to: 'background' }, function (response) {
            console.log(response, '获取到的mock数据');
            if (response) {
                // setMockData(response);
                mockData = response;
                // window.postMessage({
                //     action: 'start',
                //     to: 'pageScript',
                //     mockData: mockData,
                // });
            }
        });
    };
    useEffect(() => {
          getMockData();
    }, []);
    useEffect(() => {
        setImockData(mockData);
    }, [mockData]);
    return <Iframe mockData={iMockData} />;
};


    injectCustomJs('js/pageScript.js').then(() => {
        console.log('注入完成');
        ReactDOM.render(<App />, document.querySelector('#aj'));
    });
