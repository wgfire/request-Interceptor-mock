/** 2022年/二月/16日/星期三
*@reviewType.Perf
*@reviewContent By Name
1.利用chrome提供的通信api进行封装
*/

abstract class PostMessageAbstract {
    abstract sendBackground(message: any): void;
    abstract sendContent(message: any): void;
}

class PostMsg implements PostMessageAbstract {
    sendBackground(message: any, fn: void): void {
        chrome.runtime.sendMessage(message, fn);
    }
    sendContent(message: any): void {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, message);
        });
    }
}
