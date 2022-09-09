import { useEffect, useRef, useState } from 'react';
import { Layout, Nav, Button, Skeleton, Avatar, Input, Typography, Spin } from '@douyinfe/semi-ui';
import { IconSetting, IconGithubLogo, IconSearch } from '@douyinfe/semi-icons';
import { DevtoolsRequest, DevtoolsRequests, globalDataProps, mockDataItem, ReceiveMessage } from '../utils/type';

import './App.scss';
import { DataTable } from './components/dataTable';
import { createId } from '../utils/pagescript';
import { useUpdateEffect } from '../hooks/useUpdateEffect';
import { DataTabs } from './components/dataTabs';
import { throttle } from '../utils/common';

const CollectType = new Set(['xhr', 'fetch']);
const App: React.FC<{ globalDataProps: globalDataProps }> = (props) => {
    const { Title, Text } = Typography;
    const { Header, Footer, Content } = Layout;
    const [loading, setLoading] = useState(false);
    const [collectRequestData, setCollectRequestData] = useState<Array<DevtoolsRequests>>([]);
    const [mockData, setMockData] = useState<Array<mockDataItem>>([]);
    const [inputContent, setInputContent] = useState('');
    useEffect(() => {
        requestFinishedListener('add', collectRequestInformation);
        onMessageListener('add', ReceiveRequestInformation);
        return () => {
            requestFinishedListener('remove', collectRequestInformation);
            onMessageListener('remove', ReceiveRequestInformation);
        };
    }, []);
    /**
     * @description 接受devtools API递过来的数据
     * @param data
     */
    const collectRequestInformation = throttle(
        100,
        (request: DevtoolsRequest) => {
            if (CollectType.has(request._resourceType as string)) {
                setLoading(true);
                setCollectRequestData((data) => {
                    const newData = [...data];
                    const { method, url, postData } = request.request;
                    const newRequest: DevtoolsRequests = {
                        ...request,
                        id: createId({ url, data: method === 'GET' ? '' : postData ? (postData.text as string) : '' }),
                    };
                    newData.push(newRequest);
                    return newData;
                });
            }
        },
        () => {
            console.log('收集结束');
            setLoading(false);
        },
    );
    /**
     * @description 接受xhr拦截器传递过来的数据
     * @param data
     */
    const ReceiveRequestInformation = (request: ReceiveMessage) => {
        console.log('devtools接受消息', request);
        if (request.to === 'devtools') {
            const { action, data } = request;
            if (action === 'update') {
                setMockData((value) => {
                    const newData = [...value];
                    const notExistData = newData.every((el) => el.id !== data.id);
                    notExistData && newData.push(data);
                    return newData;
                });
            } else if (action === 'onload') {
                console.log('devtools清空数据');
                setMockData(data);
                setCollectRequestData(data);
            }
        }
    };
    /**
     * @description 根据输入框内容筛选数据
     */
    const filterTableData = () => {
        return collectRequestData.filter((el) => {
            return el._url === inputContent || el.response.content;
        });
    };

    useUpdateEffect(() => {
        console.log(collectRequestData, '网络收集');
    }, [collectRequestData]);
    useUpdateEffect(() => {
        console.log(mockData, '拦截数据');
    }, [mockData]);

    return (
        <Layout style={{ border: '1px solid var(--semi-color-border)' }}>
            <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                <div>
                    <Nav mode="horizontal" defaultSelectedKeys={['Home']}>
                        <Nav.Header>
                            <Title>Mt Extension</Title>
                        </Nav.Header>

                        <Nav.Footer>
                            <Button
                                theme="borderless"
                                icon={<IconSetting size="large" />}
                                style={{
                                    color: 'var(--semi-color-text-2)',
                                    marginRight: '12px',
                                }}
                            />
                            <Avatar color="orange" size="small">
                                WG
                            </Avatar>
                        </Nav.Footer>
                    </Nav>
                </div>
            </Header>

            <Content
                style={{
                    padding: '24px',
                    backgroundColor: 'var(--semi-color-bg-0)',
                }}
            >
                <div
                    style={{
                        borderRadius: '10px',
                        border: '1px solid var(--semi-color-border)',
                        height: '100%',
                        padding: '32px',
                        boxShadow: '0px 0px 1px 1px var(--semi-color-border)',
                    }}
                >
                    <Spin spinning={loading} tip="别动! 我自己会消失..." size="large">
                        <div className="tools-content">
                            <div className="table-content">
                                <div className="search-box">
                                    <IconSearch size="large" style={{ marginRight: '12px' }} />
                                    <Input
                                        value={inputContent}
                                        addonBefore="过滤URL"
                                        onChange={(value: string) => {
                                            // ruleChangeHandel(value);
                                            setInputContent(value);
                                        }}
                                        className="rule-input"
                                    />
                                </div>
                                <DataTable data={collectRequestData} />
                            </div>
                            <div className="panel-content">
                                <DataTabs></DataTabs>
                            </div>
                        </div>
                    </Spin>
                </div>
            </Content>

            <Footer
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '20px',
                    color: 'var(--semi-color-text-2)',
                    backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                }}
            >
                <Text
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ marginRight: '8px' }}>Mt Extension</Text>
                    <span>Copyright © 2022 WG. All Rights Reserved. </span>
                </Text>
                <Text link icon={<IconGithubLogo />} underline>
                    反馈建议
                </Text>
            </Footer>
        </Layout>
    );
};
/**
 * background拦截器返回的数据
 */
const onMessageListener = (type: 'add' | 'remove', handel: (data: ReceiveMessage) => void) => {
    if (type == 'add') {
        chrome.runtime.onMessage.addListener(handel);
    } else {
        chrome.runtime.onMessage.removeListener(handel);
    }
};
/**
 * devtools拦截器返回的数据
 */
const requestFinishedListener = (type: 'add' | 'remove', handel: (data: DevtoolsRequest) => void) => {
    if (type === 'add') {
        chrome.devtools.network.onRequestFinished.addListener(handel);
    } else {
        chrome.devtools.network.onRequestFinished.removeListener(handel);
    }
};

export default App;
