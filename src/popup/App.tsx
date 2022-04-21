import ReactDOM from 'react-dom';
import { Popup } from './index';
chrome.storage.local.get('mockData', (res) => {
    console.log(res, 'popup读取的本地数据');
    // mockData = res.mockData; //这个mockData 给 popup界面使用
    ReactDOM.render(<Popup mockData={res.mockData} />, document.getElementById('root'));
});
