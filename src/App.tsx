import { useEffect } from 'react';
import { GhibliScreen } from './components/GhibliScreen/GhibliScreen';
import { requestWakeLock } from './services/wakeLock';

function App() {
  useEffect(() => {
    // Request Wake Lock on mount
    const initWakeLock = async () => {
      await requestWakeLock();
    };

    initWakeLock();

    // Re-request on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        initWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <GhibliScreen />
  );
}

export default App;
