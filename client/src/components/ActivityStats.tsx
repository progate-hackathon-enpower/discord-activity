import React, { useState, useEffect, useRef } from 'react';
import './ActivityStats.css';
import { useClickOutside } from '../hooks/useClickOutside';

interface ActivityStatsProps {
  startTime: Date;
  totalContributions: number;
}

const ActivityStats: React.FC<ActivityStatsProps> = ({ startTime, totalContributions }) => {
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useClickOutside(statsRef, () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  });

  return (
    <div 
      ref={statsRef}
      className={`activity-stats ${isExpanded ? 'expanded' : 'compact'}`}
      onClick={() => setIsExpanded(true)}
    >
      <div className="stats-content">
        <div className="timer">
          <h3>経過時間</h3>
          <div className="time-display">{elapsedTime}</div>
        </div>
        <div className="contributions">
          <h3>総Contribution数</h3>
          <div className="contribution-count">{totalContributions}</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats; 