import { Collapse } from '@douyinfe/semi-ui';
import React from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';

import { mockDataItem } from '../../../utils/type';
import { useDomFullRequest } from '../../hooks/useFullScreen';
import { ActionBar } from '../ActionBar';

const { Panel } = Collapse;
export interface ActionPanelProps {
    data: mockDataItem;
    index: number;
    valueChange: (id: string, value: any, key: string) => void;
    changeHandel: (id: string, updatedSrc: object, key: string[]) => void;
    textAreaChange: (id: string, value: string, key: string[]) => void;
}
export const ActionPanel = React.memo((props: ActionPanelProps) => {
    const { data, index, changeHandel, textAreaChange, valueChange } = props;
    const domFullRequest = useDomFullRequest({});
    return (
        <>
            <Collapse>
                <Panel itemKey={`${index}`} header="RequestHeader">
                    <ActionBar
                        onclick={(type) => {
                            if (type === 'expand') {
                                domFullRequest(`#s-${index}-1-jsonInput-body`);
                            } else if (type === 'change') {
                                valueChange(data.id, !data.showOriginHeader, 'showOriginHeader');
                                // setMockDataProps(!data.showOriginHeader, indexSwitch, ['showOriginHeader']);
                            }
                        }}
                        name={`请求头${data.showOriginHeader ? '(只读)' : ''}`}
                    />
                    <div id={`s-${index}-1-jsonInput-body`}>
                        <ReactJson
                            name={false}
                            collapsed
                            theme="monokai"
                            collapseStringsAfterLength={12}
                            src={checkJson(data.showOriginHeader ? data.request.originHeaders : data.request.headers)}
                            onEdit={(value: InteractionProps) => {
                                if (data.showOriginHeader) return false;
                                changeHandel(data.id, value.updated_src, ['request', 'headers']);
                                return true;
                            }}
                            onAdd={(value: InteractionProps) => {
                                if (data.showOriginHeader) return false;
                                changeHandel(data.id, value.updated_src, ['request', 'headers']);
                                return true;
                            }}
                            onDelete={(value: InteractionProps) => {
                                if (data.showOriginHeader) return false;
                                changeHandel(data.id, value.updated_src, ['request', 'headers']);
                                return true;
                            }}
                            displayDataTypes
                        />
                        {!data.showOriginHeader && (
                            <textarea
                                rows={4}
                                cols={51}
                                value={data.request.headers}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    textAreaChange(data.id, e.currentTarget.value, ['request', 'headers']);
                                }}
                            />
                        )}
                    </div>
                </Panel>
            </Collapse>
            <Collapse>
                <Panel header="RequestData" itemKey="2">
                    <ActionBar
                        name={`请求数据${data.showOriginData ? '(只读)' : ''}`}
                        onclick={(type) => {
                            if (type === 'expand') {
                                domFullRequest(`#s-${index}-2-jsonInput-body`);
                            } else if (type === 'change') {
                                valueChange(data.id, !data.showOriginData, 'showOriginData');
                            }
                        }}
                    />
                    <div id={`s-${index}-2-jsonInput-body`}>
                        <ReactJson
                            name={false}
                            collapsed
                            theme="monokai"
                            collapseStringsAfterLength={12}
                            src={checkJson(data.showOriginData ? data.request.originData : data.request.data)}
                            onEdit={(value: InteractionProps) => {
                                if (data.showOriginData) return false;
                                changeHandel(data.id, value.updated_src, ['request', 'data']);
                                return true;
                            }}
                            onAdd={(value: InteractionProps) => {
                                if (data.showOriginData) return false;
                                changeHandel(data.id, value.updated_src, ['request', 'data']);
                                return true;
                            }}
                            onDelete={(value: InteractionProps) => {
                                if (data.showOriginData) return false;
                                changeHandel(data.id, value.updated_src, ['request', 'data']);
                                return true;
                            }}
                            displayDataTypes={false}
                        />
                        {!data.showOriginData && (
                            <textarea
                                rows={4}
                                cols={51}
                                value={data.request.data}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    textAreaChange(data.id, e.currentTarget.value, ['request', 'data']);
                                }}
                            />
                        )}
                    </div>
                </Panel>
            </Collapse>
            <Collapse>
                <Panel header="ResponseData" itemKey="3">
                    <ActionBar
                        name={`返回数据${data.showOriginResponse ? '(只读)' : ''}`}
                        onclick={(type: string) => {
                            if (type === 'expand') {
                                domFullRequest(`#s-${index}-3-jsonInput-body`);
                            } else if (type === 'change') {
                                valueChange(data.id, !data.showOriginResponse, 'showOriginResponse');
                            }
                        }}
                    />
                    <div id={`s-${index}-3-jsonInput-body`}>
                        <ReactJson
                            name={false}
                            collapsed
                            theme="monokai"
                            collapseStringsAfterLength={12}
                            src={checkJson(data.showOriginResponse ? data.originResponse : data.response)}
                            onEdit={(value: InteractionProps) => {
                                if (data.showOriginResponse) return false;
                                changeHandel(data.id, value.updated_src, ['response']);
                                return true;
                            }}
                            onAdd={(value: InteractionProps) => {
                                if (data.showOriginResponse) return false;
                                changeHandel(data.id, value.updated_src, ['response']);
                                return true;
                            }}
                            onDelete={(value: InteractionProps) => {
                                if (data.showOriginResponse) return false;
                                changeHandel(data.id, value.updated_src, ['response']);
                                return true;
                            }}
                            displayDataTypes={false}
                        />
                        {!data.showOriginResponse && (
                            <textarea
                                rows={4}
                                cols={51}
                                value={data.response}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    textAreaChange(data.id, e.currentTarget.value, ['response']);
                                }}
                            />
                        )}
                    </div>
                </Panel>
            </Collapse>
        </>
    );
});
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
export default ActionPanel;
