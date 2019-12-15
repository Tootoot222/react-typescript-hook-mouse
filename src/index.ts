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

export default (): MouseState | null => {
  const [mouse, setMouse] = useState<MouseState | null>(null);

  useEffect(() => {
    const handleMouseEvent = (event: MouseEvent) => {
      const {
        altKey,
        clientX,
        clientY,
        ctrlKey,
        metaKey,
        movementX,
        movementY,
        screenX,
        screenY,
        pageX,
        pageY,
        shiftKey,
        buttons,
      } = event;

      setMouse({
        position: {
          client: { x: clientX, y: clientY } as MouseCoordinate2D,
          page: { x: pageX, y: pageY } as MouseCoordinate2D,
          screen: { x: screenX, y: screenY } as MouseCoordinate2D,
        },
        movement: { x: movementX, y: movementY } as MouseCoordinate2D,
        buttons: {
          left: [1, 3, 5, 7].includes(buttons),
          right: [2, 3, 6, 7].includes(buttons),
          middle: [4, 5, 6, 7].includes(buttons),
        } as MouseButtons,
        keyboard: {
          alt: altKey,
          ctrl: ctrlKey,
          meta: metaKey,
          shift: shiftKey,
        } as MouseModifierKeys,
      } as MouseState);
    };
    document.addEventListener('mousedown', handleMouseEvent);
    document.addEventListener('mousemove', handleMouseEvent);
    document.addEventListener('mouseup', handleMouseEvent);

    return () => {
      document.removeEventListener('mousedown', handleMouseEvent);
      document.removeEventListener('mousemove', handleMouseEvent);
      document.removeEventListener('mouseup', handleMouseEvent);
    };
  }, []);

  return mouse;
};
