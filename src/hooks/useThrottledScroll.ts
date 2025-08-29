import { useCallback, useRef } from 'react';

/**
 * Custom hook for throttled scroll handling
 * @param callback - The function to call when scroll events occur
 * @param delay - Minimum time between calls in milliseconds (default: 16ms for 60fps)
 * @returns Throttled scroll handler function
 */
export const useThrottledScroll = (
  callback: (e: React.UIEvent<HTMLDivElement>) => void, 
  delay: number = 16
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastRunRef = useRef(0);

  return useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const now = Date.now();
    
    if (lastRunRef.current && now - lastRunRef.current < delay) {
      // Clear existing timeout and set a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastRunRef.current = now;
        callback(e);
      }, delay - (now - lastRunRef.current));
    } else {
      // Execute immediately if enough time has passed
      lastRunRef.current = now;
      callback(e);
    }
  }, [callback, delay]);
};

/**
 * Alternative hook using requestAnimationFrame for smoother performance
 * @param callback - The function to call when scroll events occur
 * @returns RAF-based scroll handler function
 */
export const useRAFScroll = (
  callback: (e: React.UIEvent<HTMLDivElement>) => void
) => {
  const rafRef = useRef<number>();

  return useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      callback(e);
    });
  }, [callback]);
};
