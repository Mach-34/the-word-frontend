import { useEffect } from 'react';

// eslint-disable-next-line
export function useOutsideAlerter(ref: any, callback: any): void {
    /**
     * Alert if clicked on outside of element
     */
    // eslint-disable-next-line
    function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
            callback(false);
        }
    }

    useEffect(() => {
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });
}