import './index.scss';

export const CopyButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <div className="copy-button type3" onClick={onClick}>
            CopyToken
        </div>
    );
};
