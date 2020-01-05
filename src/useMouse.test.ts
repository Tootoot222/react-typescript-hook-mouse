import { renderHook, act } from '@testing-library/react-hooks';
import useMouse, {
  EventListenerMouseEvent,
  MouseEventHandler,
  MouseEvents,
} from './useMouse';

const eventListenerMouseEvent: MouseEvents = Object.freeze({
  mousedown: true,
  mouseup: true,
  mousemove: true,
  wheel: true,
});

const mouseEvents = Object.keys(eventListenerMouseEvent) as EventListenerMouseEvent[];

function isMouseEvent(event: string): event is EventListenerMouseEvent {
  return event in eventListenerMouseEvent;
}

describe('useMouse hook', () => {
  let events: {
    [key in EventListenerMouseEvent]: MouseEventHandler[];
  };

  let addEventListenerOriginal = document.addEventListener;
  let removeEventListenerOriginal = document.removeEventListener;

  beforeEach(() => {
    events = {
      mousedown: [],
      mouseup: [],
      mousemove: [],
      wheel: [],
    };
    addEventListenerOriginal = document.addEventListener;
    removeEventListenerOriginal = document.removeEventListener;
    document.addEventListener = jest.fn((event: string, callback) => {
      if (isMouseEvent(event)) {
        events[event].push(callback as MouseEventHandler);
      }
    });
    document.removeEventListener = jest.fn((event: string, callback) => {
      if (isMouseEvent(event)) {
        const idx = events[event].findIndex((handler) => handler === callback);
        if (idx >= 0) {
          events[event].splice(idx, 1);
        }
      }
    });

    mouseEvents.forEach((mouseEvent) => {
      expect(events[mouseEvent]).toHaveLength(0);
    });
  });

  afterEach(() => {
    document.addEventListener = addEventListenerOriginal;
    document.removeEventListener = removeEventListenerOriginal;
  });

  it('returns null on the first run', () => {
    const { result } = renderHook(() => useMouse());
    expect(result.current).toBe(null);
  });

  it('registers all event listeners by default', () => {
    mouseEvents.forEach((event) => {
      expect(events[event]).toHaveLength(0);
    });
    renderHook(() => useMouse());
    act(() => {
      mouseEvents.forEach((event) => {
        expect(events[event]).toHaveLength(1);
      });
    });
  });

  [
    {
      mousedown: false, mouseup: false, mousemove: false, wheel: false,
    },
    {
      mousedown: true, mouseup: false, mousemove: false, wheel: false,
    },
    {
      mousedown: false, mouseup: true, mousemove: false, wheel: false,
    },
    {
      mousedown: true, mouseup: true, mousemove: false, wheel: false,
    },
    {
      mousedown: false, mouseup: false, mousemove: true, wheel: false,
    },
    {
      mousedown: true, mouseup: false, mousemove: true, wheel: false,
    },
    {
      mousedown: false, mouseup: true, mousemove: true, wheel: false,
    },
    {
      mousedown: true, mouseup: true, mousemove: true, wheel: false,
    },
    {
      mousedown: false, mouseup: false, mousemove: false, wheel: true,
    },
    {
      mousedown: true, mouseup: false, mousemove: false, wheel: true,
    },
    {
      mousedown: false, mouseup: true, mousemove: false, wheel: true,
    },
    {
      mousedown: true, mouseup: true, mousemove: false, wheel: true,
    },
    {
      mousedown: false, mouseup: false, mousemove: true, wheel: true,
    },
    {
      mousedown: true, mouseup: false, mousemove: true, wheel: true,
    },
    {
      mousedown: false, mouseup: true, mousemove: true, wheel: true,
    },
    {
      mousedown: true, mouseup: true, mousemove: true, wheel: true,
    },
  ].forEach((requestedEvents) => {
    const names = Object.entries(requestedEvents)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(', ') || 'no';
    it(`registers and unregisters ${names} event listeners when explicitly configured`, () => {
      const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
        initialProps: requestedEvents,
      });

      act(() => {
        Object.entries(requestedEvents).forEach(([key, value]) => {
          expect(events[key as EventListenerMouseEvent]).toHaveLength(value ? 1 : 0);
        });
      });

      rerender(mouseEvents.reduce((ac, mouseEvent) => {
        const result = ac;
        result[mouseEvent] = false;
        return result;
      }, {} as Partial<MouseEvents>) as MouseEvents);

      act(() => {
        mouseEvents.forEach((mouseEvent) => {
          expect(events[mouseEvent]).toHaveLength(0);
        });
      });
    });
  });

  [
    {

    },
    {
      mousedown: true,
    },
    {
      mouseup: true,
    },
    {
      mousedown: true, mouseup: true,
    },
    {
      mousemove: true,
    },
    {
      mousedown: true, mousemove: true,
    },
    {
      mouseup: true, mousemove: true,
    },
    {
      mousedown: true, mouseup: true, mousemove: true,
    },
    {
      wheel: true,
    },
    {
      mousedown: true, wheel: true,
    },
    {
      mouseup: true, wheel: true,
    },
    {
      mousedown: true, mouseup: true, wheel: true,
    },
    {
      mousemove: true, wheel: true,
    },
    {
      mousedown: true, mousemove: true, wheel: true,
    },
    {
      mouseup: true, mousemove: true, wheel: true,
    },
    {
      mousedown: true, mouseup: true, mousemove: true, wheel: true,
    },
  ].forEach((requestedEvents) => {
    const names = Object.entries(requestedEvents)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(', ') || 'no';
    it(`registers and unregisters ${names} event listeners when implicitly configured`, () => {
      const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
        initialProps: requestedEvents,
      });

      act(() => {
        Object.entries(requestedEvents).forEach(([key, value]) => {
          expect(events[key as EventListenerMouseEvent]).toHaveLength(value ? 1 : 0);
        });
      });

      rerender(mouseEvents.reduce((ac, mouseEvent) => {
        const result = ac;
        result[mouseEvent] = false;
        return result;
      }, {} as Partial<MouseEvents>) as MouseEvents);

      act(() => {
        mouseEvents.forEach((mouseEvent) => {
          expect(events[mouseEvent]).toHaveLength(0);
        });
      });
    });
  });

  function basicMouseEventObjectFactory(overrides: Partial<MouseEvent> = {}): MouseEvent {
    return Object.assign(
      {
        clientX: 1,
        clientY: 2,
        x: 1,
        y: 2,
        pageX: 3,
        pageY: 4,
        screenX: 5,
        screenY: 6,
        movementX: 7,
        movementY: 8,
        buttons: 0,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        button: 0,
        offsetX: 0,
        offsetY: 0,
        relatedTarget: null,
      } as MouseEvent,
      overrides,
    );
  }

  function getNewUseMouseHookResult(
    eventHandlerList: MouseEventHandler[],
    hookSettings: Partial<MouseEvents>,
    factoryOverrides: Partial<MouseEvent> | Partial<WheelEvent> | undefined = undefined,
  ) {
    const mouseEvent = basicMouseEventObjectFactory(factoryOverrides);

    const { result } = renderHook(() => useMouse(hookSettings));

    act(() => {
      eventHandlerList.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current).not.toBeNull();

    return result;
  }

  it('returns the correct positive delta values from a wheel event', () => {
    const expectedMouseEvent = {
      deltaX: 11,
      deltaY: 22,
      deltaZ: 33,
    };
    const result = getNewUseMouseHookResult(
      events.wheel,
      { wheel: true },
      expectedMouseEvent,
    );

    expect(result.current?.wheel.deltaX).toBe(expectedMouseEvent.deltaX);
    expect(result.current?.wheel.left).toBe(false);
    expect(result.current?.wheel.right).toBe(true);
    expect(result.current?.wheel.deltaY).toBe(expectedMouseEvent.deltaY);
    expect(result.current?.wheel.up).toBe(false);
    expect(result.current?.wheel.down).toBe(true);
    expect(result.current?.wheel.deltaZ).toBe(expectedMouseEvent.deltaZ);
    expect(result.current?.wheel.out).toBe(false);
    expect(result.current?.wheel.in).toBe(true);
  });

  it('returns the correct negative delta values from a wheel event', () => {
    const expectedMouseEvent = {
      deltaX: -11,
      deltaY: -22,
      deltaZ: -33,
    };
    const result = getNewUseMouseHookResult(
      events.wheel,
      { wheel: true },
      expectedMouseEvent,
    );

    expect(result.current?.wheel.deltaX).toBe(expectedMouseEvent.deltaX);
    expect(result.current?.wheel.left).toBe(true);
    expect(result.current?.wheel.right).toBe(false);
    expect(result.current?.wheel.deltaY).toBe(expectedMouseEvent.deltaY);
    expect(result.current?.wheel.up).toBe(true);
    expect(result.current?.wheel.down).toBe(false);
    expect(result.current?.wheel.deltaZ).toBe(expectedMouseEvent.deltaZ);
    expect(result.current?.wheel.out).toBe(true);
    expect(result.current?.wheel.in).toBe(false);
  });

  it('returns the correct zero delta values from a wheel event', () => {
    const expectedMouseEvent = {
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0,
    };
    const result = getNewUseMouseHookResult(
      events.wheel,
      { wheel: true },
      expectedMouseEvent,
    );

    expect(result.current?.wheel.deltaX).toBe(expectedMouseEvent.deltaX);
    expect(result.current?.wheel.left).toBe(false);
    expect(result.current?.wheel.right).toBe(false);
    expect(result.current?.wheel.deltaY).toBe(expectedMouseEvent.deltaY);
    expect(result.current?.wheel.up).toBe(false);
    expect(result.current?.wheel.down).toBe(false);
    expect(result.current?.wheel.deltaZ).toBe(expectedMouseEvent.deltaZ);
    expect(result.current?.wheel.out).toBe(false);
    expect(result.current?.wheel.in).toBe(false);
  });

  it('returns the correct undefined delta values from a wheel event', () => {
    const expectedMouseEvent = {
    };
    const result = getNewUseMouseHookResult(
      events.wheel,
      { wheel: true },
      expectedMouseEvent,
    );

    expect(result.current?.wheel.deltaX).toBeUndefined();
    expect(result.current?.wheel.left).toBeUndefined();
    expect(result.current?.wheel.right).toBeUndefined();
    expect(result.current?.wheel.deltaY).toBeUndefined();
    expect(result.current?.wheel.up).toBeUndefined();
    expect(result.current?.wheel.down).toBeUndefined();
    expect(result.current?.wheel.deltaZ).toBeUndefined();
    expect(result.current?.wheel.out).toBeUndefined();
    expect(result.current?.wheel.in).toBeUndefined();
  });

  it('returns the correct defined deltaMode value from a wheel event', () => {
    const expectedMouseEvent = {
      deltaMode: 2,
    };
    const result = getNewUseMouseHookResult(
      events.wheel,
      { wheel: true },
      expectedMouseEvent,
    );

    expect(result.current?.wheel.deltaMode).toBe(expectedMouseEvent.deltaMode);
  });

  it('returns the correct undefined deltaMode value from a wheel event', () => {
    const expectedMouseEvent = {
    };
    const result = getNewUseMouseHookResult(
      events.wheel,
      { wheel: true },
      expectedMouseEvent,
    );

    expect(result.current?.wheel.deltaMode).toBeUndefined();
  });

  mouseEvents.forEach((mouseEventName) => {
    const hookSettings: Partial<MouseEvents> = {};
    hookSettings[mouseEventName] = true;

    it(`returns the correct positional values from a ${mouseEventName} event`, () => {
      const expectedMouseEvent = {
        clientX: 111,
        clientY: 222,
        pageX: 333,
        pageY: 444,
        screenX: 555,
        screenY: 666,
        movementX: 777,
        movementY: 888,
      };
      const result = getNewUseMouseHookResult(
        events[mouseEventName],
        hookSettings,
        expectedMouseEvent,
      );

      expect(result.current?.position.client.x).toBe(expectedMouseEvent.clientX);
      expect(result.current?.position.client.y).toBe(expectedMouseEvent.clientY);
      expect(result.current?.position.page.x).toBe(expectedMouseEvent.pageX);
      expect(result.current?.position.page.y).toBe(expectedMouseEvent.pageY);
      expect(result.current?.position.screen.x).toBe(expectedMouseEvent.screenX);
      expect(result.current?.position.screen.y).toBe(expectedMouseEvent.screenY);

      expect(result.current?.movement.x).toBe(expectedMouseEvent.movementX);
      expect(result.current?.movement.y).toBe(expectedMouseEvent.movementY);
    });

    [
      {
        left: false, right: false, middle: false,
      },
      {
        left: true, right: false, middle: false,
      },
      {
        left: false, right: true, middle: false,
      },
      {
        left: true, right: true, middle: false,
      },
      {
        left: false, right: false, middle: true,
      },
      {
        left: true, right: false, middle: true,
      },
      {
        left: false, right: true, middle: true,
      },
      {
        left: true, right: true, middle: true,
      },
    ].forEach((expectedButtons, currentButtonsValue) => {
      it(`returns the correct button values from a ${mouseEventName} event when buttons is ${currentButtonsValue}`, () => {
        const result = getNewUseMouseHookResult(events[mouseEventName], hookSettings, {
          buttons: currentButtonsValue,
        });

        expect(result.current?.buttons.left).toBe(expectedButtons.left);
        expect(result.current?.buttons.right).toBe(expectedButtons.right);
        expect(result.current?.buttons.middle).toBe(expectedButtons.middle);
      });
    });

    [
      {
        altKey: false, ctrlKey: false, metaKey: false, shiftKey: false,
      },
      {
        altKey: true, ctrlKey: false, metaKey: false, shiftKey: false,
      },
      {
        altKey: false, ctrlKey: true, metaKey: false, shiftKey: false,
      },
      {
        altKey: true, ctrlKey: true, metaKey: false, shiftKey: false,
      },
      {
        altKey: false, ctrlKey: false, metaKey: true, shiftKey: false,
      },
      {
        altKey: true, ctrlKey: false, metaKey: true, shiftKey: false,
      },
      {
        altKey: false, ctrlKey: true, metaKey: true, shiftKey: false,
      },
      {
        altKey: true, ctrlKey: true, metaKey: true, shiftKey: false,
      },
      {
        altKey: false, ctrlKey: false, metaKey: false, shiftKey: true,
      },
      {
        altKey: true, ctrlKey: false, metaKey: false, shiftKey: true,
      },
      {
        altKey: false, ctrlKey: true, metaKey: false, shiftKey: true,
      },
      {
        altKey: true, ctrlKey: true, metaKey: false, shiftKey: true,
      },
      {
        altKey: false, ctrlKey: false, metaKey: true, shiftKey: true,
      },
      {
        altKey: true, ctrlKey: false, metaKey: true, shiftKey: true,
      },
      {
        altKey: false, ctrlKey: true, metaKey: true, shiftKey: true,
      },
      {
        altKey: true, ctrlKey: true, metaKey: true, shiftKey: true,
      },
    ].forEach((expectedKeys) => {
      const keyNames = Object.entries(expectedKeys).filter(([, value]) => value)
        .map(([key]) => key)
        .join(', ') || 'no keys';
      it(`returns the correct keyboard values from a ${mouseEventName} event with ${keyNames} pressed`, () => {
        const result = getNewUseMouseHookResult(
          events[mouseEventName],
          hookSettings,
          expectedKeys,
        );

        expect(result.current?.keyboard.alt).toBe(expectedKeys.altKey);
        expect(result.current?.keyboard.ctrl).toBe(expectedKeys.ctrlKey);
        expect(result.current?.keyboard.meta).toBe(expectedKeys.metaKey);
        expect(result.current?.keyboard.shift).toBe(expectedKeys.shiftKey);
      });
    });
  });
});
