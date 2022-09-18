import React, { useEffect } from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { IconFile, IconGlobe, IconHelpCircle } from '@douyinfe/semi-icons';
import ReactJson, { InteractionProps } from 'react-json-view';
import { mockDataItem } from '../../../utils/type';

export interface DataTabsProps {
    mockData: mockDataItem;
    changeHandel: (id: string, updatedSrc: object, key: string[]) => void;
    textAreaChange: (id: string, value: string, key: string[]) => void;
}

export const DataTabs: React.FC<DataTabsProps> = (props: DataTabsProps) => {
    const { mockData, changeHandel, textAreaChange } = props;
    useEffect(() => {
        console.log(mockData, '面板数据改变');
    }, [mockData]);
    return (
        <Tabs tabPosition="left" type="card" defaultActiveKey="1">
            <TabPane
                tab={
                    <span>
                        <IconFile />
                        RequestHeader
                    </span>
                }
                itemKey="1"
                disabled={!mockData.id}
            >
                <div style={{ padding: '8px 12px' }}>
                    <div id="s-1-jsonInput-body">
                        <ReactJson
                            name={false}
                            collapsed
                            theme="monokai"
                            collapseStringsAfterLength={12}
                            src={checkJson(mockData.showOriginHeader ? mockData.request.originHeaders : mockData.request.headers)}
                            onEdit={(value: InteractionProps) => {
                                if (mockData.showOriginHeader) return false;
                                //  changeHandel(mockData?.id, value.updated_src, ['request', 'headers']);
                                return true;
                            }}
                            onAdd={(value: InteractionProps) => {
                                if (mockData.showOriginHeader) return false;
                                //  changeHandel(mockData?.id, value.updated_src, ['request', 'headers']);
                                return true;
                            }}
                            onDelete={(value: InteractionProps) => {
                                if (mockData.showOriginHeader) return false;
                                // changeHandel(mockData?.id, value.updated_src, ['request', 'headers']);
                                return true;
                            }}
                            displayDataTypes
                        />
                        {!mockData.showOriginHeader && (
                            <textarea
                                rows={4}
                                cols={51}
                                style={{ width: '100%' }}
                                value={mockData?.request.headers}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    textAreaChange(mockData?.id, e.currentTarget.value, ['request', 'headers']);
                                }}
                            />
                        )}
                    </div>
                </div>
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <IconGlobe />
                        RequestData
                    </span>
                }
                itemKey="2"
            >
                <div style={{ padding: '0 12px' }}>
                    <div id="s-2-jsonInput-body">
                        <ReactJson
                            name={false}
                            collapsed
                            theme="monokai"
                            collapseStringsAfterLength={12}
                            src={checkJson(mockData.showOriginData ? mockData.request.originData : mockData.request.data)}
                            onEdit={(value: InteractionProps) => {
                                if (mockData.showOriginData) return false;
                                // changeHandel(data.id, value.updated_src, ['request', 'data']);
                                return true;
                            }}
                            onAdd={(value: InteractionProps) => {
                                if (mockData.showOriginData) return false;
                                // changeHandel(data.id, value.updated_src, ['request', 'data']);
                                return true;
                            }}
                            onDelete={(value: InteractionProps) => {
                                if (mockData.showOriginData) return false;
                                // changeHandel(data.id, value.updated_src, ['request', 'data']);
                                return true;
                            }}
                            displayDataTypes={false}
                        />
                        {!mockData.showOriginData && (
                            <textarea
                                rows={4}
                                cols={51}
                                value={mockData.request.data}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    textAreaChange(mockData.id, e.currentTarget.value, ['request', 'data']);
                                }}
                            />
                        )}
                    </div>
                </div>
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <IconHelpCircle />
                        ResponseData
                    </span>
                }
                itemKey="3"
            >
                <div style={{ padding: '0 12px' }}>
                    <div id="s-3-jsonInput-body">
                        <ReactJson
                            name={false}
                            collapsed
                            theme="monokai"
                            collapseStringsAfterLength={12}
                            src={checkJson(mockData.showOriginResponse ? mockData.originResponse : mockData.response)}
                            onEdit={(value: InteractionProps) => {
                                if (mockData.showOriginResponse) return false;
                                changeHandel(mockData.id, value.updated_src, ['response']);
                                return true;
                            }}
                            onAdd={(value: InteractionProps) => {
                                if (mockData.showOriginResponse) return false;
                                changeHandel(mockData.id, value.updated_src, ['response']);
                                return true;
                            }}
                            onDelete={(value: InteractionProps) => {
                                if (mockData.showOriginResponse) return false;
                                changeHandel(mockData.id, value.updated_src, ['response']);
                                return true;
                            }}
                            displayDataTypes={false}
                        />
                        {!mockData.showOriginResponse && (
                            <textarea
                                rows={4}
                                cols={51}
                                value={mockData.response}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    textAreaChange(mockData.id, e.currentTarget.value, ['response']);
                                }}
                            />
                        )}
                    </div>
                </div>
            </TabPane>
        </Tabs>
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
export default DataTabs;
