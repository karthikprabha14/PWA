import { useEffect, useState } from 'react';

export const useVisibilityChange = (): boolean => {
  const [isForeground, setIsForeground] = useState<boolean>(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsForeground(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isForeground;
};