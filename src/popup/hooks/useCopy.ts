/** 2022年/April/08日/Friday
*@reviewType.Perf
*@reviewContent 王港
1.复制内容到粘贴板hooks
*/
export interface CopyHooksProps {
    onSuccess?: (value: string) => void; // 复制成功后的回调
}

export const useCopy = (data: CopyHooksProps) => {
    const { onSuccess } = data;
    const copy = function (value: string) {
        // 动态创建 textarea 标签
        const textarea = document.createElement('textarea');
        // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
        textarea.readOnly = true;
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        // 将要 copy 的值赋给 textarea 标签的 value 属性
        textarea.value = value;
        // 将 textarea 插入到 body 中
        document.body.append(textarea);
        // 选中值并复制
        textarea.select();
        const result = document.execCommand('Copy');
        if (result) {
            textarea.remove();
            onSuccess && onSuccess(value);
        }
    };

    return copy;
};
