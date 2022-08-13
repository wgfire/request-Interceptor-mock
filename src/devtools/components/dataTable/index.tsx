import { Table } from '@douyinfe/semi-ui';
import { DevtoolsRequests } from '../../../utils/type';

export const DataTable: React.FC<{ data: Array<DevtoolsRequests> }> = (props: { data: Array<DevtoolsRequests> }) => {
    const { data } = props;
    return (
        <div>
            <Table columns={columns} dataSource={data} pagination={false} size="small" />
        </div>
    );
};
// const data = [
//     {
//         key: '1',
//         name: 'Semi Design 设计稿.fig',
//         nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png',
//         size: '2M',
//         owner: '姜鹏志',
//         updateTime: '2020-02-02 05:13',
//         avatarBg: 'grey',
//     },
//     {
//         key: '2',
//         name: 'Semi Design 分享演示文稿',
//         nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
//         size: '2M',
//         owner: '郝宣',
//         updateTime: '2020-01-17 05:31',
//         avatarBg: 'red',
//     },
//     {
//         key: '3',
//         name: '设计文档',
//         nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
//         size: '34KB',
//         owner: 'Zoey Edwards',
//         updateTime: '2020-01-26 11:01',
//         avatarBg: 'light-blue',
//     },
// ];
const columns = [
    {
        title: '请求地址',
        dataIndex: 'url',
        render: (text: string, item: DevtoolsRequests) => <span>{JSON.stringify(item.request.url)}</span>,
    },
    {
        title: '请求方法',
        dataIndex: 'method',
        render: (text: string, item: DevtoolsRequests) => <span>{JSON.stringify(item.request.method)}</span>,
    },
    {
        title: '请求类型',
        dataIndex: '_resourceType',
    },
    {
        title: '优先级',
        dataIndex: '_priority',
    },
    {
        title: '等待时间',
        dataIndex: 'time',
        render: (text: number) => <span>{`${text.toFixed(0)}s`}</span>,
    },
];
export default DataTable;
