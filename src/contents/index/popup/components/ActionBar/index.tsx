/** 2022年/April/08日/Friday
*@reviewType.Perf
*@reviewContent 王港
1.用户对返回数据的操作按钮
*/
import './index.scss';
import { CopyTwoTone, ExpandOutlined } from '@ant-design/icons';
export interface ActionBarProps {
    onclick: (type: string) => void;
    name: string;
}
export const ActionBar: React.FC<ActionBarProps> = (data: ActionBarProps) => {
    const { name, onclick } = data;
    return (
        <div className="action-bar">
            <span>{name}</span>
            <CopyTwoTone
                color="#0090f5"
                title="复制"
                onClick={() => {
                    onclick('copy');
                }}
            ></CopyTwoTone>
            <ExpandOutlined
                style={{ color: '#0090f5' }}
                title="放大"
                onClick={() => {
                    onclick('expand');
                }}
            />
        </div>
    );
};
