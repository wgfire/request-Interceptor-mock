import './index.scss';

interface CopyButtonProps {
    onClick: () => void;
    style?: React.CSSProperties;
}
export const CopyButton: React.FC<CopyButtonProps> = (props: CopyButtonProps) => {
    const { onClick, style } = props;
    return (
        <div className="copy-button type3" onClick={onClick} style={style}>
            CopyToken
        </div>
    );
};
CopyButton.defaultProps = {
    style: {},
};
export default CopyButton;
