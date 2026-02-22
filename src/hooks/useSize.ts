import { useEffect, useRef, useState } from 'react';

export interface Size {
  w: number;
  h: number;
}

/**
 * Tracks the rendered size of a DOM element via ResizeObserver.
 * Returns `{ w: 0, h: 0 }` until the element mounts.
 */
export function useSize(ref: React.RefObject<HTMLElement>): Size {
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}
