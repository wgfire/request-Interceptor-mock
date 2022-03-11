/** 2022年/二月/16日/星期三
*@reviewType.Perf
*@reviewContent By Name
1.重写xhr请求支持修改响应头和请求头
*/
// @ts-nocheck

abstract class Xhr {
    private hooks: Object;
    abstract init(): void;
    /**
     * 添加勾子
     * @param {*} key
     * @param {*} value
     */
    add(key: string, value: any, execed: Boolean = false) {
        if (execed) {
            this.execedHooks[key] = value;
        } else {
            this.hooks[key] = value;
        }
        return this;
    }
    /**
     * 获取实例
     */
    getInstance() {
        return AnyXHR.instance;
    }

    /**
     * 删除钩子
     * @param {*} name
     */
    rmHook(name, isExeced = false) {
        let target = isExeced ? this.execedHooks : this.hooks;
        delete target[name];
    }

    /**
     * 清空钩子
     */
    clearHook() {
        this.hooks = {};
        this.execedHooks = {};
    }

    /**
     * 取消监听
     */
    unset() {
        window.XMLHttpRequest = this.XHR;
    }

    /**
     * 重新监听
     */
    reset() {
        AnyXHR.instance = null;
        AnyXHR.instance = new AnyXHR(this.hooks, this.execedHooks);
    }
}

class AnyXHR {
    /**
     * 构造函数
     * @param {*} hooks
     * @param {*} execedHooks
     */
    constructor(hooks: XMLHttpRequest, execedHooks = {}) {
        // 单例
        if (AnyXHR.instance) {
            return AnyXHR.instance;
        }

        this.originXhr = window.XMLHttpRequest;

        this.hooks = hooks;
        this.execedHooks = execedHooks;
        this.init();

        AnyXHR.instance = this;
    }

    /**
     * 初始化 重写xhr对象
     */
    init() {
        let _this = this;

        window.XMLHttpRequest = function () {
            this._xhr = new _this.originXhr();
            // 用户new XMLHttpRequest创建的为当前this，此时将这个this上的属性进行代理
            console.log(this, '用户的实例');
            _this.overwrite(this);
        };
    }

    /**
     * 处理重写
     * @param {*} xhr
     */
    overwrite(proxyXHR) {
        for (let key in proxyXHR._xhr) {
            if (typeof proxyXHR._xhr[key] === 'function') {
                this.overwriteMethod(key, proxyXHR);
                continue;
            }

            this.overwriteAttributes(key, proxyXHR);
        }
    }

    /**
     * 重写方法
     * @param {*} key
     */
    overwriteMethod(key, proxyXHR) {
        let hooks = this.hooks;
        let execedHooks = this.execedHooks;

        proxyXHR[key] = (...args) => {
            // 拦截的方法
            let hooksResult = false;
            // if (hooks[key]) {
            //   hooksResult = hooks[key].call(proxyXHR, args)
            //   debugger
            //   return;
            // }
            //console.log(key,'方法',args)

            // 执行方法本体
            const res = proxyXHR._xhr[key].apply(proxyXHR._xhr, args);

            // 方法本体执行后的钩子
            execedHooks[key] && execedHooks[key].call(proxyXHR._xhr, res);

            return res;
        };
    }

    /**
     * 重写属性
     * @param {*} key
     */
    overwriteAttributes(key, proxyXHR) {
        this.porxyOnHandel(key, proxyXHR);
        Object.defineProperty(proxyXHR, key, this.setProperyDescriptor(key, proxyXHR));
    }

    /**
     * 对_xhr为on开头的监听属性，赋值hooks下的代理函数
     * @param key
     * @param proxyXHR
     */
    porxyOnHandel(key, proxyXHR) {
        if (key.startsWith('on') && this.hooks[key]) {
            proxyXHR._xhr[key] = this.hooks[key].bind(proxyXHR);
        }
    }

    /**
     * 设置属性的属性描述,如果用户set了on开头的属性，也可以执行hooks下的监听函数
     * @param {*} key
     */
    setProperyDescriptor(key, proxyXHR) {
        let obj = Object.create(null);
        let _this = this;

        // 对用户设置的属性，挂载一份到自己的实例上
        obj.set = function (val) {
            console.log(key, 'set属性'); // 用户设置的属性将会在此拦截
            // 如果不是on打头的属性
            if (!key.startsWith('on')) {
                proxyXHR['__' + key] = val;
                return;
            }
            // on开头监听函数 是null ,这里将实例的函数执行变为用户的hooks里的同名函数
            if (_this.hooks[key]) {
                console.log('拦截on的监听函数');
                this._xhr[key] = function (...args) {
                    _this.hooks[key].call(proxyXHR); // 执行代理函数
                    val.apply(proxyXHR, args); // 执行用户set的函数
                };

                return;
            }
            // 其他的属性

            this._xhr[key] = val;
        };

        obj.get = function () {
            const result = proxyXHR['__' + key] || this._xhr[key];
            console.log(key, 'get属性', proxyXHR['__' + key], this._xhr[key]);
            // 此时用户访问这个对象上的其他属性通过拦截get 返回_xhr原生上的属性
            return result;
        };

        return obj;
    }

    /**
     * 获取实例
     */
    getInstance() {
        return AnyXHR.instance;
    }

    /**
     * 删除钩子
     * @param {*} name
     */
    rmHook(name, isExeced = false) {
        let target = isExeced ? this.execedHooks : this.hooks;
        delete target[name];
    }

    /**
     * 清空钩子
     */
    clearHook() {
        this.hooks = {};
        this.execedHooks = {};
    }

    /**
     * 取消监听
     */
    unset() {
        window.XMLHttpRequest = this.XHR;
    }

    /**
     * 重新监听
     */
    reset() {
        AnyXHR.instance = null;
        AnyXHR.instance = new AnyXHR(this.hooks, this.execedHooks);
    }
}

const xhr = new AnyXHR({
    send: function (body) {
        // console.log(JSON.parse(body[0]),'数据data'); 075502669887

        return false;
    },
    open: function (method) {
        console.log(method, 'method');
        if (method[1] === 'https://api-tools-test.mycaigou.com/tenant/tenant-list') {
            this.response = {
                data: {
                    bid_system_version_note: [
                        {
                            erp_version: 'v4.0',
                            version_name: '采招ERP4.0',
                        },
                        {
                            erp_version: 'v3.5',
                            version_name: '采招ERP3.5',
                        },
                        '…',
                    ],
                    list: [
                        {
                            tenant_id: 'cz_60c022e3e01c2',
                            tenant_code: 'cqdydc',
                            portal_type: 'new',
                            tenant_name: '重庆东原地产MOCK',
                            bid_app_code: 'cgbid',
                            bid_system_version: 'v3.5',
                            bid_lease_start_time: '2021-06-08',
                            bid_lease_end_time: '2021-07-08',
                            bid_is_enable: '1',
                            bid_isbuyout: '1',
                            material_app_code: 'material',
                            material_system_version: 'v3.5',
                            material_lease_start_time: '2021-06-08',
                            material_lease_end_time: '2021-07-08',
                            material_is_enable: '0',
                            material_isbuyout: '1',
                            material_left_time: '已禁用',
                            bid_left_time: '买断',
                            address_url: 'https://home-test.myyscm.com/cqdydc',
                            app_type: ['material', 'cgbid'],
                            label_list: [
                                {
                                    note_id: '201d7cee-c5aa-11eb-b960-6c92bf475505',
                                    note_name: '多租户(主)',
                                    tenant_id: 'cz_60c022e3e01c2',
                                },
                            ],
                            cgbid_manager_info: null,
                            material_manager_info: null,
                        },
                    ],
                    total: '365',
                },
                msg: '',
                status: true,
            };
            this.responseText = this.response;
        }
    },
    onreadystatechange: function (event) {
        // this.response=JSON.stringify({"status":true,"msg":"登录成功","data":{"token":"3a027002-513e-46ba-eb54-b1172f3b0a76"}})
        // this.responseText=JSON.stringify({"status":true,"msg":"登录成功","data":{"token":"3a027002-513e-46ba-eb54-b1172f3b0a76"}})

        console.log('插件监听-状态改变', this.response);
    },
    onload: function (event) {
        console.log('插件监听-获取完成');
    },
});

console.log(xhr, '替换的对象');
