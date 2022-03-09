import { BaseXhr, hooksProps } from './baseXhr';
import { MockUrl } from './message';

//@ts-nocheck
interface configProps {
    url: string;
    data: any;
    header: any;
}
class ProxyXhr extends BaseXhr {
    static config: configProps = {
        url: '',
        header: {},
        data: {},
    }; // 当前请求的信息文件
    constructor(hooks: hooksProps) {
        super();
        if (this.instance) {
            return this.instance;
        }

        this.originXhr = window.XMLHttpRequest;
        this.hooks = hooks;
        this.instance = this;

        this.init();
    }
    /**
     * 重置config
     */
    resetConfig() {
        ProxyXhr.config = {
            url: '',
            header: {},
            data: {},
        };
    }

    /**
     * 重新监听
     */
    reset() {
        this.instance = null;
        this.instance = new ProxyXhr(this.hooks);
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
    }

    /**
     * 重写方法
     * @param {*} key
     */
    overwriteMethod(key: string, proxyXHR: any) {
        let hooks = this.hooks;
        proxyXHR[key] = (...args: any[]) => {
            // 拦截的方法
            if (hooks[key] && hooks[key].call(proxyXHR, args) === false) {
                return;
            }
            //console.log(key,'方法',args)

            // 执行方法本体
            const res = proxyXHR._xhr[key].apply(proxyXHR._xhr, args);

            // 方法本体执行后的钩子

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
            console.log(key, 'set属性'); // 用户设置的属性将会在此拦截
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
    setRequsetData(config: configProps, xhr: any) {
        // 主要利用config里的url 找寻 需要修改的请求对象 // 可修改请求数据 请求头
        console.log(config, xhr);
    }
    setResponseData(config: configProps, xhr: any) {
        // 修改返回的reponse数据
        
        const data = findUrlBuyMock(config);
      
        if (data && data.switch) {
            console.log(config, data,'找到修改的地方');
            xhr.responseText = data.response;
        }
        this.resetConfig()
    }
}
/**
 * 先执行open 随后触发onreadystatechange一次 最后 执行send
 */
const xhr = new ProxyXhr({
    send: function (body: any) {
        console.log(JSON.parse(body[0]), '数据data');
        ProxyXhr.config.data = JSON.parse(body[0]);
        xhr.setResponseData(ProxyXhr.config, this);
        // 修改请求信息
        return true;
    },
    open: function (data: any) {
        console.log(new Date().getTime(), '打开链接');
        const [, url] = data;
        ProxyXhr.config.url = url;
        // if (url === 'https://api-tools-test.mycaigou.com/tenant/tenant-list') {
        //     // this.responseText = {
        //     // //     data: {
        //     // //         bid_system_version_note: [
        //     // //             {
        //     // //                 erp_version: 'v4.0',
        //     // //                 version_name: '采招ERP4.0',
        //     // //             },
        //     // //             {
        //     // //                 erp_version: 'v3.5',
        //     // //                 version_name: '采招ERP3.5',
        //     // //             },
        //     // //             '…',
        //     // //         ],
        //     // //         list: [
        //     // //             {
        //     // //                 tenant_id: 'cz_60c022e3e01c2',
        //     // //                 tenant_code: 'cqdydc',
        //     // //                 portal_type: 'new',
        //     // //                 tenant_name: '重庆东原地产MOCK',
        //     // //                 bid_app_code: 'cgbid',
        //     // //                 bid_system_version: 'v3.5',
        //     // //                 bid_lease_start_time: '2021-06-08',
        //     // //                 bid_lease_end_time: '2021-07-08',
        //     // //                 bid_is_enable: '1',
        //     // //                 bid_isbuyout: '1',
        //     // //                 material_app_code: 'material',
        //     // //                 material_system_version: 'v3.5',
        //     // //                 material_lease_start_time: '2021-06-08',
        //     // //                 material_lease_end_time: '2021-07-08',
        //     // //                 material_is_enable: '0',
        //     // //                 material_isbuyout: '1',
        //     // //                 material_left_time: '已禁用',
        //     // //                 bid_left_time: '买断',
        //     // //                 address_url: 'https://home-test.myyscm.com/cqdydc',
        //     // //                 app_type: ['material', 'cgbid'],
        //     // //                 label_list: [
        //     // //                     {
        //     // //                         note_id: '201d7cee-c5aa-11eb-b960-6c92bf475505',
        //     // //                         note_name: '多租户(主)',
        //     // //                         tenant_id: 'cz_60c022e3e01c2',
        //     // //                     },
        //     // //                 ],
        //     // //                 cgbid_manager_info: null,
        //     // //                 material_manager_info: null,
        //     // //             },
        //     // //         ],
        //     // //         total: '365',
        //     // //     },
        //     // //     msg: '',
        //     // //     status: true,

        //     //  };

        // }
    },
    onreadystatechange: function () {
        if (this.readyState === 2) {
            // this.setRequestHeader('x-wg','x')
            console.log('等于2的时候', this.readyState, this.responseURL, this.response);
        }
        // this.response=JSON.stringify({"status":true,"msg":"登录成功","data":{"token":"3a027002-513e-46ba-eb54-b1172f3b0a76"}})
        // this.responseText=JSON.stringify({"status":true,"msg":"登录成功","data":{"token":"3a027002-513e-46ba-eb54-b1172f3b0a76"}})
        console.log('监听链接', new Date().getTime(), this.responseURL, this.readyState);
    },
    onload: function () {
        console.log('插件监听-获取完成');
    },
});
const findUrlBuyMock = (config: configProps) => {
    const index = MockUrl.findIndex((el) => {
        return el.url === config.url;
    });
    return index > -1 ? MockUrl[index] : false;
};
console.log(xhr, '替换的对象', xhr.getInstance());
