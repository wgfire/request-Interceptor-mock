import { useEffect, useState } from 'react';
import { Card, Switch, Input, Collapse } from 'antd';
// import TextArea from 'antd/lib/input/TextArea';

import './index.scss';
import { debounce } from '../../../utils/common';
import { postMockDataToScript } from '../index';
import { mockDataItem } from '../../../pageScript/index/utils';
import JSONInput from 'react-json-editor-ajrm';
//@ts-ignore
import locale from 'react-json-editor-ajrm/locale/en';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const Cardtitle: React.FC<{ url: string }> = (props) => {
    return (
        <div style={{ marginRight: '10px' }}>
            <Input value={props.url} prefix="URL:"></Input>
        </div>
    );
};

export const Iframe: React.FC<{ mockData: mockDataItem[] }> = (props) => {
    const [mockData, setMockData] = useState(props.mockData || []);
    const [ready, setReady] = useState(false);
    const [show, setShow] = useState(false); // 是否展开状态
    const [popup, setPopup] = useState<HTMLElement | null>(null); // 外层容器
    const [ruleInput, setRuleInput] = useState('https?://'); // 过滤规则

    const setMockDataProps = (value: any, index: number, key: string) => {
        const mock = [...mockData];
        mock[index][key] = value;
        setMockData(mock);
    };
    const refreshMockData = debounce(
        () => {
            console.log(mockData, '拦截数据变化');
            // 将现有的数据重新发送个background，background也需要更新，然后在转发给pagescript更新mock
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
                mock.push(item);
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
    const checkJson = (json: any) => {
        try {
            if (!json) return {};
            // 用户404 或者报错 会返回html文档导致解析失败
            if (typeof json === 'string') return JSON.parse(json);
            return json;
        } catch (error) {
            console.log(error);
        }
    };
    const showClickHandel = () => {
        popup!.style.setProperty(
            'transform',
            show ? 'translateX(455px)' : 'translateX(0px)',
            'important',
        );
        setShow(!show);
    };
    const changeHandel = debounce(
        (value: { json: any }, index: number, key: string = 'data') => {
            const data = [...mockData];
            const el = data[index];
            el['request'][key] = value.json;
            setMockData(data);
        },
        1000,
        false,
    );
    const ruleChangeHandel = debounce(
        (value: string) => {
            chrome.storage.local.set({ rule: value });
            setRuleInput(value);
            console.log(ruleInput, 'x');
        },
        100,
        false,
    );
    const findMockBuyUrl = (url: string, fn: (index: number) => void) => {
        // 根据url 找到列表数据
        const indexSwitch = mockData.findIndex((item) => {
            return url === item.url;
        });
        if (indexSwitch > -1) {
            fn(indexSwitch);
        }
    };
    useEffect(() => {
        chrome.storage.local.get('rule', (res) => {
            setRuleInput(res['rule']);
        });
        setPopup(document.getElementById('popup'));
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
            <h1 className="title">mT插件┗|｀O′|┛ 嗷~~</h1>
            <div onClick={showClickHandel} className="show-icon">
                {show ? (
                    <DoubleRightOutlined></DoubleRightOutlined>
                ) : (
                    <DoubleLeftOutlined></DoubleLeftOutlined>
                )}
            </div>
            <Input
                addonBefore="过滤URL"
                addonAfter="支持正则"
                onChange={(e) => {
                    ruleChangeHandel(e.currentTarget.value);
                }}
                value={ruleInput}
                defaultValue={ruleInput}
                className="card-box"
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
                                key={el.url}
                                className="card-box"
                                title={<Cardtitle url={el.url}></Cardtitle>}
                                extra={
                                    <Switch
                                        key={el.url}
                                        checked={el.switch}
                                        onChange={(value) => {
                                            console.log(value);
                                            findMockBuyUrl(el.url, (indexSwitch: number) => {
                                                setMockDataProps(value, indexSwitch, 'switch');
                                            });
                                        }}
                                    ></Switch>
                                }
                                size="small"
                            >
                                <Collapse>
                                    <Panel header="RequestHeader" key="1">
                                        <p>{'修改请求头地方'}</p>
                                        <JSONInput
                                            width="100%"
                                            id={`${index}+jsonInput`}
                                            placeholder={checkJson(el.request.headers)}
                                            onBlur={(value: Object) => {
                                                changeHandel(value, index, 'headers');
                                            }}
                                            locale={locale}
                                            height="150px"
                                        />
                                    </Panel>
                                </Collapse>
                                <Collapse>
                                    <Panel header="RequestData" key="1">
                                        <p>{'修改请求数据的地方'}</p>
                                        <JSONInput
                                            width="100%"
                                            id={`${index}+jsonInput`}
                                            placeholder={checkJson(el.request.data)}
                                            onBlur={(value: Object) => {
                                                changeHandel(value, index);
                                            }}
                                            locale={locale}
                                            height="150px"
                                        />
                                    </Panel>
                                </Collapse>
                                <Collapse>
                                    <Panel header="ResponseData" key="1">
                                        <p>{'修改返回数据的地方'}</p>
                                        <JSONInput
                                            width="100%"
                                            id={`${index}+jsonInput`}
                                            placeholder={checkJson(el.response)}
                                            onBlur={(value: any) => {
                                                findMockBuyUrl(el.url, (indexSwitch: number) => {
                                                    setMockDataProps(
                                                        value.json,
                                                        indexSwitch,
                                                        'response',
                                                    );
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

Iframe.defaultProps = {
    mockData: [],
};
