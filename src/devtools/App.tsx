import { useEffect, useRef, useState } from 'react';
import { Layout, Nav, Button, Skeleton, Avatar, Input, Typography } from '@douyinfe/semi-ui';
import { IconSetting, IconGithubLogo, IconSearch } from '@douyinfe/semi-icons';
import './App.scss';
import { mockDataItem, ReceiveMessage } from '../utils/type';

type DevtoolsRequest = chrome.devtools.network.Request;
const CollectType = ['xhr', 'fetch'];
const App = (): JSX.Element => {
    const { Title, Text } = Typography;
    const { Header, Footer, Content } = Layout;
    const loading = useRef<boolean | undefined>(false);
    const [collectRequestData, setCollectRequestData] = useState<Array<DevtoolsRequest>>([]);
    const [mockData, setMockData] = useState<Array<mockDataItem>>([]);
    useEffect(() => {
        // devtools提供的网络收集接口
        requestFinishedListener('add', collectRequestInformation);
        onMessageListener(ReceiveRequestInformation);
        return () => {
            requestFinishedListener('remove', collectRequestInformation);
        };
    }, []);

    const collectRequestInformation = (request: DevtoolsRequest) => {
        if (CollectType.includes(request._resourceType as string)) {
            console.log(request, '网络收集');
            setCollectRequestData((data) => {
                data.push(request);
                return data;
            });
        }
    };
    const ReceiveRequestInformation = (data: mockDataItem) => {
        console.log(data, 'xhr返回');
        setMockData((value) => {
            value.push(data);
            return value;
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
                <div style={{ display: 'flex', width: '50%' }} className="search-box">
                    <IconSearch size="large" style={{ marginRight: '12px' }} />
                    <Input
                        addonBefore="过滤URL"
                        onChange={() => {
                            // ruleChangeHandel(value);
                        }}
                        className="rule-input"
                    />
                </div>
                <div
                    style={{
                        borderRadius: '10px',
                        border: '1px solid var(--semi-color-border)',
                        height: '376px',
                        padding: '32px',
                    }}
                >
                    <Skeleton placeholder={<Skeleton.Paragraph rows={2} />} loading={loading.current}></Skeleton>
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

export default App;
