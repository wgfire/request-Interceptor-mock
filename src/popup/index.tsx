import { IconDoubleChevronLeft, IconDoubleChevronRight, IconRefresh, IconSetting } from '@douyinfe/semi-icons';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { Card, Empty, Input, Notification, TabPane, Tabs } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';

import { debounce } from '../utils/common';
import { copyAction, setObjectValue } from '../utils/popup';
import type { globalConfig, mockDataItem } from '../utils/type';
import { ActionPanel } from './components/ActionPanel';
import { ConfigSideSheet } from './components/ConfigSideSheet';
import { DropDownParam, HeaderExtraContent } from './components/HeaderExtraContent';
import { SingleSideSheet } from './components/SingleSideSheet';
import { useCopy } from './hooks/useCopy';
import { getUrlNumberData } from './parse';

import './index.scss';

const Cardtitle: React.FC<{ url: string; type: string }> = (props: { url: string; type: string }) => {
    const { url, type } = props;
    return (
        <div style={{ marginRight: '10px' }}>
            <Input value={url} addonBefore={`${type}-URL:`} disabled />
        </div>
    );
};

export const Popup: React.FC<{ mockDataPopup: mockDataItem[]; configPopup: globalConfig }> = (props: {
    mockDataPopup: mockDataItem[];
    configPopup: globalConfig;
}) => {
    const { mockDataPopup, configPopup } = props;
    const [config, setConfig] = useState(configPopup);
    const [visible, setVisible] = useState(false);
    const [singleVisible, setSingVisible] = useState(false);
    const [singMockData, setSingMockData] = useState<mockDataItem>({} as mockDataItem); // 点击单条配置所保存的item
    const [mockData, setMockData] = useState(mockDataPopup || []);
    const [controlRefresh, setControlRefresh] = useState(true); // 列表数据由用户手动改变了才刷新
    const [ready, setReady] = useState(false);
    const [show, setShow] = useState(false); // 是否展开状态
    const [ruleInput, setRuleInput] = useState('https?://'); // 过滤规则
    const { activeKey: defaultedKey, panelData } = getUrlNumberData(mockData, ruleInput); // 转换为面板数据
    const [activeKey, setActiveKey] = useState(defaultedKey);
    const copy = useCopy({
        onSuccess: (value) => {
            Notification.success({
                content: `Copy Success: ${value.toString().slice(0, 100)}`,
                duration: 1,
                position: 'top',
            });
        },
    });
    const setMockDataProps = (value: any, index: number, key: string[]) => {
        // 根据索引设置某个key的值
        setControlRefresh(true);
        const mock = [...mockData];
        const item = mock[index];
        const updateItem = setObjectValue(key, item, value);
        mock[index] = { ...item, ...updateItem };
        setMockData(mock);
    };
    // add edite delete的回调
    const changeHandel = (id: string, updatedSrc: object, key: string[]) => {
        findMockBuyUrl(id, (indexSwitch: number) => {
            setMockDataProps(JSON.stringify(updatedSrc), indexSwitch, key);
        });
    };
    const textAreaChange = (id: string, value: string, key: string[]) => {
        console.log(value.toString());
        let data: any; // 检查是否是合法的json
        try {
            data = JSON.parse(value);
            findMockBuyUrl(id, (indexSwitch: number) => {
                setMockDataProps(JSON.stringify(data), indexSwitch, key);
            });
        } catch {
            findMockBuyUrl(id, (indexSwitch: number) => {
                setMockDataProps(JSON.stringify(data), indexSwitch, key);
            });
        }
    };

    const refreshMockData = debounce(
        () => {
            // 将现有的数据重新发送个background，background也需要更新，然后在转发给content 在发到pagescript更新mock
            console.log('setmock', Date.now());
            chrome.runtime.sendMessage({ action: 'setMock', to: 'background', data: { mockData, config } });
        },
        2000,
        true,
    );
    const updateMockData = (item: mockDataItem) => {
        // 更新界面上的mockData数量
        setMockData((perData) => {
            const mock = [...perData];
            // 这里用url来判断不用id是因为 id会根据请求的数据生成，但是很多时候我就是要更新这个url的请求数据
            const index = mock.findIndex((el) => el.url === item.url);
            if (index === -1) {
                mock.push(item);
            } else {
                // 更新原生请求数据和响应数据
                mock[index].request.originData = item.request.originData;
                mock[index].originResponse = item.originResponse;
            }

            return mock;
        });
    };
    const getRefreshMockData = () => {
        chrome.runtime.onMessage.addListener((request) => {
            // 这里也会监听到发给content里的消息毕竟是一个content域
            if (request.action === 'update' && request.to === 'popup') {
                console.log('popup收到更新数据', request);
                updateMockData(request.data);
                setControlRefresh(false);
            }
        });
    };

    const showClickHandel = () => {
        setShow(!show);
        chrome.runtime.sendMessage({ to: 'background', action: 'toggle' });
    };

    const dropDownClick = (value: DropDownParam, el: mockDataItem) => {
        const { type } = value;
        // 超过三个判断可以用策略模式优化，目前不需要
        if (type === 'copy') {
            const data = copyAction(value.value as string[], el);
            data && copy(data);
        } else if (type === 'openSetItemModal') {
            // 打开单个配置侧边栏
            console.log('打开');
            setSingVisible(true);
            setSingMockData(el); // 设置当前配置数据为哪一条
        }
    };

    // 匹配规则保存到后台
    const ruleChangeHandel = (value: string) => {
        chrome.storage.local.set({ rule: value });
        setRuleInput(value);
    };

    const findMockBuyUrl = (id: string, fn: (index: number) => void) => {
        // 根据url 找到列表数据
        const indexSwitch = mockData.findIndex((item) => id === item.id);
        if (indexSwitch > -1) {
            fn(indexSwitch);
        }
    };
    useEffect(() => {
        chrome.storage.local.get('rule', (res) => {
            setRuleInput(res.rule);
        });
        setReady(true);
        getRefreshMockData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        console.log(defaultedKey, 'key值变化');
        setActiveKey(defaultedKey);
    }, [defaultedKey]);
    useEffect(() => {
        // 为了解决第一次加载也触发 refreshMockData
        if (ready && controlRefresh) {
            refreshMockData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mockData, config]);
    return (
        <div className="popup-box scrollbar">
            <ConfigSideSheet
                config={config}
                visible={visible}
                mockData={mockData}
                onCancel={(value: boolean) => {
                    setVisible(value);
                }}
                onChangeConfig={(value: globalConfig) => {
                    setControlRefresh(true);
                    setConfig(value);
                }}
                onchangeMockData={(mock: Array<mockDataItem>) => {
                    setControlRefresh(true);
                    setMockData(mock);
                }}
            />
            <SingleSideSheet
                visible={singleVisible}
                item={singMockData}
                itemChange={(item) => {
                    setControlRefresh(true);
                    findMockBuyUrl(item.id, (indexSwitch: number) => {
                        const mock = [...mockData];
                        mock[indexSwitch] = item;
                        setMockData(mock);
                    });
                }}
                onCancel={(value: boolean) => {
                    setSingVisible(value);
                }}
            />
            <div className="title-box">
                <h1 className="title">mT插件🤺</h1>
                <div>
                    <IconRefresh
                        style={{ margin: '0px 16px', cursor: 'pointer' }}
                        title="重新加载"
                        onClick={() => {
                            chrome.runtime.sendMessage({ to: 'background', action: 'reload' });
                        }}
                    />
                    <IconSetting
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setVisible(true);
                        }}
                    />
                </div>
            </div>
            <div onClick={showClickHandel} className="show-icon">
                {show ? <IconDoubleChevronRight /> : <IconDoubleChevronLeft />}
            </div>
            <Input
                addonBefore="过滤URL"
                onChange={(value: string) => {
                    ruleChangeHandel(value);
                }}
                value={ruleInput}
                className="rule-input"
            />

            {panelData.length > 0 && config.proxySwitch ? (
                <Tabs
                    type="card"
                    collapsible
                    defaultActiveKey={activeKey}
                    activeKey={activeKey}
                    onTabClick={(Key) => {
                        console.log(Key);
                        setActiveKey(Key);
                    }}
                >
                    {panelData.map((item) => (
                        <TabPane tab={item.url} itemKey={item.url} key={item.id} className="scrollbar">
                            {filterMockData(item.data, ruleInput).map((el, index) => (
                                <Card
                                    shadows="hover"
                                    key={el.id}
                                    className="card-box"
                                    title={<Cardtitle url={el.url} type={el.type} />}
                                    headerExtraContent={
                                        <HeaderExtraContent
                                            switchCheck={el.switch}
                                            switchChange={(value) => {
                                                findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                    setMockDataProps(value, indexSwitch, ['switch']);
                                                });
                                            }}
                                            dropdownClick={(value) => {
                                                dropDownClick(value, el);
                                            }}
                                        />
                                    }
                                >
                                    <ActionPanel
                                        valueChange={(id, value, key) => {
                                            findMockBuyUrl(id, (indexSwitch: number) => {
                                                setMockDataProps(value, indexSwitch, [key]);
                                            });
                                        }}
                                        textAreaChange={textAreaChange}
                                        changeHandel={changeHandel}
                                        data={el}
                                        index={index}
                                    />
                                </Card>
                            ))}
                        </TabPane>
                    ))}
                </Tabs>
            ) : (
                <div className="empty-wrapper">
                    <Empty
                        image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
                        darkModeImage={<IllustrationConstructionDark style={{ width: 150, height: 150 }} />}
                        title="哦豁，还没有任何数据"
                        description="打开右上角的设置，开启拦截开关试试！"
                    />
                </div>
            )}
        </div>
    );
};
/**
 * @description
 * 根据url地址和内容过滤接口
 * @param mockData
 * @param ruleInput
 */
const filterMockData = (mockData: mockDataItem[], ruleInput: string): mockDataItem[] =>
    mockData.filter((el: mockDataItem) => {
        if (!ruleInput) return true;
        const testArray = [el.url, el.response, el.originResponse];
        try {
            const reg = new RegExp(ruleInput, 'g');
            return testArray.some((item) => reg.test(item));
        } catch (error) {
            console.log(error);
            return false;
        }
    });

export default Popup;
