// @ts-nocheck
import { Table, Typography } from '@douyinfe/semi-ui';
import { TextProps } from '@douyinfe/semi-ui/lib/es/typography/text';
import { useState } from 'react';
import { DevtoolsRequests } from '../../../utils/type';

const { Paragraph, Text } = Typography;
export interface DataTableProps {
    data: Array<DevtoolsRequests>;
    clickRow: (item: DevtoolsRequests) => void;
}
export const DataTable: React.FC<DataTableProps> = (props: DataTableProps) => {
    const { data, clickRow } = props;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                size="small"
                onRow={(record, index) => {
                    const activeStyle = { background: index === activeIndex ? 'var(--semi-color-fill-0)' : 'var(--semi-color-white)' };
                    return {
                        onClick: () => {
                            console.log('点击', index);
                            setActiveIndex(index);
                            clickRow(record);
                        }, // 点击行
                        style: activeStyle,
                    };
                }}
            />
        </div>
    );
};
const columns = [
    {
        title: '请求地址',
        dataIndex: 'url',
        width: '100px',
        render: (text: string, item: DevtoolsRequests, index: number) => (
            <Paragraph
                link
                ellipsis={{
                    showTooltip: {
                        type: 'popover',
                        opts: {
                            style: { width: 400, wordBreak: 'break-all' },
                        },
                    },
                    pos: 'middle',
                    rows: 1,
                }}
                style={{ width: 300 }}
            >
                {item.request.url}
            </Paragraph>
        ),
    },
    {
        title: '请求方法',
        dataIndex: 'method',
        width: '90px',
        render: (text: string, item: DevtoolsRequests) => <Text strong>{item.request.method}</Text>,
    },
    {
        title: '请求类型',
        dataIndex: '_resourceType',
        width: '90px',
        render: (text: string, item: DevtoolsRequests) => <Text strong>{item._resourceType}</Text>,
    },
    {
        title: '优先级',
        dataIndex: '_priority',
        width: '100px',
        render: (text: string, item: DevtoolsRequests) => (
            <Text strong type="warning">
                {item._priority}
            </Text>
        ),
    },
    {
        title: '等待时间',
        dataIndex: 'time',
        width: '110px',
        sorter: (a: DevtoolsRequests, b: DevtoolsRequests) => (a.time - b.time > 0 ? 1 : -1), // 这里ts类型处理有问题
        render: (text: number) => <Text type={setTimeType(text)}>{`${text.toFixed(0)}ms`}</Text>,
    },
];

const setTimeType = (time: number): TextProps['type'] => {
    let result = 'success';
    const timeType = {
        success: [0, 100],
        warning: [100, 200],
        danger: [200],
    };
    Object.keys(timeType).forEach((keys: string) => {
        const times = timeType[keys];
        if (times[0] && times[1]) {
            if (time > times[0] && time <= times[1]) {
                result = keys;
            }
        } else if (time > times[0]) {
            result = keys;
        }
    });
    return result;
};
export default DataTable;
