/** 2022年/5月/07日/星期六
*@reviewType.Perf
*@reviewContent By Name
1.创建便签的一些方法
*/

/**
 * @description
 * 创建高亮div
 */
export const createHighlightDiv = (rect: DOMRect, id: string, callback?: () => void) => {
    const scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = `${rect.left + scrollLeft}px`;
    div.style.top = `${rect.top + scrollTop}px`;
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;
    div.style.backgroundColor = 'rgb(91 192 222 / 60%)';
    div.style.boxShadow = '0px 0px 3px 1px #2299dd38';
    div.style.zIndex = '9999';
    div.style.cursor = 'pointer';
    div.id = id;
    document.body.appendChild(div);
    callback && callback();
    return div;
};

export const removeHighlightDiv = (id: string, callback?: () => void) => {
    const div = document.getElementById(id);
    if (div) {
        document.body.removeChild(div);
        callback && callback();
    }
};
