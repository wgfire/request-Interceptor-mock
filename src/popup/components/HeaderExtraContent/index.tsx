/** 2022年/四月/22日/星期五
 *@reviewType.Perf
 *@reviewContent By Name
 1.Card组件右侧操作栏
 */

import { IconCopy, IconSetting } from '@douyinfe/semi-icons';
import { Button, Dropdown, Switch } from '@douyinfe/semi-ui';
import { DropDownMenuItem } from '@douyinfe/semi-ui/lib/es/dropdown';
import React from 'react';

import './index.scss';

export type DropDownParam = { type: 'copy' | 'openSetItemModal'; value: string[] | string };
export interface HeaderExtraContentProps {
    switchCheck: boolean;
    switchChange: (checked: boolean) => void;
    dropdownClick: (value: DropDownParam) => void;
}
export const HeaderExtraContent: React.FC<HeaderExtraContentProps> = (props: HeaderExtraContentProps) => {
    const { switchCheck, switchChange, dropdownClick } = props;
    const menu: DropDownMenuItem[] = [
        { node: 'item', name: '复制URL', icon: <IconCopy />, onClick: () => dropdownClick({ type: 'copy', value: ['url'] }) },
        {
            node: 'item',
            name: '复制所有请求信息',
            icon: <IconCopy />,
            onClick: () => dropdownClick({ type: 'copy', value: ['header', 'data', 'response'] }),
        },
        {
            node: 'item',
            name: '请求配置',
            icon: <IconSetting />,
            onClick: () => dropdownClick({ type: 'openSetItemModal', value: '' }),
        },
    ];
    return (
        <div className="HeaderExtraContent">
            <Switch checked={switchCheck} size="small" onChange={switchChange} />
            <Dropdown menu={menu} trigger="click" position="bottomRight">
                <Button type="primary" icon={<IconSetting />} size="small" theme="light" style={{ color: '#00b3a1' }} />
            </Dropdown>
        </div>
    );
};

export default HeaderExtraContent;
