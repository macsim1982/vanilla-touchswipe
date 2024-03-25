type TouchElement = HTMLElement | Element;
type Direction = 'left' | 'right' | 'up' | 'down' | 'none';
type Type = 'horizontal' | 'vertical' | 'none';
type Callbacks = {
    [K in 'start' | 'move' | 'left' | 'right' | 'up' | 'down' | 'end' | 'cancel']?: (event: TouchSwipeEvent) => void;
}

interface TouchMouseEvent extends MouseEvent {
    touches?: TouchList;
}

interface TouchOptions {
    min?: number,
    multiplicator?: number,
    callbacks?: Callbacks
}

interface TouchSwipeEvent {
    nativeEvent: TouchMouseEvent,
    deltaX: number,
    deltaY: number,
    type: Type,
    direction: Direction
}

function touchOrMouseEvent(e: TouchMouseEvent): Touch | MouseEvent {
    return ('touches' in e && e.touches) ? e.touches[0] : e;
}

export function onTouchSwipe($el: TouchElement, options: TouchOptions) {
    const {
        callbacks,
        min = 30,
        multiplicator = 0.5
    } = options;

    let startX = 0, startY = 0, deltaX = 0, deltaY = 0;
    let type: Type = 'none', direction: Direction = 'none';
    let pressed = false;

    function triggerCallback(eventName: keyof Callbacks, event: TouchMouseEvent) {
        const swipeData = { nativeEvent: event, deltaX, deltaY, direction, type };
        callbacks?.[eventName]?.(swipeData);
    };

    function isSwipe(dx: number, dy: number) {
        const absDeltaX = Math.abs(dx);
        const absDeltaY = Math.abs(dy);

        if (absDeltaX > min && absDeltaY < absDeltaX * multiplicator) {
            direction = dx > 0 ? 'right' : 'left';
            type = 'horizontal';
        }
        else if (absDeltaY > min && absDeltaX < absDeltaY * multiplicator) {
            direction = dy > 0 ? 'down' : 'up';
            type = 'vertical';
        } else {
            direction = type = 'none';
        }
    }

    function startHandler(e: TouchMouseEvent) {
        const t = touchOrMouseEvent(e);
        startX = t.screenX;
        startY = t.screenY;
        pressed = true;

        triggerCallback("start", e);
    }

    function moveHandler(e: TouchMouseEvent) {
        if (!pressed) return;
        const t = touchOrMouseEvent(e);
        deltaX = t.screenX - startX;
        deltaY = t.screenY - startY;

        isSwipe(deltaX, deltaY);
        triggerCallback("move", e);
    }

    function endHandler(e: TouchMouseEvent) {
        isSwipe(deltaX, deltaY);
        triggerCallback(direction !== 'none' ? direction : "end", e);

        pressed = false;
        startX = startY = deltaX = deltaY = 0;
        type = direction = 'none';
    }

    function cancelHandler(e: TouchMouseEvent) {
        triggerCallback("cancel", e);
    }

    if ($el) {
        $el.addEventListener("touchstart", startHandler, { passive: true });
        $el.addEventListener("mousedown", startHandler);
        $el.addEventListener("touchmove", moveHandler, { passive: true });
        $el.addEventListener("mousemove", moveHandler);
        $el.addEventListener("touchcancel", cancelHandler, { passive: true });
        $el.addEventListener("mouseleave", endHandler);
        $el.addEventListener("touchend", endHandler, { passive: true });
        $el.addEventListener("mouseup", endHandler);
    }

    function unbind() {
        $el.removeEventListener("touchstart", startHandler);
        $el.removeEventListener("mousedown", startHandler);
        $el.removeEventListener("touchmove", moveHandler);
        $el.removeEventListener("mousemove", moveHandler);
        $el.removeEventListener("touchcancel", cancelHandler);
        $el.removeEventListener("mouseleave", endHandler);
        $el.removeEventListener("touchend", endHandler);
        $el.removeEventListener("mouseup", endHandler);
    }

    return { unbind };
}
