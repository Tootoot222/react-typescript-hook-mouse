import { renderHook, act } from '@testing-library/react-hooks';
import useMouse, {
  isMouseEvent,
  EventListenerMouseEvent,
  MouseEventHandler,
  mouseEvents,
} from './useMouse';

describe('isMouseEvent function', () => {
  it('knows when a string is not a MouseEvent', () => {
    expect(isMouseEvent('blah blah')).toBe(false);
  });

  it('properly decets mouse event names', () => {
    mouseEvents.forEach((event) => {
      expect(isMouseEvent(event)).toBe(true);
    });
  });

  it('knows when a string is a MouseEvent', () => {
    expect(isMouseEvent('mousedown')).toBe(true);
  });

  it('knows when a string is a mouseup MouseEvent', () => {
    expect(isMouseEvent('mouseup')).toBe(true);
  });

  it('knows when a string is a mousemove MouseEvent', () => {
    expect(isMouseEvent('mousemove')).toBe(true);
  });
});

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
});
