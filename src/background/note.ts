chrome.contextMenus.create({
    id: 'note',
    title: '添加小记',
    contexts: ['selection'],
    type: 'normal',
    onclick: (info, tab) => {
        console.log(info, tab);
    },
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log(info, tab);
});
