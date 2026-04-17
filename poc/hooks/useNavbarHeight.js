import { useEffect, useState } from 'react';

/**
 * Measures the actual rendered height of #main-navbar and keeps it in sync
 * on resize. Also sets --navbar-h as a CSS custom property on :root so
 * styled-jsx blocks can reference it via var(--navbar-h, 55px).
 */
const useNavbarHeight = () => {
  const [height, setHeight] = useState(55);

  useEffect(() => {
    const measure = () => {
      const el = document.getElementById('main-navbar');
      if (el) {
        const h = Math.ceil(el.getBoundingClientRect().height);
        setHeight(h);
        document.documentElement.style.setProperty('--navbar-h', h + 'px');
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return height;
};

export default useNavbarHeight;
