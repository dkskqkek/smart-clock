
import { useState, useEffect, useCallback, useRef } from 'react';

export const useWakeLock = () => {
    const [released, setReleased] = useState<boolean | undefined>(undefined);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const requestWakeLock = useCallback(async () => {
        // Try-catch for older browsers or if feature is missing
        if (!('wakeLock' in navigator)) {
            console.warn('Wake Lock API not supported.');
            return;
        }

        try {
            // If already active, don't request again
            if (wakeLockRef.current && !wakeLockRef.current.released) {
                return;
            }

            const sentinel = await navigator.wakeLock.request('screen');
            wakeLockRef.current = sentinel;
            setReleased(false);
            console.log('Wake Lock is active!');

            // Re-activate if released automatically (e.g. minimizing window)
            sentinel.addEventListener('release', () => {
                console.log('Wake Lock released.');
                setReleased(true);
                wakeLockRef.current = null;
            });

        } catch (err) {
            console.error('Wake Lock request failed:', err);
            // If denied (e.g. no gesture), we leave 'released' as true/undefined
            // so we can try again on next interaction
        }
    }, []);

    const releaseWakeLock = useCallback(async () => {
        if (wakeLockRef.current) {
            await wakeLockRef.current.release();
            wakeLockRef.current = null;
            setReleased(true);
        }
    }, []);

    useEffect(() => {
        // 1. Try on mount (might fail without gesture)
        requestWakeLock();

        // 2. Re-request when tab becomes visible again
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                requestWakeLock();
            }
        };

        // 3. Re-request on any user click/touch (golden path for policy blocked requests)
        const handleUserInteraction = () => {
            requestWakeLock();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('touchstart', handleUserInteraction);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('touchstart', handleUserInteraction);
            releaseWakeLock();
        };
    }, [requestWakeLock, releaseWakeLock]);

    return { requestWakeLock, releaseWakeLock, isLocked: !released };
};
