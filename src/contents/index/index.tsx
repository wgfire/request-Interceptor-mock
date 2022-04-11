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
console.log(`Current page show`);

let mockData: any = null;
let popup: HTMLDivElement = document.createElement('div');
const actionMap:any = {
    start: postMockDataToScript,
    getMock: (request:any, sendResponse:(mockData:any)=>void) => {
        sendResponse(mockData);
    },
};

export function postMockDataToScript(mockData: any) {
    console.log(mockData, '发送的mock数据');
    window.postMessage({
        action: 'start',
        to: 'pageScript',
        mockData: mockData,
    });
}
/**发送消息给后台获取mockdata 通信由于是异步的很费时间，所以在content直接取*/
// function getMockData(fn: (arg: any) => void): void {
//     chrome.runtime.sendMessage({ action: 'getMock', to: 'background' }, function (response) {
//         if (response) {
//             fn(response);
//         }
//     });
// }
function createPopup(mockData: any) {
    // 有些网站可能加载的数据比较多，所以还是要在一个回调函数里等document有了在插入
    document.addEventListener('DOMContentLoaded', () => {
        console.log('开始插入popup', mockData);
        popup.setAttribute('id', 'popup');
        document.body.appendChild(popup);
        ReactDOM.render(<Iframe mockData={mockData} />, popup);
    });
}

chrome.storage.local.get('mockData', (res) => {
    console.log(res, '读取的本地数据');
    mockData = res.mockData; //这个mockData 给 popup界面使用
    createPopup(mockData);
    injectCustomJs('js/pageScript.js').then(() => {
        postMockDataToScript(mockData); //  需要在js挂载成功之后 再去发送消息
    });
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.to === 'content') {
        console.log(request, sender, 'content收到消息');
        // 转发给pagescript内容
        const name = request.action as string;
        actionMap[name] && actionMap[name](request, sendResponse);
    }
});
