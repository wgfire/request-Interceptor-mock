/** 2022年/六月/27日/星期一  buy vscode插件-apop-code
*@reviewType.Perf
*@reviewContent By 王港
1.单个URL的请求配置
*/

import { Input, SideSheet, Switch } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useEffect, useState } from 'react';
import { IconClose, IconTick } from '@douyinfe/semi-icons';
import { mockDataItem } from '../../../utils/type';
import { useUpdateEffect } from '../../hooks/useUpdateEffect';

const reg = /^(((ht|f)tps?):\/{2})?([^\s!#$%&*.?@^-]([^\s!#$%&*.?@^]{1,64})?\.)+[a-z]{2,6}\/?/;
export interface SingleSideSheetProps {
    visible: boolean;
    item: mockDataItem;
    onCancel: (value: boolean) => void;
    itemChange: (item: mockDataItem) => void;
}

export const SingleSideSheet = (props: SingleSideSheetProps) => {
    const { onCancel, visible, item, itemChange } = props;
    const [data, setData] = useState<mockDataItem>(item);
    const [url, setUrl] = useState('');
    useUpdateEffect(() => {
        setData(item);
        setUrl(item.proxy.url);
    }, [item]);
    const setSuffix = (value: string): React.ReactElement => (
        <div style={{ width: '72px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            格式：{reg.test(value) ? <IconTick /> : <IconClose />}
        </div>
    );
    return (
        <SideSheet
            title={<Title heading={5}>请求配置</Title>}
            visible={visible}
            placement="top"
            zIndex={1_000_000}
            onCancel={(e) => {
                onCancel(false);
            }}
        >
            {data.id && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Input
                        addonBefore="代理地址"
                        onChange={(value: string) => {
                            setUrl(value);

                            if (reg.test(value)) {
                                data.proxy.url = value;
                                itemChange(data);
                            }
                        }}
                        value={url}
                        suffix={setSuffix(url)}
                        showClear
                        style={{ width: '80%' }}
                    />
                    <Switch
                        defaultChecked={data.proxy.switch}
                        onChange={(checked) => {
                            data.proxy.switch = checked;
                            itemChange(data);
                        }}
                        size="small"
                    />
                </div>
            )}
        </SideSheet>
    );
};

export default SingleSideSheet;
