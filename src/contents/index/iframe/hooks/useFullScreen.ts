export interface FullRequestProps {
    onSuccess?: () => void; 
}
export const domFullRequest = (data: FullRequestProps) => {
    const { onSuccess } = data;
    const openFull = (selector: string) => {
        try {
            const dom = document.querySelector(selector);
            dom!.requestFullscreen();
            onSuccess && onSuccess();
        } catch (error) {
            console.log(error);
        }
    };

    return openFull;
};
