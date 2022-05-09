/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-this-alias */
import { globalDataProps } from './type';

export function injectCustomJs(jsPath = 'lib/mock.js'): Promise<any> {
    return new Promise((resolve) => {
        const temp = document.createElement('script');
        temp.setAttribute('type', 'text/javascript');
        // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
        temp.src = chrome.extension.getURL(jsPath);
        document.documentElement.append(temp);

        temp.addEventListener('load', () => {
            resolve(true);
            console.log('注入完成', Date.now());
            // console.log('注入完成',new Date().getTime())// 这里的window 和 页面上的window 除了document对象共享之外，其他变量不共享。
        });
    });
}

export function observerProxy(obj: Record<string, unknown>, onchange: (target: any) => void): any {
    const handler = {
        get(target: any, key: string, receiver: any) {
            console.log(`获取：${key}`);
            // 如果是对象，就递归添加 proxy 拦截
            if (typeof target[key] === 'object' && target[key] !== null) {
                return observerProxy(target[key], onchange);
            }
            return Reflect.get(target, key, receiver);
        },
        set(target: any, key: string, value: any, receiver: any) {
            console.log(`${key}-数据改变了`, value);
            onchange && onchange(target);
            return Reflect.set(target, key, value, receiver);
        },
    };
    return new Proxy(obj, handler);
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export function debounce(func: (...arg: any[]) => void, wait: number, immediate: boolean): (...arg: any[]) => void {
    let timeout: number | undefined;
    return (...args: []) => {
        // @ts-ignore
        // eslint-disable-next-line unicorn/no-this-assignment
        const context: any = this;
        // const args = [...arguments];
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            const callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = undefined;
            }, wait);
            if (callNow) func.apply(context, args);
        } else {
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        }
    };
}

export function postMockDataToScript(globalData: any, action = 'start') {
    window.postMessage({
        action,
        to: 'pageScript',
        globalData,
    });
}
export function localGetSync(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, (res) => {
                resolve(res[key]);
            });
        } catch {
            reject(new Error('localGetSync error'));
        }
    });
}
/**
 * @description 读取存储的数据
 * @returns Map
 */
export async function readStorageAll(): Promise<globalDataProps> {
    let localKey: globalDataProps = {
        mockData: [],
        config: { withCredentials: false, proxySwitch: true },
    };

    const data = await localGetSync('globalData');
    localKey = data || localKey;
    console.log('读取的本地数据', data || localKey);

    return localKey;
}
