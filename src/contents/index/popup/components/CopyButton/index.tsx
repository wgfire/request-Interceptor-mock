import './index.scss';

export const CopyButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button className="button type3" onClick={onClick}>
            CopyToekn
        </button>
    );
};
