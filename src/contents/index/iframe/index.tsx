import { useEffect, useState } from 'react';
import { Card, Switch, Input, Collapse } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import type{ mockDataInterfaceItem } from '../../../background/index';
const { Panel } = Collapse;
import './index.scss'
console.log('我是准备拦截器交互的界面');

const Cardtitle: React.FC<{ url: string }> = (props) => {
    return (
        <div style={{ marginRight: '10px' }}>
            <Input value={props.url} prefix="URL:"></Input>
        </div>
    );
};

export const Iframe: React.FC<{ mockData: mockDataInterfaceItem[] }> = (props) => {
    let { mockData } = props;
    const [testMock, setTestMock] = useState(mockData[0]);
    // const switchClickHandel = (open: boolean) => {
    //     // 发送通知 告诉content,由content在转发给pagescript
    //     console.log('x');
    //     mockData[0].switch = open;
    //     // window.postMessage({
    //     //     action: 'start',
    //     //     to: 'pageScript',
    //     //     mockData: mockData,
    //     // });
    // };
    const switchHandel = (value: boolean) => {
        setTestMock({
            ...testMock,
            switch: value,
        });
    };
    useEffect(() => {
        console.log(mockData, '拦截数据变化');
    }, [mockData]);
    return (
        <div className='popup-box'>
            <h1 className="title">mt插件┗|｀O′|┛ 嗷~~</h1>
            {mockData.map((el) => {
                return (
                    <Card
                       className='card-box'
                        title={<Cardtitle url={el.url}></Cardtitle>}
                        extra={<Switch checked={el.switch} onChange={switchHandel}></Switch>}
                        size="small"
                    >
                        <Collapse>
                            <Panel header="RequestHeader" key="1">
                                <p>{'修改请求头地方'}</p>
                                <TextArea defaultValue={JSON.stringify(el.request.headers)}></TextArea>
                            </Panel>
                        </Collapse>
                        <Collapse>
                            <Panel header="RequestData" key="1">
                                <p>{'修改请求数据的地方'}</p>
                                <TextArea
                                    defaultValue={JSON.stringify(el.request.data)}
                                ></TextArea>
                            </Panel>
                        </Collapse>
                        <Collapse>
                            <Panel header="ReponsetData" key="1">
                                <p>{'修改返回数据的地方'}</p>
                                <TextArea defaultValue={JSON.stringify(el.response)}></TextArea>
                            </Panel>
                        </Collapse>
                    </Card>
                );
            })}
        </div>
    );
};
