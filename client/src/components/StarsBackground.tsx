import React, { useRef, useEffect } from 'react';
import '../Home.css';

const StarsBackground: React.FC = () => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;
    const starsContainer = starsRef.current;
    starsContainer.innerHTML = '';
    const numberOfStars = 100;
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 4}s`;
      starsContainer.appendChild(star);
    }
  }, []);

  return <div ref={starsRef} className="stars" />;
};

export default StarsBackground; 