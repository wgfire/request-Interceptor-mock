/* eslint-disable react/jsx-indent */
import { SideSheet, Switch } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import React from 'react';

import { globalConfig } from '../../../utils/type';

export interface SideBarProps {
    visible: boolean;
    onCancel: (value: boolean) => void;
    config: globalConfig;
    onChange: (value: globalConfig) => void;
}
export const SideBar: React.FC<SideBarProps> = (props) => {
    const { visible, onCancel, config, onChange } = props;
    return (
        <div>
            <SideSheet
                title={<Title heading={5}>代理配置</Title>}
                visible={visible}
                placement="top"
                onCancel={(e) => {
                    onCancel(false);
                }}
                mask={false}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', margin: '0px 6px' }}>
                    <Title heading={6} style={{ margin: 8 }}>
                        withCredentials
                    </Title>
                    <Switch
                        checkedText="开"
                        uncheckedText="关"
                        size="default"
                        checked={config.withCredentials}
                        onChange={(checked: boolean) => {
                            onChange({ ...config, withCredentials: checked });
                        }}
                    />
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', margin: '0px 6px' }}>
                    <Title heading={6} style={{ margin: 8 }}>
                        开启拦截
                    </Title>
                    <Switch
                        checkedText="开"
                        uncheckedText="关"
                        size="default"
                        checked={config.proxySwitch}
                        onChange={(checked: boolean) => {
                            onChange({ ...config, proxySwitch: checked });
                        }}
                    />
                </div>
            </SideSheet>
        </div>
    );
};
export default SideBar;
