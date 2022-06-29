import { Switch, Table } from '@douyinfe/semi-ui';
import React, { useCallback, useEffect, useState } from 'react';

const pagination = {
    pageSize: 2,
};

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
    const { onChangeSwitch, dataSource } = props;
    const [currentPages, setCurrentPage] = useState(1);
    const [data, setData] = useState<Array<TableDataInterFace>>();

    const fetchData = useCallback(
        (currentPage = 1) => {
            console.log(currentPage, 'page');
            setCurrentPage(currentPage);
            const TableData = dataSource.slice((currentPage - 1) * pagination.pageSize, currentPage * pagination.pageSize);
            setData(TableData);
        },
        [dataSource],
    );

    const handlePageChange = (page: number) => {
        fetchData(page);
    };

    useEffect(() => {
        fetchData(currentPages);
    }, [currentPages, fetchData]);
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

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{
                currentPage: currentPages,
                pageSize: 2,
                total: dataSource.length,
                onPageChange: handlePageChange,
            }}
        />
    );
};

export default TableUrl;
