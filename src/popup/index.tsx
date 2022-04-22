import { useEffect, useState } from 'react';
import { Notification, Card, Input, Collapse } from '@douyinfe/semi-ui';
import './index.scss';
import { debounce } from '../utils/common';
import { postMockDataToScript } from '../utils/common';
import { copyAction } from '../utils/popup';
import { mockDataItem } from '../pageScript/index/utils';
import JSONInput from 'react-json-editor-ajrm';
//@ts-ignore
import locale from 'react-json-editor-ajrm/locale/en';
import { IconDoubleChevronRight, IconDoubleChevronLeft } from '@douyinfe/semi-icons';
import { ActionBar } from './components/ActionBar';
import { useCopy } from './hooks/useCopy';
import { CopyButton } from './components/CopyButton';
import { useDomFullRequest } from './hooks/useFullScreen';
import { HeaderExtraContent } from './components/HeaderExtraContent';
const { Panel } = Collapse;
const Cardtitle: React.FC<{ url: string; type: string }> = (props) => {
    return (
        <div style={{ marginRight: '10px' }}>
            <Input value={props.url} addonBefore={`${props.type}-URL:`}></Input>
        </div>
    );
};

export const Popup: React.FC<{ mockData: mockDataItem[] }> = (props) => {
    const [mockData, setMockData] = useState(props.mockData || []);
    const [ready, setReady] = useState(false);
    const [show, setShow] = useState(false); // 是否展开状态
    const [ruleInput, setRuleInput] = useState('https?://'); // 过滤规则
    const copy = useCopy({
        onSuccess: (value) => {
            Notification.success({
                content: `Copy Success: ${value.toString().substring(0, 100)}`,
                duration: 1,
                position: 'top',
            });
        },
    });
    const domFullRequest = useDomFullRequest({});
    const setMockDataProps = (value: any, index: number, key: string) => {
        // 根据索引设置某个key的值
        const mock = [...mockData];
        mock[index][key] = value;
        setMockData(mock);
    };
    // 请求数据和请求头的更新回调
    const changeHandel = debounce(
        (value: { json: any }, index: number, key: string = 'data') => {
            try {
                if (JSON.parse(value.json)) {
                    // 当用户改变的值是合法的json string 才去更新
                    const data = [...mockData];
                    const el = data[index];
                    el['request'][key] = value.json;
                    setMockData(data);
                }
            } catch (error) {}
        },
        1000,
        false,
    );
    const refreshMockData = debounce(
        () => {
            // 将现有的数据重新发送个background，background也需要更新，然后在转发给content 在发到pagescript更新mock
            chrome.runtime.sendMessage({ action: 'setMock', to: 'background', data: mockData }, function (response) {
                if (response) {
                    postMockDataToScript(response);
                }
            });
        },
        1000,
        false,
    );
    const updateMockData = (item: mockDataItem) => {
        // 更新界面上的mockData数量
        setMockData((mockData) => {
            const mock = [...mockData];
            const index = mock.findIndex((el) => {
                return el.id === item.id;
            });
            if (index == -1) {
                mock.push(item);
            } else {
                //更新原生请求数据和响应数据
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
            }
        });
    };
    const checkJson = (json: any) => {
        try {
            if (!json) return {};
            // 用户404 或者报错 会返回html文档导致解析失败
            if (typeof json === 'string') return JSON.parse(json);
            return json;
        } catch (error) {
            return false;
        }
    };
    const showClickHandel = () => {
        setShow(!show);
        chrome.runtime.sendMessage({ to: 'background', action: 'toggle' });
    };

    // 匹配规则保存到后台
    const ruleChangeHandel = debounce(
        (value: string) => {
            chrome.storage.local.set({ rule: value });
            setRuleInput(value);
        },
        100,
        false,
    );

    const findMockBuyUrl = (id: string, fn: (index: number) => void) => {
        // 根据url 找到列表数据
        const indexSwitch = mockData.findIndex((item) => {
            return id === item.id;
        });
        if (indexSwitch > -1) {
            fn(indexSwitch);
        }
    };

    useEffect(() => {
        chrome.storage.local.get('rule', (res) => {
            setRuleInput(res['rule']);
        });
        setReady(true);
        getRefreshMockData();
    }, []);
    useEffect(() => {
        // 为了解决第一次加载也触发 refreshMockData
        if (ready) {
            refreshMockData();
        }
    }, [mockData]);
    return (
        <div className="popup-box scrollbar">
            <div className="title-box">
                <h1 className="title">mT插件┗|｀O′|┛ 嗷~~</h1>
                <CopyButton
                    onClick={() => {
                        const noSwitchItem = mockData.find((el) => {
                            return el.switch === false;
                        });
                        const data = JSON.parse(noSwitchItem?.request.originData);
                        data && data.token && copy(data.token);
                    }}
                ></CopyButton>
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
            {mockData &&
                mockData
                    .filter((el) => {
                        const rule = new RegExp(ruleInput);
                        const result = ruleInput !== '' ? rule.test(el.url) : true;
                        return result;
                    })
                    .map((el, index) => {
                        return (
                            <Card
                                shadows="hover"
                                key={el.id}
                                className="card-box"
                                title={<Cardtitle url={el.url} type={el.type}></Cardtitle>}
                                headerExtraContent={
                                    <HeaderExtraContent
                                        switchCheck={el.switch}
                                        switchChange={(value) => {
                                            findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                setMockDataProps(value, indexSwitch, 'switch');
                                            });
                                        }}
                                        dropdownClick={(value) => {
                                            console.log(value);
                                            const data = copyAction(value.type, el);
                                            data && copy(data);
                                        }}
                                    ></HeaderExtraContent>
                                }
                            >
                                <Collapse>
                                    <Panel header="RequestHeader" itemKey="1">
                                        <ActionBar
                                            name={`请求头${el.showOriginHeader ? '(只读)' : ''}`}
                                            onclick={(type) => {
                                                if (type == 'expand') {
                                                    domFullRequest(`#s-${index}-1-jsonInput-body`);
                                                } else if (type === 'change') {
                                                    findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                        setMockDataProps(!el.showOriginHeader, indexSwitch, 'showOriginHeader');
                                                    });
                                                }
                                            }}
                                        ></ActionBar>

                                        <JSONInput
                                            width="100%"
                                            id={`s-${index}-1-jsonInput`}
                                            viewOnly={el.showOriginHeader}
                                            placeholder={checkJson(el.showOriginHeader ? el.request.originHeaders : el.request.headers)}
                                            onBlur={(value: Object) => {
                                                findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                    changeHandel(value, indexSwitch, 'headers');
                                                });
                                            }}
                                            locale={locale}
                                            height="150px"
                                        />
                                    </Panel>
                                </Collapse>
                                <Collapse>
                                    <Panel header="RequestData" itemKey="2">
                                        <ActionBar
                                            name={`请求数据${el.showOriginData ? '(只读)' : ''}`}
                                            onclick={(type) => {
                                                if (type == 'expand') {
                                                    domFullRequest(`#s-${index}-2-jsonInput-body`);
                                                } else if (type === 'change') {
                                                    findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                        setMockDataProps(!el.showOriginData, indexSwitch, 'showOriginData');
                                                    });
                                                }
                                                //    actionBarList[type]()
                                            }}
                                        ></ActionBar>
                                        <JSONInput
                                            confirmGood={true}
                                            width="100%"
                                            id={`s-${index}-2-jsonInput`}
                                            viewOnly={el.showOriginData}
                                            placeholder={checkJson(el.showOriginData ? el.request.originData : el.request.data)}
                                            onBlur={(value: Object) => {
                                                findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                    changeHandel(value, indexSwitch);
                                                });
                                            }}
                                            locale={locale}
                                            height="150px"
                                        />
                                    </Panel>
                                </Collapse>
                                <Collapse>
                                    <Panel header="ResponseData" itemKey="3">
                                        <ActionBar
                                            name={`返回数据${el.showOriginResponse ? '(只读)' : ''}`}
                                            onclick={(type) => {
                                                if (type == 'expand') {
                                                    domFullRequest(`#s-${index}-3-jsonInput-body`);
                                                } else if (type === 'change') {
                                                    findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                        setMockDataProps(!el.showOriginResponse, indexSwitch, 'showOriginResponse');
                                                    });
                                                }
                                            }}
                                        ></ActionBar>
                                        <JSONInput
                                            width="100%"
                                            id={`s-${index}-3-jsonInput`}
                                            placeholder={checkJson(el.showOriginResponse ? el.originResponse : el.response)}
                                            viewOnly={el.showOriginResponse}
                                            onBlur={(value: any) => {
                                                findMockBuyUrl(el.id, (indexSwitch: number) => {
                                                    if (checkJson(value.json)) {
                                                        setMockDataProps(value.json, indexSwitch, 'response');
                                                    }
                                                });
                                            }}
                                            locale={locale}
                                            height="450px"
                                        />
                                    </Panel>
                                </Collapse>
                            </Card>
                        );
                    })}
        </div>
    );
};

Popup.defaultProps = {
    mockData: [],
};
