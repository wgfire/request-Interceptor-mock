/** 2022年/5月/06日/星期五
*@reviewType.Perf
*@reviewContent By Name
1.由于需要高亮显示之前的文本，所以需要对content下dom进行操作，导致不能用iframe来做交互界面
*/

/**note功能:
 * @description:
 * 1.在content下创建一个dom做交互界面。
 * 2.自定义右键菜单，点击后将选中的文字添加到交互界面上，支持一个网站添加多个便签。
 * 3.点击便签可以快速找到网址，并且高亮显示之前选中的元素。
 * 4.支持删除便签
 */
interface NoteProps {
    textContent: string;
    clientRect: any;
}
interface NoteData {
    item: NoteProps;
    url: string;
}
const data: NoteData[] = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'note') {
        clickHandel();
    }
});

function clickHandel() {
    const selection = window.getSelection();
    const textContent = selection?.toString() as string;
    const rang = selection?.getRangeAt(0); // range对象
    const clientRect = rang?.getBoundingClientRect(); // 坐标信息
    const item: NoteData = {
        item: { textContent: textContent, clientRect: clientRect },
        url: window.location.href,
    };
    data.push(item);
    console.log(data);
}
function start() {
    // 创建界面 接受之前的便签数据
    // 创建右键菜单，监听右键菜单点击事件
    // 必须有选中的元素才行（需要文本内容和坐标信息）

    try {
    } catch (error) {
        console.log(error);
    }
}

start();
