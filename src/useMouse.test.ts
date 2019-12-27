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

  it('registers all the default event listeners', () => {
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

  /*

  0000 = 0 -> {
    mousedown: true,
    mouseup: true,
    mousemove: true,
    wheel: true,
  },
  0001 = 1 -> {
    mousedown: false,
    mouseup: true,
    mousemove: true,
    wheel: true,
  },
  0010 = 2 -> {
    mousedown: true,
    mouseup: false,
    mousemove: true,
    wheel: true,
  },
  0011 = 3 -> {
    mousedown: false,
    mouseup: false,
    mousemove: true,
    wheel: true,
  },
  1000 = 8 -> {
    mousedown: true,
    mouseup: true,
    mousemove: true,
    wheel: false,
  },
  ...
  1111 = 15 -> {
    mousedown: false,
    mouseup: false,
    mousemove: false,
    wheel: false,
  }
  */

  Array.from(Array((2 ** mouseEvents.length) * 2).keys()).forEach((iterNum) => {
    const requestedEvents = mouseEvents.reduce((ac, mouseEvent, idx) => {
      const result = ac;
      // eslint-disable-next-line no-bitwise
      result[mouseEvent] = (iterNum & (1 << idx)) === 0;
      return result;
    }, {} as Partial<MouseEvents>) as MouseEvents;

    const names = Object.entries(requestedEvents).map(([key, value]) => (value ? key : null))
      .filter((name) => !!name)
      .join(', ') || 'no';
    it(`registers and unregisters ${names} event listeners when configured`, () => {
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
    /*
    it('registers and unregisters a mousedown and mouseup and mousemove event when configured', () => {
      const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
        mouseEvents.reduce((ac, mouseEvent, idx) => {
          ac[mouseEvent] = iterNum & idx;
          return ac;
        }, {} as Partial<MouseEvents>) as MouseEvents;
        initialProps: {
          mousedown: true,
          mouseup: true,
          mousemove: true,
        },
      });

      act(() => {
        expect(events.mousedown).toHaveLength(1);
        expect(events.mouseup).toHaveLength(1);
        expect(events.mousemove).toHaveLength(1);
      });

      rerender({
        mousedown: false,
        mouseup: false,
        mousemove: false,
      });

      act(() => {
        mouseEvents.forEach((mouseEvent) => {
          expect(events[mouseEvent]).toHaveLength(0);
        });
      });
    });
    */
  });

  /*
  it('registers and unregisters a mousedown and mouseup and mousemove event when configured', () => {
    expect(events.mousedown).toHaveLength(0);
    expect(events.mouseup).toHaveLength(0);
    expect(events.mousemove).toHaveLength(0);

    const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
      initialProps: {
        mousedown: true,
        mouseup: true,
        mousemove: true,
      },
    });

    act(() => {
      expect(events.mousedown).toHaveLength(1);
      expect(events.mouseup).toHaveLength(1);
      expect(events.mousemove).toHaveLength(1);
    });

    rerender({
      mousedown: false,
      mouseup: false,
      mousemove: false,
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(0);
    });
  });

  it('registers and unregisters a mousedown and mouseup event when configured', () => {
    expect(events.mousedown).toHaveLength(0);
    expect(events.mouseup).toHaveLength(0);
    expect(events.mousemove).toHaveLength(0);

    const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
      initialProps: {
        mousedown: true,
        mouseup: true,
        mousemove: false,
      },
    });

    act(() => {
      expect(events.mousedown).toHaveLength(1);
      expect(events.mouseup).toHaveLength(1);
      expect(events.mousemove).toHaveLength(0);
    });

    rerender({
      mousedown: false,
      mouseup: false,
      mousemove: false,
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(0);
    });
  });

  it('registers and unregisters a mousedown and mouseup event when configured implicitly', () => {
    expect(events.mousedown).toHaveLength(0);
    expect(events.mouseup).toHaveLength(0);
    expect(events.mousemove).toHaveLength(0);

    const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
      initialProps: {
        mousedown: true,
        mouseup: true,
        mousemove: false,
      },
    });

    act(() => {
      expect(events.mousedown).toHaveLength(1);
      expect(events.mouseup).toHaveLength(1);
      expect(events.mousemove).toHaveLength(0);
    });

    rerender({
      mousedown: false,
      mouseup: false,
      mousemove: false,
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(0);
    });
  });

  it('registers and unregisters a mousedown and mousemove event when configured', () => {
    expect(events.mousedown).toHaveLength(0);
    expect(events.mouseup).toHaveLength(0);
    expect(events.mousemove).toHaveLength(0);

    const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
      initialProps: {
        mousedown: true,
        mouseup: false,
        mousemove: true,
      },
    });

    act(() => {
      expect(events.mousedown).toHaveLength(1);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(1);
    });

    rerender({
      mousedown: false,
      mouseup: false,
      mousemove: false,
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(0);
    });
  });

  it('registers and unregisters a mouseup and mousemove event when configured', () => {
    expect(events.mousedown).toHaveLength(0);
    expect(events.mouseup).toHaveLength(0);
    expect(events.mousemove).toHaveLength(0);

    const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
      initialProps: {
        mousedown: false,
        mouseup: true,
        mousemove: true,
      },
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(1);
      expect(events.mousemove).toHaveLength(1);
    });

    rerender({
      mousedown: false,
      mouseup: false,
      mousemove: false,
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(0);
    });
  });

  it('registers and unregisters a mousedown event when configured', () => {
    expect(events.mousedown).toHaveLength(0);
    expect(events.mouseup).toHaveLength(0);
    expect(events.mousemove).toHaveLength(0);

    const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
      initialProps: {
        mousedown: true,
        mouseup: false,
        mousemove: false,
      },
    });

    act(() => {
      expect(events.mousedown).toHaveLength(1);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(0);
    });

    rerender({
      mousedown: false,
      mouseup: false,
      mousemove: false,
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(0);
    });
  });

  it('registers and unregisters a mouseup event when configured', () => {
    expect(events.mousedown).toHaveLength(0);
    expect(events.mouseup).toHaveLength(0);
    expect(events.mousemove).toHaveLength(0);

    const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
      initialProps: {
        mousedown: false,
        mouseup: true,
        mousemove: false,
      },
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(1);
      expect(events.mousemove).toHaveLength(0);
    });

    rerender({
      mousedown: false,
      mouseup: false,
      mousemove: false,
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(0);
    });
  });

  it('registers and unregisters a mousemove event when configured', () => {
    expect(events.mousedown).toHaveLength(0);
    expect(events.mouseup).toHaveLength(0);
    expect(events.mousemove).toHaveLength(0);

    const { rerender } = renderHook((eventListeners) => useMouse(eventListeners), {
      initialProps: {
        mousedown: false,
        mouseup: false,
        mousemove: true,
      },
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(1);
    });

    rerender({
      mousedown: false,
      mouseup: false,
      mousemove: false,
    });

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(0);
    });
  });

  it('registers and unregisters no events when configured', () => {
    expect(events.mousedown).toHaveLength(0);
    expect(events.mouseup).toHaveLength(0);
    expect(events.mousemove).toHaveLength(0);

    renderHook(() => useMouse({
      mousedown: false,
      mouseup: false,
      mousemove: false,
    }));

    act(() => {
      expect(events.mousedown).toHaveLength(0);
      expect(events.mouseup).toHaveLength(0);
      expect(events.mousemove).toHaveLength(0);
    });
  });

  it('returns the correct values from a mousedown MouseEvent', () => {
    const mouseEvent = {
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
    };

    const { result } = renderHook(() => useMouse({
      mousedown: true,
      mouseup: false,
      mousemove: false,
    }));

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current).not.toBeNull();
    expect(result.current?.position.client.x).toBe(mouseEvent.clientX);
    expect(result.current?.position.client.y).toBe(mouseEvent.clientY);
    expect(result.current?.position.page.x).toBe(mouseEvent.pageX);
    expect(result.current?.position.page.y).toBe(mouseEvent.pageY);
    expect(result.current?.position.screen.x).toBe(mouseEvent.screenX);
    expect(result.current?.position.screen.y).toBe(mouseEvent.screenY);

    expect(result.current?.movement.x).toBe(mouseEvent.movementX);
    expect(result.current?.movement.y).toBe(mouseEvent.movementY);

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(false);

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.buttons = 1;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(false);

    mouseEvent.buttons = 2;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(false);

    mouseEvent.buttons = 3;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(false);

    mouseEvent.buttons = 4;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.buttons = 5;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.buttons = 6;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.buttons = 7;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.altKey = true;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(true);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.altKey = false;
    mouseEvent.ctrlKey = true;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(true);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.ctrlKey = false;
    mouseEvent.metaKey = true;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(true);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.metaKey = false;
    mouseEvent.shiftKey = true;

    act(() => {
      events.mousedown.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(true);

    mouseEvent.shiftKey = false;
  });

  it('returns the correct values from a mouseup MouseEvent', () => {
    const mouseEvent = {
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
    };

    const { result } = renderHook(() => useMouse({
      mousedown: false,
      mouseup: true,
      mousemove: false,
    }));

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current).not.toBeNull();
    expect(result.current?.position.client.x).toBe(mouseEvent.clientX);
    expect(result.current?.position.client.y).toBe(mouseEvent.clientY);
    expect(result.current?.position.page.x).toBe(mouseEvent.pageX);
    expect(result.current?.position.page.y).toBe(mouseEvent.pageY);
    expect(result.current?.position.screen.x).toBe(mouseEvent.screenX);
    expect(result.current?.position.screen.y).toBe(mouseEvent.screenY);

    expect(result.current?.movement.x).toBe(mouseEvent.movementX);
    expect(result.current?.movement.y).toBe(mouseEvent.movementY);

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(false);

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.buttons = 1;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(false);

    mouseEvent.buttons = 2;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(false);

    mouseEvent.buttons = 3;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(false);

    mouseEvent.buttons = 4;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.buttons = 5;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.buttons = 6;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.buttons = 7;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.altKey = true;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(true);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.altKey = false;
    mouseEvent.ctrlKey = true;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(true);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.ctrlKey = false;
    mouseEvent.metaKey = true;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(true);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.metaKey = false;
    mouseEvent.shiftKey = true;

    act(() => {
      events.mouseup.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(true);

    mouseEvent.shiftKey = false;
  });

  it('returns the correct values from a mousemove MouseEvent', () => {
    const mouseEvent = {
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
    };

    const { result } = renderHook(() => useMouse({
      mousedown: false,
      mouseup: false,
      mousemove: true,
    }));

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current).not.toBeNull();
    expect(result.current?.position.client.x).toBe(mouseEvent.clientX);
    expect(result.current?.position.client.y).toBe(mouseEvent.clientY);
    expect(result.current?.position.page.x).toBe(mouseEvent.pageX);
    expect(result.current?.position.page.y).toBe(mouseEvent.pageY);
    expect(result.current?.position.screen.x).toBe(mouseEvent.screenX);
    expect(result.current?.position.screen.y).toBe(mouseEvent.screenY);

    expect(result.current?.movement.x).toBe(mouseEvent.movementX);
    expect(result.current?.movement.y).toBe(mouseEvent.movementY);

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(false);

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.buttons = 1;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(false);

    mouseEvent.buttons = 2;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(false);

    mouseEvent.buttons = 3;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(false);

    mouseEvent.buttons = 4;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.buttons = 5;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(false);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.buttons = 6;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(false);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.buttons = 7;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.buttons.left).toBe(true);
    expect(result.current?.buttons.right).toBe(true);
    expect(result.current?.buttons.middle).toBe(true);

    mouseEvent.altKey = true;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(true);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.altKey = false;
    mouseEvent.ctrlKey = true;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(true);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.ctrlKey = false;
    mouseEvent.metaKey = true;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(true);
    expect(result.current?.keyboard.shift).toBe(false);

    mouseEvent.metaKey = false;
    mouseEvent.shiftKey = true;

    act(() => {
      events.mousemove.forEach((callback) => {
        callback(mouseEvent as MouseEvent);
      });
    });

    expect(result.current?.keyboard.alt).toBe(false);
    expect(result.current?.keyboard.ctrl).toBe(false);
    expect(result.current?.keyboard.meta).toBe(false);
    expect(result.current?.keyboard.shift).toBe(true);

    mouseEvent.shiftKey = false;
  });
  */
});
