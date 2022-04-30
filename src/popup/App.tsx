import ReactDOM from 'react-dom';

import { readStorageAll } from '../utils/common';
import { Popup } from './index';

const map = readStorageAll();
map.then((res) => {
    console.log(res, 'popup读取的本地数据');
    ReactDOM.render(<Popup mockDataPopup={res.mockData} configPopup={res.config} />, document.querySelector('#root'));
});
// chrome.storage.local.get('mockData', (res) => {
//     console.log(res, 'popup读取的本地数据');
//     // mockData = res.mockData; //这个mockData 给 popup界面使用
//     localStorage.setItem('ff', 'ff');
//     ReactDOM.render(<Popup mockDataPopup={res.mockData} />, document.querySelector('#root'));
// });
