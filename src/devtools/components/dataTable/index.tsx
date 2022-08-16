//@ts-nocheck
import { Table, Typography } from '@douyinfe/semi-ui';
import { TextProps } from '@douyinfe/semi-ui/lib/es/typography/text';
import { DevtoolsRequests } from '../../../utils/type';

const { Paragraph, Text } = Typography;
export const DataTable: React.FC<{ data: Array<DevtoolsRequests> }> = (props: { data: Array<DevtoolsRequests> }) => {
    const { data } = props;
    return (
        <div>
            <Table columns={columns} dataSource={data} size="small" />
        </div>
    );
};
const columns = [
    {
        title: '请求地址',
        dataIndex: 'url',
        render: (text: string, item: DevtoolsRequests) => {
            return (
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
            );
        },
    },
    {
        title: '请求方法',
        dataIndex: 'method',
        render: (text: string, item: DevtoolsRequests) => <Text strong>{item.request.method}</Text>,
    },
    {
        title: '请求类型',
        dataIndex: '_resourceType',
        render: (text: string, item: DevtoolsRequests) => <Text strong>{item._resourceType}</Text>,
    },
    {
        title: '优先级',
        dataIndex: '_priority',
        render: (text: string, item: DevtoolsRequests) => (
            <Text strong type="warning">
                {item._priority}
            </Text>
        ),
    },
    {
        title: '等待时间',
        dataIndex: 'time',
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
        } else {
            if (time > times[0]) {
                result = keys;
            }
        }
    });
    return result;
};
export default DataTable;
