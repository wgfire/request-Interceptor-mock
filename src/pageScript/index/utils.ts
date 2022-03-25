export interface configProps {
    url: string;
    data: any;
    header: any;
}
export interface mockDataItem {
    statu:number,
    switch:boolean,
    cancel:boolean,
    url:string,
    request:{
        headers:any;
        timeout:number;
        data:any
    }
    response:any;
    [key:string]:any
   }
/**当前config 下 是否存在与mockUrl里 */
export const findUrlBuyMock = (config: configProps,mockUrl:mockDataItem[]) => {
    const  mockData = mockUrl || []
    const index = mockData.findIndex((el:any) => {
        return el.url === config.url;
    });
    return index > -1 ? mockUrl[index] : false;
};

export const switchFindUrl = (config: configProps,fn:(data:mockDataItem)=>any,mockUrl:mockDataItem[])=>{
    const data = findUrlBuyMock(config,mockUrl);
    if(data && data.switch) {
        fn(data)
    }
}
