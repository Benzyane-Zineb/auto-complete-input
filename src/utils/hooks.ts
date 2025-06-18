import { RefObject, useEffect, useState } from "react";

export function useOnClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    callback: () => void,
    isOpen = true
  ): void {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent): void {
        if (ref.current && !ref.current.contains(event.target as Node) && isOpen) {
          callback();
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref, callback, isOpen]);
  }

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
  }
