import {initXhr,setMockData} from './proxyXhr'
// 处理接受消息的行为
 // import {mockDataItem} from './utils'

window.addEventListener('message', (e) => {
    console.log(e,'pagescript接受到消息')
    if (e.data.action === 'start') actionMap.start(e.data.mockData);
});



export const refreshMockAction = (mockData: Array<any>) => {
    // 重新用mockjs 执行一遍对应数据的拦截逻辑
    setMockData(mockData)
    initXhr()
  
};
const actionMap = {
    start: refreshMockAction,
};

export const deleteMockUrl = (url: string) => {
    // 关闭后需要删除mock的拦截的url
   console.log(url)
};
