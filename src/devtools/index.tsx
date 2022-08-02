import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import App from './App';
import './App.scss';

chrome.devtools.panels.create('MyPanel', 'icons/extension-icon-x32.png', 'devtools.html', () => {
    console.log('自定义面板创建成功！'); // 注意这个log一般看不到
});
ReactDOM.render(
    <HashRouter>
        <App />
    </HashRouter>,
    document.querySelector('#root'),
);
