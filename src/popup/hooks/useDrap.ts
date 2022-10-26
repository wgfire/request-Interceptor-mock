import { useEffect, useRef } from 'react';

export interface UseDrapProps {
    el: string | HTMLElement;
    onmouseDown?: () => void;
    onmouseMove?: (screen: Screen) => void;
}
export type Screen = {
    x: number;
    y: number;
};

export const useDrap = (props: UseDrapProps) => {
    const { el, onmouseDown, onmouseMove } = props;
    const element = useRef<Element | null>(null);
    const dragStatus = useRef(false);
    const screen = useRef<Screen>({ x: 0, y: 0 });

    const addEvent = (event: string, callback: (e: Event) => void) => {
        if (!element.current) throw new Error(`${el} 元素未找到`);
        element.current.addEventListener(event, callback);
    };
    const removeEvent = (event: string, callback: (e: Event) => void) => {
        element.current?.removeEventListener(event, callback);
    };

    const onmousedown = (e: Event) => {
        dragStatus.current = false;
        console.log(e, '按下', dragStatus.current);
        addEvent('mousemove', onmousemove);
        onmouseDown && onmouseDown();
    };
    const onmousemove = (e: Event) => {
        const event = e as MouseEvent;
        dragStatus.current = true;
        screen.current.x = event.screenX;
        screen.current.y = event.screenY;
        onmouseMove && onmouseMove(screen.current);
    };

    const onmouseup = (e: Event) => {
        screen.current.x = 0;
        screen.current.y = 0;
        removeEvent('mousemove', onmousemove);
    };

    useEffect(() => {
        element.current = typeof el === 'string' ? document.querySelector(el) : el;
        addEvent('mousedown', onmousedown);
        addEvent('mouseup', onmouseup);
        return () => {
            removeEvent('mousedown', onmousedown);
            removeEvent('mousemove', onmousemove);
            removeEvent('mouseup', onmouseup);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { dragStatus, screen };
};
