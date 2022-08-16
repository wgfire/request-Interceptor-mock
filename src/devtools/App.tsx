import { useEffect, useRef, useState } from 'react';
import { Layout, Nav, Button, Skeleton, Avatar, Input, Typography } from '@douyinfe/semi-ui';
import { IconSetting, IconGithubLogo, IconSearch } from '@douyinfe/semi-icons';
import { DevtoolsRequest, DevtoolsRequests, globalDataProps, mockDataItem, ReceiveMessage } from '../utils/type';

import './App.scss';
import { DataTable } from './components/dataTable';
import { createId } from '../utils/pagescript';
import { useUpdateEffect } from '../hooks/useUpdateEffect';

const CollectType = new Set(['xhr', 'fetch']);
const App: React.FC<{ globalDataProps: globalDataProps }> = (props) => {
    const { Title, Text } = Typography;
    const { Header, Footer, Content } = Layout;
    const loading = useRef<boolean | undefined>(false);
    const [collectRequestData, setCollectRequestData] = useState<Array<DevtoolsRequests>>([]);
    const [mockData, setMockData] = useState<Array<mockDataItem>>([]);
    useEffect(() => {
        requestFinishedListener('add', collectRequestInformation);
        onMessageListener(ReceiveRequestInformation);
        return () => {
            requestFinishedListener('remove', collectRequestInformation);
        };
    }, []);

    const collectRequestInformation = (request: DevtoolsRequest) => {
        if (CollectType.has(request._resourceType as string)) {
            setCollectRequestData((data) => {
                const newData = [...data];
                const { method, url, postData } = request.request;
                const newRequest: DevtoolsRequests = {
                    ...request,
                    id: createId({ url, data: method === 'GET' ? '' : (postData!.text as string) }),
                };
                newData.push(newRequest);
                return newData;
            });
        }
    };
    const ReceiveRequestInformation = (data: mockDataItem) => {
        setMockData((value) => {
            const newData = [...value];
            newData.push(data);
            return newData;
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
                    }}
                >
                    <Skeleton placeholder={<Skeleton.Paragraph rows={2} />} loading={loading.current}>
                        <div className="tools-content">
                            <div className="table-content">
                                <div className="search-box">
                                    <IconSearch size="large" style={{ marginRight: '12px' }} />
                                    <Input
                                        addonBefore="过滤URL"
                                        onChange={() => {
                                            // ruleChangeHandel(value);
                                        }}
                                        className="rule-input"
                                    />
                                </div>
                                <DataTable data={collectRequestData} />
                            </div>
                            <div className="panel-content">
                                <p>sss</p>
                            </div>
                        </div>
                    </Skeleton>
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
 * xhr拦截器返回的数据
 */
const onMessageListener = (handel: (data: mockDataItem) => void) => {
    chrome.runtime.onMessage.addListener((request: ReceiveMessage) => {
        console.log('devtools 接受到消息', request);
        if (request.to === 'devtools') {
            handel(request.data);
        }
    });
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
