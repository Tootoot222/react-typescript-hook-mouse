import { renderHook } from '@testing-library/react-hooks';
import useMouse, { isMouseEvent, eventListenerMouseEvent } from './useMouse';

/*
const events = {} as {
  [key in EventListenerMouseEvent]: MouseEventHandler;
};

let addEventListenerOriginal;
let removeEventListenerOriginal;
*/

describe('isMouseEvent function', () => {
  it('knows when a string is not a MouseEvent', () => {
    expect(isMouseEvent('blah blah')).toBe(false);
  });

  it('has the right number of assertions', () => {
    expect(Object.keys(eventListenerMouseEvent)).toHaveLength(3);
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
  /*
  beforeAll(() => {
    addEventListenerOriginal = window.addEventListener;
    removeEventListenerOriginal = window.removeEventListener;
    window.addEventListener = jest.fn((event: string, callback) => {
      if (event instanceof EventListenerMouseEvent) {
        events[event] = callback;
      }
    });
  })

  afterEach(() => {
  });

  afterAll(() => {
  });
  */

  it('returns null on the first run', () => {
    const { result } = renderHook(() => useMouse());
    expect(result.current).toBe(null);
  });
});
