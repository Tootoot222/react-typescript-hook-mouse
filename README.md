# react-typescript-hook-mouse :mouse:

[![https://nodei.co/npm/react-typescript-hook-mouse.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/react-typescript-hook-mouse.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/react-typescript-hook-mouse)

A React hook to access data from mouse events. Now with typescript types!

[![npm version](https://badge.fury.io/js/react-typescript-hook-mouse.svg)](https://badge.fury.io/js/react-typescript-hook-mouse) [![Build Status](https://travis-ci.org/Tootoot222/react-typescript-hook-mouse.png?branch=master)](https://travis-ci.org/Tootoot222/react-typescript-hook-mouse) [![Maintainability](https://api.codeclimate.com/v1/badges/06e8585ed51f0cf7a45d/maintainability)](https://codeclimate.com/github/Tootoot222/react-typescript-hook-mouse/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/06e8585ed51f0cf7a45d/test_coverage)](https://codeclimate.com/github/Tootoot222/react-typescript-hook-mouse/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/Tootoot222/react-typescript-hook-mouse/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Tootoot222/react-typescript-hook-mouse?targetFile=package.json) [![dependencies](https://david-dm.org/Tootoot222/react-typescript-hook-mouse.svg)](https://david-dm.org/Tootoot222/react-typescript-hook-mouse) [![devDependencies](https://david-dm.org/Tootoot222/react-typescript-hook-mouse/dev-status.svg)](https://david-dm.org/Tootoot222/react-typescript-hook-mouse?type=dev) [![code style](https://img.shields.io/badge/code%20style-Airbnb-brightgreen?logo=airbnb)](https://github.com/iamturns/eslint-config-airbnb-typescript) [![HitCount](http://hits.dwyl.io/Tootoot222/react-typescript-hook-mouse.svg)](http://hits.dwyl.io/Tootoot222/react-typescript-hook-mouse)


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

```

### Configuration of watched events

You can specify which events you want to watch. By default, the hook watches all the events it knows about (mousedown, mouseup, mousemove, and wheel), but this behavior can be changed by passing a configuration object:
```jsx
  // Use defaults
  const mouseAllEvents = useMouse();
  
  // Exactly the same as above
  const mouseAllEventsExplicit = useMouse({
    mousedown: true,
    mouseup: true,
    mousemove: true,
    wheel: true,
  });

  // Only watch for click events, don't watch movements or wheel events
  const mouseButtonEvents = useMouse({
    mousedown: true,
    mouseup: true,
    mousemove: false,
    wheel: false,
  });

  // Exactly the same as the above
  // -- event names not given are assumed to be false
  const mouseButtonEvents = useMouse({
    mousedown: true,
    mouseup: true,
  });

  // Dynamically register the movement listener based on the input boolean value
  // Does not watch the wheel event
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

Based from the react-hook-mouse package by Bence A. Toth <tothab@gmail.com>.

Contributions are welcome. File bug reports, create pull requests, feel free to reach out on the project github page, or via email.

## Licence

LGPL-3.0
