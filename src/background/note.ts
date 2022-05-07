chrome.contextMenus.create({
    id: 'note',
    title: '添加小记',
    contexts: ['selection'],
    type: 'normal',
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log(info, tab);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, {
            action: 'addNote',
            to: 'content',
            data: {
                selectionText: info.selectionText,
                url: info.pageUrl,
            },
        });
    });
});
