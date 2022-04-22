/** 2022年/四月/22日/星期五
 *@reviewType.Perf
 *@reviewContent By Name
 1.Card组件右侧操作栏
 */

import React from 'react';
import './index.scss';

import { SplitButtonGroup, Dropdown, Button, Switch } from '@douyinfe/semi-ui';

import { IconTreeTriangleDown, IconCopy } from '@douyinfe/semi-icons';
import { DropDownMenuItem } from '@douyinfe/semi-ui/lib/es/dropdown';

export interface HeaderExtraContentProps {
    switchCheck: boolean;
    switchChange: (checked: boolean) => void;
    dropdownClick: (value: { type: string }) => void;
}
export const HeaderExtraContent: React.FC<HeaderExtraContentProps> = (props: HeaderExtraContentProps) => {
    const handleVisibleChange = (v: boolean) => {};
    const { switchCheck, switchChange, dropdownClick } = props;
    const menu: DropDownMenuItem[] = [
        { node: 'item', name: '复制URL', icon: <IconCopy />, onClick: () => dropdownClick({ type: 'url' }) },
        { node: 'item', name: '复制请求头', icon: <IconCopy />, onClick: () => dropdownClick({ type: 'header' }) },
        { node: 'item', name: '复制请求数据', icon: <IconCopy />, onClick: () => dropdownClick({ type: 'data' }) },
        { node: 'item', name: '复制响应数据', icon: <IconCopy />, onClick: () => dropdownClick({ type: 'response' }) },
    ];
    return (
        <div className="HeaderExtraContent">
            <Switch checked={switchCheck} size="small" onChange={switchChange}></Switch>
            <Dropdown onVisibleChange={(v) => handleVisibleChange(v)} menu={menu} trigger="hover" position="bottomRight">
                <Button type="primary" icon={<IconCopy />} size="small" theme="light" style={{ color: '#00b3a1' }}></Button>
            </Dropdown>
        </div>
    );
};

export default HeaderExtraContent;
