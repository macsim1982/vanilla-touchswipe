interface TouchMouseEvent extends MouseEvent {
    touches?: TouchList;
}
interface Callbacks {
    start?: () => void;
    move?: (distance: number) => void;
    left?: (event: TouchMouseEvent) => void;
    right?: (event: TouchMouseEvent) => void;
    up?: (event: TouchMouseEvent) => void;
    down?: (event: TouchMouseEvent) => void;
    end?: (distance: number) => void;
    cancel?: () => void;
}
type TouchElement = HTMLElement | Element;
interface TouchOptions {
    min?: number;
    multiplicator?: number;
    callbacks?: Callbacks;
}
export declare function onTouchSwipe($el: TouchElement, options: TouchOptions): void;
export {};
