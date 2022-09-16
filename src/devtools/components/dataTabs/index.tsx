import React, { useEffect } from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { IconFile, IconGlobe, IconHelpCircle } from '@douyinfe/semi-icons';
import ReactJson, { InteractionProps } from 'react-json-view';
import { mockDataItem } from '../../../utils/type';

export interface DataTabsProps {
    mockData: mockDataItem | undefined;
}

export const DataTabs: React.FC<DataTabsProps> = (props: DataTabsProps) => {
    const { mockData } = props;
    useEffect(() => {
        console.log(mockData, '面板数据改变');
    }, []);
    return (
        <Tabs tabPosition="left" type="line" defaultActiveKey="1">
            <TabPane
                tab={
                    <span>
                        <IconFile />
                        RequestHeader
                    </span>
                }
                itemKey="1"
                disabled={!!mockData?.id}
            >
                <div style={{ padding: '8px 12px' }}>
                    <div id="s-1-jsonInput-body">
                        <ReactJson
                            name={false}
                            collapsed
                            theme="monokai"
                            collapseStringsAfterLength={12}
                            src={checkJson(mockData?.showOriginHeader ? mockData?.request.originHeaders : mockData?.request.headers)}
                            onEdit={(value: InteractionProps) => {
                                if (mockData?.showOriginHeader) return false;
                                //  changeHandel(mockData?.id, value.updated_src, ['request', 'headers']);
                                return true;
                            }}
                            onAdd={(value: InteractionProps) => {
                                if (mockData?.showOriginHeader) return false;
                                //  changeHandel(mockData?.id, value.updated_src, ['request', 'headers']);
                                return true;
                            }}
                            onDelete={(value: InteractionProps) => {
                                if (mockData?.showOriginHeader) return false;
                                // changeHandel(mockData?.id, value.updated_src, ['request', 'headers']);
                                return true;
                            }}
                            displayDataTypes
                        />
                        {!mockData?.showOriginHeader && (
                            <textarea
                                rows={4}
                                cols={51}
                                style={{ width: '100%' }}
                                value={mockData?.request.headers}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    //   textAreaChange(mockData?.id, e.currentTarget.value, ['request', 'headers']);
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
                <div style={{ padding: '0 24px' }}>
                    <h3>快速起步</h3>
                    <pre
                        style={{
                            margin: '24px 0',
                            padding: '20px',
                            border: 'none',
                            whiteSpace: 'normal',
                            borderRadius: '6px',
                            color: 'var(--semi-color-text-1)',
                            backgroundColor: 'var(--semi-color-fill-0)',
                        }}
                    >
                        <code>yarn add @douyinfe/semi-ui</code>
                    </pre>
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
                <div style={{ padding: '0 24px' }}>
                    <h3>帮助</h3>
                    <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                        Q：有新组件需求、或者现有组件feature不能满足业务需求？
                    </p>
                    <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                        右上角问题反馈，提交issue，label选择Feature Request / New Component Request 我们会高优处理这些需求。
                    </p>
                    <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>Q：对组件的使用有疑惑？</p>
                    <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>欢迎进我们的客服lark群进行咨询提问。</p>
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
