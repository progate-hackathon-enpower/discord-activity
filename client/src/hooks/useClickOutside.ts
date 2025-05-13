import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useClickOutside = (
    ref: RefObject<HTMLElement | null>,
    handler: (event: MouseEvent) => void
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler(event);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, handler]);
}; 