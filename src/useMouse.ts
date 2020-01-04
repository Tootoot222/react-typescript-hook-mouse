import { useEffect, useState } from 'react';

export interface MouseCoordinate2D {
  x: number,
  y: number,
}

export interface MousePosition {
  client: MouseCoordinate2D,
  page: MouseCoordinate2D,
  screen: MouseCoordinate2D,
}

export interface MouseButtons {
  left: boolean,
  right: boolean,
  middle: boolean,
}

export interface MouseModifierKeys {
  alt: boolean,
  ctrl: boolean,
  meta: boolean,
  shift: boolean,
}

export interface MouseState {
  position: MousePosition,
  movement: MouseCoordinate2D,
  buttons: MouseButtons,
  keyboard: MouseModifierKeys,
}

export interface MouseEvents {
  mousedown: boolean,
  mouseup: boolean,
  mousemove: boolean,
  wheel: boolean,
}

const eventListenerMouseEvent: MouseEvents = Object.freeze({
  mousedown: true,
  mouseup: true,
  mousemove: true,
  wheel: true,
});

const mouseEventHandlerFactory = (setMouse: (m: MouseState) => void) => ((event: MouseEvent) => {
  setMouse({
    position: {
      client: { x: event.clientX, y: event.clientY },
      page: { x: event.pageX, y: event.pageY },
      screen: { x: event.screenX, y: event.screenY },
    },
    movement: { x: event.movementX, y: event.movementY },
    buttons: {
      left: [1, 3, 5, 7].includes(event.buttons),
      right: [2, 3, 6, 7].includes(event.buttons),
      middle: [4, 5, 6, 7].includes(event.buttons),
    },
    keyboard: {
      alt: event.altKey,
      ctrl: event.ctrlKey,
      meta: event.metaKey,
      shift: event.shiftKey,
    },
  });
});

const mouseEvents = Object.keys(eventListenerMouseEvent) as EventListenerMouseEvent[];

export type EventListenerMouseEvent = keyof typeof eventListenerMouseEvent;

export type MouseEventHandler = (event: MouseEvent) => void;

type MouseEventRegistractionAction = 'addEventListener' | 'removeEventListener';

const doMouseEventListener = (
  action: MouseEventRegistractionAction,
  eventListeners: MouseEvents,
  event: EventListenerMouseEvent,
  handler: MouseEventHandler,
) => {
  if (!eventListeners[event]) {
    return;
  }

  document[action](event, handler as EventListener);
};

const registerMouseEventListener = (
  eventListeners: MouseEvents,
  event: EventListenerMouseEvent,
  handler: MouseEventHandler,
) => doMouseEventListener('addEventListener', eventListeners, event, handler);

const unregisterMouseEventListener = (
  eventListeners: MouseEvents,
  event: EventListenerMouseEvent,
  handler: MouseEventHandler,
) => doMouseEventListener('removeEventListener', eventListeners, event, handler);

export default (eventListenerOptions: Partial<MouseEvents> = {
  mousedown: true,
  mouseup: true,
  mousemove: true,
  wheel: true,
}): MouseState | null => {
  const [mouse, setMouse] = useState<MouseState | null>(null);

  useEffect(() => {
    const eventListeners = mouseEvents.reduce((ac, mouseEvent) => {
      const result = ac;
      result[mouseEvent] = !!eventListenerOptions[mouseEvent];
      return result;
    }, {} as Partial<MouseEvents>) as MouseEvents;

    const handleMouseEvent = mouseEventHandlerFactory(setMouse);
    mouseEvents.forEach((mouseEvent) => (
      registerMouseEventListener(eventListeners, mouseEvent, handleMouseEvent)));

    return () => {
      mouseEvents.forEach((mouseEvent) => (
        unregisterMouseEventListener(eventListeners, mouseEvent, handleMouseEvent)));
    };
  }, [...mouseEvents.map((mouseEvent) => !!eventListenerOptions[mouseEvent])]);

  return mouse;
};
