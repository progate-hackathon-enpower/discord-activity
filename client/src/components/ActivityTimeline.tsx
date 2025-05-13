import React, { useRef, useEffect, useState } from 'react';
import './ActivityTimeline.css';

export type Activity = {
  iconUrl: string;
  activityType: string;
  time: string;
  detail: string;
};

type Props = {
  activities: Activity[];
};

const minSize = 40;
const cardPadding = '20px 40px';
const itemHeight = 80;
const verticalMargin = 16;

const ActivityTimelineItem: React.FC<{
  activity: Activity;
  size: number;
  cardMinWidth: number;
  iconMargin: number;
}> = ({ activity, size, cardMinWidth, iconMargin }) => (
  <div className="timeline-item" style={{ margin: `${verticalMargin}px 0` }}>
    <div 
      className="timeline-icon" 
      style={{
        width: size, 
        height: size, 
        zIndex: 2, 
        marginRight: iconMargin
      }}
    >
      <img src={activity.iconUrl} alt="icon" />
    </div>
    <div 
      className="timeline-card" 
      style={{ 
        fontSize: 16, 
        minWidth: cardMinWidth, 
        padding: cardPadding 
      }}
    >
      <div className="timeline-type">{activity.activityType}</div>
      <div className="timeline-time">{activity.time}</div>
      <div className="timeline-detail">{activity.detail}</div>
    </div>
  </div>
);

const ActivityTimeline: React.FC<Props> = ({ activities }) => {
  const reversed = [...activities].reverse();
  const n = reversed.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        setContainerSize({
          width: windowWidth * 0.8,
          height: windowHeight * 0.8
        });
      }
    };
    window.addEventListener('resize', updateContainerSize);
    updateContainerSize();
    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

  // 各アイテムの幅・カード幅・アイコンmargin
  const getItemWidth = () => containerSize.width;
  const getCardMinWidth = () => containerSize.width * 0.6;
  const getIconMargin = () => containerSize.width * 0.05;

  return (
    <div
      className="timeline-container timeline-center"
      ref={containerRef}
      style={{
        position: 'relative',
        width: `${containerSize.width}px`,
        height: `${containerSize.height}px`,
        overflowY: 'auto',
        margin: '0 auto'
      }}
    >
      <div className="timeline-live-badge">LIVE</div>
      <div 
        className="timeline-list" 
        style={{
          width: getItemWidth(),
          margin: '0 auto'
        }}
      >
        {reversed.map((a, i) => (
          <ActivityTimelineItem
            key={i}
            activity={a}
            size={minSize}
            cardMinWidth={getCardMinWidth()}
            iconMargin={getIconMargin()}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline; 