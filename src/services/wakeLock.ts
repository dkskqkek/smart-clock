export const requestWakeLock = async (): Promise<WakeLockSentinel | null> => {
    if ('wakeLock' in navigator) {
        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock is active!');
            return wakeLock;
        } catch (err) {
            const error = err as Error;
            console.error(`${error.name}, ${error.message}`);
            return null;
        }
    } else {
        console.warn('Wake Lock API not supported.');
        return null;
    }
};
