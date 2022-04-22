import { useEffect } from 'react';
import './App.scss';

const App = () => {
    useEffect(() => {
        console.log('App', chrome.devtools);
        chrome.devtools.network.onRequestFinished.addListener(function (request) {
            console.log(request, 'xx');
        });
    }, []);
    return (
        <div className="app">
            <h1 className="title">options page</h1>
        </div>
    );
};

export default App;
