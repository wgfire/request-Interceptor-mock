export interface hooksProps {
    [key: string]: any;
}
export class BaseXhr {
    public hooks: hooksProps = {};
    public afterHooks: hooksProps = {}; // 执行完hooks后的一些回调
    public instance: any;
    public originXhr = window.XMLHttpRequest;
    reqListData: Array<any> = [];
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
    /**
     * 初始化 重写xhr对象
     */
    init() {
        let _this = this;
        //@ts-ignore
        window.XMLHttpRequest = function () {
            //@ts-ignore
            this._xhr = new _this.originXhr();
            // 用户new XMLHttpRequest创建的为当前this，此时将这个this上的属性进行代理
            console.log(this, '用户的实例');
            //@ts-ignore
            _this.overwrite(this);
        };
    }
    /**
     * 处理重写
     * @param {*} xhr
     */
    overwrite(proxyXHR: any) {
        for (let key in proxyXHR._xhr) {
            if (typeof proxyXHR._xhr[key] === 'function') {
                this.overwriteMethod(key, proxyXHR);
                continue;
            }

            this.overwriteAttributes(key, proxyXHR);
        }
        //@ts-ignore 默认开启携带cookie不然有些网站会报错
        proxyXHR._xhr.withCredentials = true;
    }

    /**
     * 重写方法
     * @param {*} key
     */
    overwriteMethod(key: string, proxyXHR: any) {
        let hooks = this.hooks;
        let originResult = null;
        proxyXHR[key] = (...args: any[]) => {
            // 拦截的方法
            let hooksResult: boolean | any[] = false;
            originResult = args;
            if (hooks[key]) {
                hooksResult = hooks[key].call(proxyXHR, args);
                if (hooksResult === false) return false;
            }
            if (key == 'send') {
                args = [hooksResult];
                proxyXHR['__originSendData'] = originResult[0]; // 原生的发送data的参数
                proxyXHR['__realitySendData'] = args[0]; // 实际发送的参数
            }
            //console.log(key,'方法',args)
            // 执行方法本体
            const res = proxyXHR._xhr[key].apply(proxyXHR._xhr, args);
            // 执行回调

            // if(this.afterHooks[key]) {
            // this.afterHooks[key].call(proxyXHR, originResult,args);
            // }

            return res;
        };
    }

    /**
     * 重写属性
     * @param {*} key
     */
    overwriteAttributes(key: string, proxyXHR: any) {
        this.porxyOnHandel(key, proxyXHR);
        Object.defineProperty(proxyXHR, key, this.setProperyDescriptor(key, proxyXHR));
    }

    /**
     * 对_xhr为on开头的监听属性，赋值hooks下的代理函数
     * @param key
     * @param proxyXHR
     */
    porxyOnHandel(key: string, proxyXHR: any) {
        if (key.startsWith('on') && this.hooks[key]) {
            proxyXHR._xhr[key] = this.hooks[key].bind(proxyXHR);
        }
    }

    /**
     * 设置属性的属性描述,如果用户set了on开头的属性，也可以执行hooks下的监听函数
     * @param {*} key
     */
    setProperyDescriptor(key: string, proxyXHR: any) {
        let obj = Object.create(null);
        let _this = this;

        // 对用户设置的属性，挂载一份到自己的实例上
        obj.set = function (val: any) {
            //   console.log(key, 'set属性', val); // 用户设置的属性将会在此拦截
            // 如果不是on打头的属性
            if (!key.startsWith('on')) {
                proxyXHR['__' + key] = val;
                return;
            }
            // on开头监听函数 是null ,这里将实例的函数执行变为用户的hooks里的同名函数
            if (_this.hooks[key]) {
                console.log('拦截on的监听函数');
                this._xhr[key] = function (...args: any[]) {
                    _this.hooks[key].call(proxyXHR); // 执行代理函数
                    val.apply(proxyXHR, args); // 执行用户set的函数
                };

                return;
            }
            // 其他的属性
            console.log('设置了属性', key, val);
            this._xhr[key] = val;
        };

        obj.get = function () {
            const result = proxyXHR['__' + key] || this._xhr[key];
            // console.log(key, 'get属性', proxyXHR['__' + key], this._xhr[key]);
            // 此时用户访问这个对象上的其他属性通过拦截get 返回_xhr原生上的属性
            return result;
        };

        return obj;
    }
}
