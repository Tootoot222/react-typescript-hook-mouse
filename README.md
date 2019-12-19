# react-typescript-hook-mouse :mouse:

A React hook to access data from mouse events. Now with typescript types!

## Installation

Using `npm`:

```sh
npm install --save react-typescript-hook-mouse
```

Using `yarn`:

```sh
yarn add react-typescript-hook-mouse
```

## Usage

```jsx
import React from 'react';
import useMouse from 'react-typescript-hook-mouse';

const displayCoordinates = ({x, y}) => `${x} : ${y}`;

const displayFlag = (flag) => flag ? 'Yes' : 'No';

const ComponentWithMouse = () => {
  const mouse = useMouse();

  return (
    <ul>
      <li>
        Mouse position in viewport:
        {displayCoordinates(mouse.position.client)}
      </li>
      <li>
        Mouse position on page:
        {displayCoordinates(mouse.position.page)}
      </li>
      <li>
        Mouse position on screen:
        {displayCoordinates(mouse.position.screen)}
      </li>
      <li>
        Mouse movement:
        {displayCoordinates(mouse.movement)}
      </li>
      <li>
        Left button was pressed:
        {displayFlag(mouse.buttons.left)}
      </li>
      <li>
        Right button was pressed:
        {displayFlag(mouse.buttons.right)}
      </li>
      <li>
        Middle button was pressed:
        {displayFlag(mouse.buttons.middle)}
      </li>
      <li>
        Alt key was pressed:
        {displayFlag(mouse.keyboard.alt)}
      </li>
      <li>
        Ctrl key was pressed:
        {displayFlag(mouse.keyboard.ctrl)}
      </li>
      <li>
        Meta key was pressed:
        {displayFlag(mouse.keyboard.meta)}
      </li>
      <li>
        Shift key was pressed:
        {displayFlag(mouse.keyboard.shift)}
      </li>
    </ul>
  );
};
```

### Configuration of watched events

You can specify which events you want to watch. By default, the hook watches mousedown, mouseup, and mousemove, but this behavior can be changed by passing a configuration object:
```jsx
  // Use defaults
  const mouseAllEvents = useMouse();
  
  // Exactly the same as above
  const mouseAllEventsExplicit = useMouse({
    mousedown: true,
    mouseup: true,
    mousemove: true,
  });

  // Only watch for click events, don't watch movements
  const mouseButtonEvents = useMouse({
    mousedown: true,
    mouseup: true,
    mousemove: false,
  });

  // Dynamically register the movement listener based on the input boolean value
  const mouseEventsDynamic = useMouse({
    mousedown: true,
    mouseup: true,
    mousemove: someVariableMaybeFromAnotherHook,
  });
```

The hook is smart enough to dynamically change the registrations to only watch for the events you want, so you can update the values in the configuration object at runtime and it will react to alter the event listeners.

## Caveats

Data in `mouse.keyboard` is always read from a `MouseEvent` and therefore it will only get updated on mouse events, not when the keys are actually pressed on the keyboard.

## Contributions

Contributions are welcome. File bug reports, create pull requests, feel free to reach out at tothab@gmail.com.

## Licence

LGPL-3.0
