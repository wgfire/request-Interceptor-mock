import { BaseXhr, hooksProps } from './baseXhr';
import { MockUrl } from './message';

//@ts-nocheck
interface configProps {
    url: string;
    data: any;
    header: any;
}
interface reqListItem {
    url: string;
    status: 200;
    request: {
        data: any;
    };
    response: {
        data: any;
    };
}
class ProxyXhr extends BaseXhr {
    static config: configProps = {
        url: '',
        header: {},
        data: {},
    }; // 当前请求的信息文件
    reqListData: reqListItem[] = [];
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

    setRequestHeader(header: any[], xhr: any) {
        header.forEach((el) => {
           const key = Object.keys(el);
           xhr.setRequestHeader(key[0], el[key[0]]);
        });
    }
    setRequsetData(config: configProps, xhr: any) {
        // 主要利用config里的url 找寻 需要修改的请求对象 // 可修改请求数据 请求头
        const data = findUrlBuyMock(config);
        if (data && data.switch) {
            const { request } = data;
            request.headers.length > 0 && this.setRequestHeader(request.headers, xhr);
            xhr.timeout = request.timeout;
            console.log(xhr, '设置了超时时间');
        }
    }
    setResponseData(config: configProps, xhr: any) {
        // 修改返回的reponse数据

        const data = findUrlBuyMock(config);

        if (data && data.switch) {
            console.log(config, data, '找到修改的地方');
            xhr.responseText = data.response;
        }
        this.resetConfig();
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
       
    },
    onreadystatechange: function () {
        if (this.readyState === 1) {
            // this.setRequestHeader('x-wg','x')
            xhr.setRequsetData(ProxyXhr.config, this); // 等于1的时候修改请求信息
            console.log('等于1的时候', this);
        }
        console.log('监听链接', new Date().getTime(), this.responseURL, this.readyState);
    },
    onload: function (event: any) {
        console.log('插件监听-获取完成', event);
    },
    onerror: function (event: any) {
        console.log('插件监听-错误', event);
    },
});
const findUrlBuyMock = (config: configProps) => {
    const index = MockUrl.findIndex((el) => {
        return el.url === config.url;
    });
    return index > -1 ? MockUrl[index] : false;
};
console.log(xhr, '替换的对象', xhr.getInstance());
