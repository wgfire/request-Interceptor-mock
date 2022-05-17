import { IconDoubleChevronLeft, IconDoubleChevronRight, IconSetting } from '@douyinfe/semi-icons';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { Card, Collapse, Empty, Input, Notification } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';

import { debounce } from '../utils/common';
import { copyAction, setObjectValue } from '../utils/popup';
import type { globalConfig, mockDataItem } from '../utils/type';
import { ActionBar } from './components/ActionBar';
import { CopyButton } from './components/CopyButton';
import { HeaderExtraContent } from './components/HeaderExtraContent';
import { SideBar } from './components/sideBar/sideBar';
import { useCopy } from './hooks/useCopy';
import { useDomFullRequest } from './hooks/useFullScreen';

import './index.scss';

const { Panel } = Collapse;
const Cardtitle: React.FC<{ url: string; type: string }> = (props: { url: string; type: string }) => {
    const { url, type } = props;
    return (
        <div style={{ marginRight: '10px' }}>
            <Input value={url} addonBefore={`${type}-URL:`} />
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
    const [mockData, setMockData] = useState(mockDataPopup || []);
    const [controlRefsh, setControlRefsh] = useState(true);
    const [ready, setReady] = useState(false);
    const [show, setShow] = useState(false); // 是否展开状态
    const [ruleInput, setRuleInput] = useState('https?://'); // 过滤规则
    const copy = useCopy({
        onSuccess: (value) => {
            Notification.success({
                content: `Copy Success: ${value.toString().slice(0, 100)}`,
                duration: 1,
                position: 'top',
            });
        },
    });
    const domFullRequest = useDomFullRequest({});
    const setMockDataProps = (value: any, index: number, key: string[]) => {
        // 根据索引设置某个key的值
        setControlRefsh(true);
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
        try {
            const data = JSON.parse(value); // 检查是否是合法的json
            findMockBuyUrl(id, (indexSwitch: number) => {
                setMockDataProps(JSON.stringify(data), indexSwitch, key);
            });
        } catch {
            Notification.error({
                content: `JSON解析失败，请检查JSON格式`,
                duration: 2,
                position: 'top',
            });
        }
    };

    const refreshMockData = debounce(
        () => {
            // 将现有的数据重新发送个background，background也需要更新，然后在转发给content 在发到pagescript更新mock
            chrome.runtime.sendMessage({ action: 'setMock', to: 'background', data: { mockData, config } });
        },
        1000,
        false,
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
                setControlRefsh(false);
            }
        });
    };

    const showClickHandel = () => {
        setShow(!show);
        chrome.runtime.sendMessage({ to: 'background', action: 'toggle' });
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
        // 为了解决第一次加载也触发 refreshMockData
        console.log('controlRefsh', controlRefsh);
        if (ready && controlRefsh) {
            refreshMockData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mockData, config]);
    return (
        <div className="popup-box scrollbar">
            <SideBar
                config={config}
                visible={visible}
                onCancel={(value: boolean) => {
                    setVisible(value);
                }}
                onChange={(value: globalConfig) => {
                    setConfig(value);
                }}
            />
            <div className="title-box">
                <h1 className="title">mT插件┗|｀O′|┛ 嗷~~</h1>

                {
                    /**
                     * 右上角的按钮,个人团队定制需求，不需要的直接删掉就行
                     */
                    <CopyButton
                        style={{ marginLeft: '100px' }}
                        onClick={() => {
                            mockData.find((el) => {
                                const data = JSON.parse(el.request.originData);
                                if (el.switch === false && el.url.includes('cgsupplier.developer.check-expire') && data && data.token) {
                                    copy(data.token);
                                    return true;
                                }
                                return false;
                            });
                        }}
                    />
                }
                <IconSetting
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setVisible(true);
                    }}
                />
            </div>
            <div onClick={showClickHandel} className="show-icon">
                {show ? <IconDoubleChevronRight /> : <IconDoubleChevronLeft />}
            </div>
            <Input
                addonBefore="过滤URL"
                addonAfter="支持正则"
                onChange={(value: string) => {
                    ruleChangeHandel(value);
                }}
                value={ruleInput}
                className="rule-input"
            />
            {mockData.length > 0 ? (
                filterMockData(mockData, ruleInput).map((el, index) => (
                    // @ts-ignore
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
                                    console.log(value);
                                    const data = copyAction(value.value as string[], el);
                                    data && copy(data);
                                }}
                            />
                        }
                    >
                        <Collapse>
                            <Panel header="RequestHeader" itemKey="1">
                                <ActionBar
                                    name={`请求头${el.showOriginHeader ? '(只读)' : ''}`}
                                    onclick={(type) => {
                                        if (type === 'expand') {
                                            domFullRequest(`#s-${index}-1-jsonInput-body`);
                                        } else if (type === 'change') {
                                            findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                setMockDataProps(!el.showOriginHeader, indexSwitch, ['showOriginHeader']);
                                            });
                                        }
                                    }}
                                />
                                <div id={`s-${index}-1-jsonInput-body`}>
                                    <ReactJson
                                        name={false}
                                        collapsed
                                        theme="monokai"
                                        collapseStringsAfterLength={12}
                                        src={checkJson(el.showOriginHeader ? el.request.originHeaders : el.request.headers)}
                                        onEdit={(value: InteractionProps) => {
                                            if (el.showOriginHeader) return false;
                                            changeHandel(el.id, value.updated_src, ['request', 'headers']);
                                            return true;
                                        }}
                                        onAdd={(value: InteractionProps) => {
                                            if (el.showOriginHeader) return false;
                                            changeHandel(el.id, value.updated_src, ['request', 'headers']);
                                            return true;
                                        }}
                                        onDelete={(value: InteractionProps) => {
                                            if (el.showOriginHeader) return false;
                                            changeHandel(el.id, value.updated_src, ['request', 'headers']);
                                            return true;
                                        }}
                                        displayDataTypes={false}
                                    />
                                    {!el.showOriginHeader && (
                                        <textarea
                                            rows={4}
                                            cols={51}
                                            value={el.request.headers}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                textAreaChange(el.id, e.currentTarget.value, ['request', 'headers']);
                                            }}
                                        />
                                    )}
                                </div>
                            </Panel>
                        </Collapse>
                        <Collapse>
                            <Panel header="RequestData" itemKey="2">
                                <ActionBar
                                    name={`请求数据${el.showOriginData ? '(只读)' : ''}`}
                                    onclick={(type) => {
                                        if (type === 'expand') {
                                            domFullRequest(`#s-${index}-2-jsonInput-body`);
                                        } else if (type === 'change') {
                                            findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                setMockDataProps(!el.showOriginData, indexSwitch, ['showOriginData']);
                                            });
                                        }
                                        //    actionBarList[type]()
                                    }}
                                />
                                <div id={`s-${index}-2-jsonInput-body`}>
                                    <ReactJson
                                        name={false}
                                        collapsed
                                        theme="monokai"
                                        collapseStringsAfterLength={12}
                                        src={checkJson(el.showOriginData ? el.request.originData : el.request.data)}
                                        onEdit={(value: InteractionProps) => {
                                            if (el.showOriginData) return false;
                                            changeHandel(el.id, value.updated_src, ['request', 'data']);
                                            return true;
                                        }}
                                        onAdd={(value: InteractionProps) => {
                                            if (el.showOriginData) return false;
                                            changeHandel(el.id, value.updated_src, ['request', 'data']);
                                            return true;
                                        }}
                                        onDelete={(value: InteractionProps) => {
                                            if (el.showOriginData) return false;
                                            changeHandel(el.id, value.updated_src, ['request', 'data']);
                                            return true;
                                        }}
                                        displayDataTypes={false}
                                    />
                                    {!el.showOriginData && (
                                        <textarea
                                            rows={4}
                                            cols={51}
                                            value={el.request.data}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                textAreaChange(el.id, e.currentTarget.value, ['request', 'data']);
                                            }}
                                        />
                                    )}
                                </div>
                            </Panel>
                        </Collapse>
                        <Collapse>
                            <Panel header="ResponseData" itemKey="3">
                                <ActionBar
                                    name={`返回数据${el.showOriginResponse ? '(只读)' : ''}`}
                                    onclick={(type: string) => {
                                        if (type === 'expand') {
                                            domFullRequest(`#s-${index}-3-jsonInput-body`);
                                        } else if (type === 'change') {
                                            findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                setMockDataProps(!el.showOriginResponse, indexSwitch, ['showOriginResponse']);
                                            });
                                        }
                                    }}
                                />
                                <div id={`s-${index}-3-jsonInput-body`}>
                                    <ReactJson
                                        name={false}
                                        collapsed
                                        theme="monokai"
                                        collapseStringsAfterLength={12}
                                        src={checkJson(el.showOriginResponse ? el.originResponse : el.response)}
                                        onEdit={(value: InteractionProps) => {
                                            if (el.showOriginResponse) return false;
                                            changeHandel(el.id, value.updated_src, ['response']);
                                            return true;
                                        }}
                                        onAdd={(value: InteractionProps) => {
                                            if (el.showOriginResponse) return false;
                                            changeHandel(el.id, value.updated_src, ['response']);
                                            return true;
                                        }}
                                        onDelete={(value: InteractionProps) => {
                                            if (el.showOriginResponse) return false;
                                            changeHandel(el.id, value.updated_src, ['response']);
                                            return true;
                                        }}
                                        displayDataTypes={false}
                                    />
                                    {!el.showOriginResponse && (
                                        <textarea
                                            rows={4}
                                            cols={51}
                                            value={el.response}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                textAreaChange(el.id, e.currentTarget.value, ['response']);
                                            }}
                                        />
                                    )}
                                </div>
                            </Panel>
                        </Collapse>
                    </Card>
                ))
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
const checkJson = (json: any) => {
    try {
        if (!json) return {};
        // 用户404 或者报错 会返回html文档导致解析失败
        if (typeof json === 'string' && /^{.+}$/.test(json)) return JSON.parse(json);
        if (json instanceof Object) json;
        return {};
    } catch {
        return {};
    }
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
        const reg = new RegExp(ruleInput, 'g');
        return testArray.some((item) => reg.test(item));
    });

export default Popup;
