import React from 'react';
import { mockDataItem } from '../../../utils/type';

export interface ActionPanelProps {
    data: mockDataItem;
}
export const ActionPanel = React.memo((props: ActionPanelProps) => {
    const { data } = props;

    return <div>fff</div>;
});

export default ActionPanel;
