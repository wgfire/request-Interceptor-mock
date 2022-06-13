type EventSourceEvent = Event & {
    data?: any;
    target: Record<string, any> | null;
};

declare interface Window {
    Mock: mockjs;
    mockData: any;
    XMLHttpRequest: XMLHttpRequest;
}
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
