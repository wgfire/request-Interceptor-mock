/** 2022年/April/08日/Friday
*@reviewType.Perf
*@reviewContent 王港
1.用户对返回数据的操作按钮
*/
import './index.scss';
import { IconExpand, IconSourceControl } from '@douyinfe/semi-icons';
export interface ActionBarProps {
    onclick: (type: string) => void;
    name: string;
}
export const ActionBar: React.FC<ActionBarProps> = (data: ActionBarProps) => {
    const { name, onclick } = data;
    return (
        <div className="action-bar">
            <span>{name}</span>
            <IconExpand
                className="action-bar_icon"
                title="放大"
                onClick={() => {
                    onclick('expand');
                }}
            />
            <IconSourceControl
                className="action-bar_icon"
                title="切换数据"
                onClick={() => {
                    onclick('change');
                }}
            />
        </div>
    );
};
