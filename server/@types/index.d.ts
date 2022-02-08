type EventSourceEvent = Event & {
    data?: any;
    target: Record<string, any> | null;
};

declare interface Window {
    Mock: mockjs;
    mockData:any
}
