// import { useEffect } from 'react';
import { GhibliScreen } from './components/GhibliScreen/GhibliScreen';
import { useWakeLock } from './hooks/useWakeLock';

function App() {
  useWakeLock();

  return (
    <GhibliScreen />
  );
}

export default App;
