import { useState, useEffect } from 'react';

export const HeroBackground = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{
      position: 'relative',
      maxHeight: 'calc(55vh)',
      display: 'flex',
      alignItems: 'start',
      backgroundImage: isDark ? "url('/images/darkaktabg.svg')" : "url('/images/whiteaktabg.svg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden',
      marginTop: '0px'
    }}>
      {children}
    </div>
  );
};
