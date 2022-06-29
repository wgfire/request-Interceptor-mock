import { useEffect, useRef } from 'react';

/** 2022年/5月/20日/星期五
*@reviewType.Perf
*@reviewContent 王港
1.依赖性更新就触发回调，忽略首次更新
*/

export const useUpdateEffect = (effect: () => void, deps: any[]) => {
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        effect();
    }, deps);
};
