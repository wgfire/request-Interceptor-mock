/* eslint-disable react/jsx-indent */
import { SideSheet, Switch } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import React, { useEffect, useState } from 'react';
import { globalConfig, mockDataItem } from '../../../utils/type';
import TableUrl, { TableDataInterFace } from '../TableUrl';

export interface SideBarProps {
    visible: boolean;
    onCancel: (value: boolean) => void;
    config: globalConfig;
    onChangeConfig: (value: globalConfig) => void;
    mockData: Array<mockDataItem>;
    onchangeMockData: (value: Array<mockDataItem>) => void;
}
export const SideBar: React.FC<SideBarProps> = (props) => {
    const { visible, onCancel, config, onChangeConfig: onChange, mockData, onchangeMockData } = props;
    const [TableData, setTableData] = useState<Array<TableDataInterFace>>([]);
    useEffect(() => {
        setTableData(getTableData(mockData));
    }, [mockData]);
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
                <div style={{ margin: '0px 6px' }}>
                    <Title heading={6} style={{ margin: 8 }}>
                        URL列表：
                    </Title>
                    <TableUrl
                        dataSource={TableData}
                        onChangeSwitch={(item, value) => {
                            console.log(item, value);
                            const itemIndex = TableData.findIndex((el) => el.url === item.url);
                            TableData[itemIndex].switch = value;
                            setTableData([...TableData]);
                            onchangeMockData(setMockData(mockData, item));
                        }}
                    />
                </div>
            </SideSheet>
        </div>
    );
};
const setMockData = (mockData: Array<mockDataItem>, item: TableDataInterFace): Array<mockDataItem> =>
    mockData.map((el) => {
        const domain = el.url.match(/^(https?:\/\/)\S+(\.cn|\.com|\.\w+)\//g)![0];
        if (domain === item.url) {
            return {
                ...el,
                switch: item.switch,
            };
        }
        return el;
    });
const getTableData = function (data: Array<mockDataItem>): Array<TableDataInterFace> {
    const temObj: { [key: string]: { number: number; switch: boolean } } = {} as { [key: string]: { number: number; switch: boolean } };
    const temArr: Array<TableDataInterFace> = [];
    data.forEach((el) => {
        try {
            const domain = el.url.match(/^(https?:\/\/)\S+(\.cn|\.com|\.\w+)\//g)![0];
            if (temObj[domain]) {
                temObj[domain].number += 1;
            } else {
                temObj[domain] = {
                    number: 1,
                    switch: true,
                };
            }
        } catch (error) {
            console.log(error, el, '错误');
        }
    });
    Object.keys(temObj).forEach((keys) => {
        const mockDataArray = data.filter((el) => el.url.match(/^(https?:\/\/)\S+(\.cn|\.com|\.\w+)\//g)![0] === keys);
        const result = mockDataArray.some((el) => el.switch === true);
        temObj[keys].switch = result;
        temArr.push({
            url: keys,
            number: temObj[keys].number,
            switch: result,
        });
    });
    return temArr;
};
export default SideBar;
