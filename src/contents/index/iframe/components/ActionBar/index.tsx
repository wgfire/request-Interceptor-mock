/** 2022年/April/08日/Friday
*@reviewType.Perf
*@reviewContent 王港
1.用户对返回数据的操作按钮
*/
import './index.scss';
import { CopyOutlined } from '@ant-design/icons';
export interface ActionBarProps {
    onclick: (type: string) => void;
}
export const ActionBar: React.FC<ActionBarProps> = (data: ActionBarProps) => {
    const { onclick } = data;
    return (
        <div className="action-bar">
            <CopyOutlined
                onClick={() => {
                    onclick('copy');
                }}
            ></CopyOutlined>
        </div>
    );
};
