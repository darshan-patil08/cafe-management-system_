import { useEffect } from 'react';

export function useAnimatedCounters() {
  useEffect(() => {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach((counter, index) => {
      const target = parseInt(counter.dataset.target, 10) || 0;
      const suffix = counter.dataset.suffix || '';
      let current = 0;
      
      const step = target <= 15 ? 1 : Math.ceil(target / 40);
      
      const animateCounter = () => {
        current += step;
        if (current >= target) {
          current = target;
          counter.textContent = current + suffix;
          return;
        }
        counter.textContent = current + suffix;
        setTimeout(animateCounter, 30);
      };

      // Start ALL counters immediately (0ms delay)
      setTimeout(animateCounter, index * 100); // Very small stagger: 0ms, 100ms, 200ms
    });
  }, []);
}
