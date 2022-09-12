import ReactDOM from 'react-dom';
import { readStorageAll } from '../utils/common';

import App from './App';
import './App.scss';

chrome.devtools.panels.create('Mt', 'icons/extension-icon-x32.png', 'devtools.html', () => {
    console.log('自定义面板创建成功！'); // 注意这个log一般看不到
    const map = readStorageAll();
    map.then((globalDataProps) => {
        console.log('devtools获取的store', globalDataProps);
        ReactDOM.render(<App globalDataProps={globalDataProps} />, document.querySelector('#root'));
    });
});
