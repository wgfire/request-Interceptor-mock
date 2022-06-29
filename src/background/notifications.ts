import { mockDataItem } from '../utils/type';
let Max = 1;
console.log('notifications.ts', Max);
class NotificationsEvent {
    options = {
        url: '',
        title: '',
        message: '',
    };
    static instance: NotificationsEvent;
    permission = '';
    constructor() {}
    static getInstance(): NotificationsEvent {
        // 判断是否已经new过1个实例
        if (!NotificationsEvent.instance) {
            // 若这个唯一的实例不存在，那么先创建它
            NotificationsEvent.instance = new NotificationsEvent();
        }
        // 如果这个唯一的实例已经存在，则直接返回
        return NotificationsEvent.instance;
    }

    init(options: any): void {
        this.options = { ...this.options, ...options };
        console.log(this.options, '创建提醒', Notification.permission);
        if (this.permission !== 'granted') {
            Notification.requestPermission((permission) => {
                console.log(permission, '权限');
                this.permission = permission;
                this.createNotification();
            });
        } else {
            this.createNotification();
        }
    }

    createNotification(): void {
        const { options } = this;
        console.log(options, '创建提醒');
        const domain = options.url.match(/^(https?:\/\/)\S+(\.cn|\.com)/g);
        const url = options.url.match(/(?<=^(https?:\/\/)\S+(\.cn|\.com))\S+/g);
        Max > 0 &&
            chrome.notifications.create(
                `${Math.random()}`,
                {
                    type: 'basic',
                    title: options.title || `提醒:${domain ? domain[0] : ''}`,
                    iconUrl: '../icons/extension-icon-x32.png',
                    message: options.message || `${url ? url[0] : ''}-已被拦截代理`,
                    contextMessage: 'mt插件',
                },
                (id) => {
                    Max -= Max;
                    console.log(id, '创建完成');
                },
            );
    }
}

export default NotificationsEvent;
export type TypeNotification = 'Intercept' | 'error';
/**
 * 检查当前item是否是开启拦截
 * @param item mockDataItem
 */
export const isNotifications = (options: NotificationsEvent['options']): void => {
    const notification = NotificationsEvent.getInstance();
    notification.init(options);
};

export const resetMax = (max = 1): void => {
    Max = max;
};
