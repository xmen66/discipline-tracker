import { useState, useEffect } from 'react';

export const useActiveProtocols = (baseValue: number = 142) => {
  const [activeCount, setActiveCount] = useState(baseValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
        const next = prev + change;
        // Keep it within a reasonable range
        if (next < baseValue - 20) return prev + 1;
        if (next > baseValue + 20) return prev - 1;
        return next;
      });
    }, 3000 + Math.random() * 2000); // Fluctuate every 3-5 seconds

    return () => clearInterval(interval);
  }, [baseValue]);

  return activeCount;
};
