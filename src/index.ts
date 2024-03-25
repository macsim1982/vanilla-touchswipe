// Define the interface for the touch or mouse event
interface TouchMouseEvent extends MouseEvent {
    touches?: TouchList;
}

// Define the interface for the callbacks
interface Callbacks {
    start?: (event: TouchSwipeEvent) => void;
    move?: (event: TouchSwipeEvent) => void;
    left?: (event: TouchSwipeEvent) => void;
    right?: (event: TouchSwipeEvent) => void;
    up?: (event: TouchSwipeEvent) => void;
    down?: (event: TouchSwipeEvent) => void;
    end?: (event: TouchSwipeEvent) => void;
    cancel?: (event: TouchSwipeEvent) => void;
}

type TouchElement = HTMLElement | Element;
type Direction = 'left' | 'right' | 'up' | 'down' | 'none';
type Type = 'horizontal' | 'vertical' | 'none';

interface TouchOptions {
    min?: number,
    multiplicator?: number,
    callbacks?: Callbacks
}

interface TouchSwipeEvent {
    e: TouchMouseEvent,
    deltaX: number,
    deltaY: number,
    type: Type,
    direction: Direction
}

function touchOrMouseEvent(e: TouchMouseEvent): Touch | MouseEvent {
    return ('touches' in e && e.touches) ? e.touches[0] : e;
}

const DEFAULT_OPTIONS: TouchOptions = {
    min: 30,
    multiplicator: 2
}

export function onTouchSwipe($el: TouchElement, options: TouchOptions) {
    let startX = 0,
        startY = 0,
        deltaX = 0,
        deltaY = 0,
        type: Type = 'none',
        direction: Direction = 'none';

    let pressed = false;

    const {
        callbacks,
        min,
        multiplicator
    }: TouchOptions = {...DEFAULT_OPTIONS, ...options};

    function callback(eventName: keyof Callbacks, args?: any) {
        if (callbacks && callbacks[eventName]) {
            callbacks[eventName](args);
        }
    }

    function handleSwipe(dx: number, dy: number) {
        const absDeltaX = Math.abs(dx);
        const absDeltaY = Math.abs(dy);

        // Is swipe horizontal matching limits
        if (absDeltaX > min && absDeltaY < absDeltaX / multiplicator) {
            direction = dx > 0 ? 'right' : 'left';
            type = 'horizontal';
        }
        // Is swipe vertical matching limits
        else if (absDeltaY > min && absDeltaX < absDeltaY / multiplicator) {
            direction = dy > 0 ? 'down' : 'up';
            type = 'vertical';
        } else {
            direction = 'none';
            type = 'none';
        }
    }

    function getParams(e: TouchMouseEvent): TouchSwipeEvent {
        return {e, deltaX, deltaY, direction, type};
    }

    function startHandler(e: TouchMouseEvent) {
        const t = touchOrMouseEvent(e);
        startX = t.screenX;
        startY = t.screenY;
        pressed = true;

        callback.call(callbacks, "start", getParams(e));
    }

    function moveHandler(e: TouchMouseEvent) {
        if (!pressed) return;
        const t = touchOrMouseEvent(e);
        deltaX = t.screenX - startX;
        deltaY = t.screenY - startY;

        handleSwipe(deltaX, deltaY);

        callback.call(callbacks, "move", getParams(e));
    }

    function endHandler(e: TouchMouseEvent) {
        handleSwipe(deltaX, deltaY);

        callback.call(callbacks, type !== 'none' ? direction : 'end', getParams(e));

        pressed = false;
        startX = 0;
        startY = 0;
        deltaX = 0;
        deltaY = 0;
        type = 'none';
        direction = 'none';
    }

    function cancelHandler(e: TouchMouseEvent) {
        callback.call(callbacks, "cancel", getParams(e));
    }

    if ($el) {
        $el.addEventListener("touchstart", startHandler, true);
        $el.addEventListener("mousedown", startHandler, true);
        $el.addEventListener("touchmove", moveHandler, true);
        $el.addEventListener("mousemove", moveHandler, true);
        $el.addEventListener("touchcancel", cancelHandler, true);
        $el.addEventListener("mouseleave", endHandler, true);
        $el.addEventListener("touchend", endHandler, true);
        $el.addEventListener("mouseup", endHandler, true);
    }
}
