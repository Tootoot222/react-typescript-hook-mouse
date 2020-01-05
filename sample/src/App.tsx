import React from 'react';
import useMouse from 'react-typescript-hook-mouse';

const displayCoordinates = ({ x, y }: { x: number, y: number }) => `(${String(x)}, ${String(y)})`;

export default () => {
  const mouse = useMouse();

  if (!mouse) {
    return <span>Initializing...</span>;
  }

  return (
    <ul>
      <li>
        <span>Mouse position in viewport: </span>
        <span>{displayCoordinates(mouse.position.client)}</span>
      </li>
      <li>
        <span>Mouse position on page: </span>
        <span>{displayCoordinates(mouse.position.page)}</span>
      </li>
      <li>
        <span>Mouse position on screen: </span>
        <span>{displayCoordinates(mouse.position.screen)}</span>
      </li>
      <li>
        <span>Mouse movement: </span>
        <span>{displayCoordinates(mouse.movement)}</span>
      </li>
      <li>
        <span>Left button was pressed: </span>
        <span>{String(mouse.buttons.left)}</span>
      </li>
      <li>
        <span>Right button was pressed: </span>
        <span>{String(mouse.buttons.right)}</span>
      </li>
      <li>
        <span>Middle button was pressed: </span>
        <span>{String(mouse.buttons.middle)}</span>
      </li>
      <li>
        <span>Alt key was pressed: </span>
        <span>{String(mouse.keyboard.alt)}</span>
      </li>
      <li>
        <span>Ctrl key was pressed: </span>
        <span>{String(mouse.keyboard.ctrl)}</span>
      </li>
      <li>
        <span>Meta key was pressed: </span>
        <span>{String(mouse.keyboard.meta)}</span>
      </li>
      <li>
        <span>Shift key was pressed: </span>
        <span>{String(mouse.keyboard.shift)}</span>
      </li>
      <li>
        <span>Wheel delta X: </span>
        <span>{String(mouse.wheel.deltaX)}</span>
      </li>
      <li>
        <span>Wheel moved left: </span>
        <span>{String(mouse.wheel.left)}</span>
      </li>
      <li>
        <span>Wheel moved right: </span>
        <span>{String(mouse.wheel.right)}</span>
      </li>
      <li>
        <span>Wheel delta Y: </span>
        <span>{String(mouse.wheel.deltaY)}</span>
      </li>
      <li>
        <span>Wheel moved up: </span>
        <span>{String(mouse.wheel.up)}</span>
      </li>
      <li>
        <span>Wheel moved down: </span>
        <span>{String(mouse.wheel.down)}</span>
      </li>
      <li>
        <span>Wheel delta Z: </span>
        <span>{String(mouse.wheel.deltaZ)}</span>
      </li>
      <li>
        <span>Wheel moved out: </span>
        <span>{String(mouse.wheel.out)}</span>
      </li>
      <li>
        <span>Wheel moved in: </span>
        <span>{String(mouse.wheel.in)}</span>
      </li>
    </ul>
  );
};
