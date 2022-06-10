import { Switch, Table } from '@douyinfe/semi-ui';
import React, { useState } from 'react';

export interface TableDataInterFace {
    url: string;
    number: number;
    switch: boolean;
}
export interface TableProps {
    dataSource: Array<TableDataInterFace>;
    onChangeSwitch: (item: TableDataInterFace, value: boolean) => void;
}
const TableUrl: React.FC<TableProps> = (props: TableProps) => {
    const { dataSource, onChangeSwitch } = props;
    // const [TableData, setData] = useState(dataSource);
    const columns = [
        {
            title: 'URL',
            dataIndex: 'url',
            render: (text: string, record: TableDataInterFace) => <div>{text}</div>,
        },
        {
            title: '个数',
            dataIndex: 'number',
        },
        {
            title: '状态',
            dataIndex: 'switch',
            render: (text: boolean, record: TableDataInterFace) => (
                <Switch
                    size="small"
                    checked={text}
                    onChange={(value) => {
                        console.log(value);
                        const newRecode = { ...record, switch: value };
                        onChangeSwitch(newRecode, value);
                    }}
                />
            ),
        },
    ];
    const data = [
        {
            url: 'https://www.baidu.com',
            number: 10,
            switch: true,
        },
    ];
    return (
        <Table
            columns={columns}
            dataSource={dataSource || data}
            pagination={{
                pageSize: 2,
            }}
        />
    );
};

export default TableUrl;
