import { renderHook } from '@testing-library/react-hooks';
import useMouse from './useMouse';

describe('useMouse hook', () => {
  it('returns null on the first run', () => {
    const { result } = renderHook(() => useMouse());
    expect(result.current).toBe(null);
  });
});
