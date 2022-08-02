import { useEffect, useRef } from 'react';
import { Layout, Nav, Button, Skeleton, Avatar, Input, Typography } from '@douyinfe/semi-ui';
import { IconSetting, IconGithubLogo, IconSearch } from '@douyinfe/semi-icons';
import './App.scss';

const App = (): JSX.Element => {
    const { Title, Text } = Typography;
    const { Header, Footer, Content } = Layout;
    const loading = useRef<boolean | undefined>(false);
    useEffect(() => {
        console.log('App', chrome.devtools);
        chrome.devtools.network.onRequestFinished.addListener((request) => {
            console.log(request, 'xx');
        });
    }, []);
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
                <div style={{ display: 'flex', width: '60%' }} className="search-box">
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
                    <Skeleton placeholder={<Skeleton.Paragraph rows={2} />} loading={loading.current}>
                        <p>Hi, Bytedance dance dance.</p>
                        <p>Hi, Bytedance dance dance.</p>
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

export default App;
