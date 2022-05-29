import { mockDataItem } from '../utils/type';

class NotificationsEvent {
    options = {
        url: '',
        max: 5, // 最大的提醒数量
    };
    static instance: NotificationsEvent;
    permission = '';
    constructor(options: any = {}) {
        this.options = options;
    }
    static getInstance(options: any = {}): NotificationsEvent {
        // 判断是否已经new过1个实例
        if (!NotificationsEvent.instance) {
            // 若这个唯一的实例不存在，那么先创建它
            NotificationsEvent.instance = new NotificationsEvent(options);
        }
        // 如果这个唯一的实例已经存在，则直接返回
        return NotificationsEvent.instance;
    }

    init(): void {
        console.log(this.options, '创建提醒', Notification.permission);
        if (this.permission !== 'granted') {
            Notification.requestPermission((permission) => {
                console.log(permission, '权限');
                this.permission = permission;
                this.createNotification();
            });
        }
    }

    createNotification(): void {
        const { options } = this;
        console.log(options, '创建提醒');
        const domain = options.url.match(/^(https?:\/\/)\S+\.cn|\.com$/g);
        const url = options.url.match(/(?<=^(https?:\/\/)\S+\.cn|\.com$)\S+/g);
        chrome.notifications.create(
            `${Math.random()}`,
            {
                type: 'basic',
                title: `提醒:${domain}`,
                iconUrl: '../icons/extension-icon-x32.png',
                message: `${url}-已被拦截代理`,
                contextMessage: 'mt插件启动',
            },
            (id) => {
                options.max -= options.max;
                console.log(id, '创建完成');
            },
        );
    }
}

export default NotificationsEvent;

/**
 * 检查当前item是否是开启拦截
 * @param item mockDataItem
 */
export const isNotifications = (item: mockDataItem): void => {
    if (item.switch) {
        const notification = NotificationsEvent.getInstance({ url: item.url });
        notification.init();
    }
};
