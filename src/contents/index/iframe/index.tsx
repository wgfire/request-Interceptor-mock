import { useEffect, useState } from 'react';
import { Card, Switch, Input, Collapse } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
const { Panel } = Collapse;
import './index.scss';
import { debounce } from '../../../utils/common';
import  ReactJson  from  'react-json-view'
import { postMockDataToScript } from '../index';
import { mockDataItem } from '../../../pageScript/index/utils';
console.log('我是准备拦截器交互的界面');

const Cardtitle: React.FC<{ url: string }> = (props) => {
    return (
        <div style={{ marginRight: '10px' }}>
            <Input value={props.url} prefix="URL:"></Input>
        </div>
    );
};

export const Iframe: React.FC<{ mockData: mockDataItem[] }> = (props) => {
    const [mockData, setMockData] = useState(props.mockData);
    const [ready, setReady] = useState(false);
    const setMockDataProps = (value: any, index: number, key: string) => {
        const mock = [...mockData];
        mock[index][key] = value;
        setMockData(mock);
        return;
    };
    const refreshMockData = debounce(
        () => {
            console.log(mockData, '拦截数据变化');
            // 将现有的数据重新发送个background，background也需要更新，然后在转发给pagescript
            chrome.runtime.sendMessage(
                { action: 'setMock', to: 'background', data: mockData },
                function (response) {
                    if (response) {
                        console.log('发送成功');
                        postMockDataToScript(response);
                    }
                },
            );
        },
        1000,
        false,
    );
    const updateMockData = (item: mockDataItem) => {
        setMockData((mockData) => {
            const mock = [...mockData];
            const index = mock.findIndex((el) => {
                return el.url === item.url;
            });
            if (index == -1) {
                console.log(item, '新增列表');
                // mock[index] = item;
                mock.push(item);
            } else {
            }

            console.log(mock, '更新数据');
            return mock;
        });
    };
    const getRefreshMockData = () => {
        window.addEventListener('message', (event: MessageEvent<any>) => {
            const { to, action, data } = event.data;
            if (to === 'iframe' && action === 'update') {
                updateMockData(data);
            }
        });
    };
    const checkJson = (json:any)=> {
      if(!json)return {}
      if(typeof json === 'string') return JSON.parse(json)
      return json
    }
    useEffect(() => {
        setReady(true);
        getRefreshMockData();
    }, []);
    useEffect(() => {
        // 为了解决第一次加载也触发 refreshMockData
        if (ready) refreshMockData();
    }, [mockData]);
    return (
        <div className="popup-box scrollbar">
            <h1 className="title">mt插件┗|｀O′|┛ 嗷~~</h1>
            {mockData &&
                mockData.map((el, index) => {
                    return (
                        <Card
                            key={index}
                            className="card-box"
                            title={<Cardtitle url={el.url}></Cardtitle>}
                            extra={
                                <Switch
                                    checked={el.switch}
                                    onChange={(value) => {
                                        setMockDataProps(value, index, 'switch');
                                    }}
                                ></Switch>
                            }
                            size="small"
                        >
                            <Collapse>
                                <Panel header="RequestHeader" key="1">
                                    <p>{'修改请求头地方'}</p>
                                    <TextArea
                                        onChange={(event) => {
                                            setMockData((mockData) => {
                                                const data = [...mockData];
                                                const el = data[index];
                                                el['request']['headers'] = event.target.value;
                                                return data;
                                            });
                                        }}
                                        defaultValue={JSON.stringify(el.request.headers)}
                                    ></TextArea>
                                </Panel>
                            </Collapse>
                            <Collapse>
                                <Panel header="RequestData" key="1">
                                    <p>{'修改请求数据的地方'}</p>
                                  
                                    {/* <TextArea
                                        onChange={(event) => {
                                            setMockData((mockData) => {
                                                const data = [...mockData];
                                                const el = data[index];
                                                el['request']['data'] = event.target.value.toString();

                                                return data;
                                            });
                                            // setMockDataProps(el,index)('request')('data',event.target.value)
                                        }}
                                        defaultValue={el.request.data}
                                    ></TextArea> */}
                                    <ReactJson src={checkJson(el.request.data)} onEdit={(value)=>{
                                        console.log(value)
                                    }} name={false} theme="monokai" validationMessage="JSON格式错误"></ReactJson>
                                </Panel>
                            </Collapse>
                            <Collapse>
                                <Panel header="ReponsetData" key="1">
                                    <p>{'修改返回数据的地方'}</p>
                                    <TextArea
                                        defaultValue={el.response}
                                        onChange={(event) => {
                                            setMockDataProps(event.target.value.toString(), index, 'response');
                                        }}
                                    ></TextArea>
                                </Panel>
                            </Collapse>
                        </Card>
                    );
                })}
        </div>
    );
};

Iframe.defaultProps = {
    mockData: [],
};
