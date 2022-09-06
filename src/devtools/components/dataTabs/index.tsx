import React from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { IconFile, IconGlobe, IconHelpCircle } from '@douyinfe/semi-icons';

export const DataTabs: React.FC<{}> = (props: any) => {
    return (
        <Tabs tabPosition="left" type="line">
            <TabPane
                tab={
                    <span>
                        <IconFile />
                        文档
                    </span>
                }
                itemKey="1"
            >
                <div style={{ padding: '0 24px' }}>
                    <h3>文档</h3>
                    <p style={{ lineHeight: 1.8 }}>
                        Semi Design 是由互娱社区前端团队与 UED
                        团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
                        Web 应用。
                    </p>
                    <p style={{ lineHeight: 1.8 }}>
                        区别于其他的设计系统而言，Semi Design 以用户中心、内容优先、设计人性化为设计理念，具有以下优势：
                    </p>
                </div>
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <IconGlobe />
                        快速起步
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
                        帮助
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
