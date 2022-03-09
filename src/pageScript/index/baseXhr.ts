export interface hooksProps {
    [key: string]: any;
}
export class BaseXhr {
    public hooks: hooksProps = {};
    public instance: any;
    public originXhr = window.XMLHttpRequest;

    /**
     * 添加勾子
     * @param {*} key
     * @param {*} value
     */
    add(key: string, value: any) {
        this.hooks[key] = value;
        return this;
    }
    /**
     * 获取实例
     */
    getInstance() {
        return this.instance;
    }

    /**
     * 删除钩子
     * @param {*} name
     */
    rmHook(name: string) {
        let target = this.hooks;
        delete target[name];
    }

    /**
     * 清空钩子
     */
    clearHook() {
        this.hooks = {};
    }

    /**
     * 取消监听
     */
    unset() {
        window.XMLHttpRequest = this.originXhr;
    }

}
