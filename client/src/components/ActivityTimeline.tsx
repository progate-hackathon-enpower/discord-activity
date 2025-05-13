import React, { useRef, useEffect, useState } from 'react';
import './ActivityTimeline.css';

const greens = ['#56D364', '#2DA042', '#196C2E', '#023A16'];

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
const maxSize = 40;
const cardPadding = '20px 40px';
const itemHeight = 80;
const verticalMargin = 16; // 要素間の縦マージン

// タイムラインアイテムのコンポーネント
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
        background: '#56D364', 
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

  // 軌道線用: 各アイコンの中心座標を計算
  const getItemWidth = () => containerSize.width;
  const getCardMinWidth = () => containerSize.width * 0.6;
  const getIconMargin = () => containerSize.width * 0.05;
  const iconPositions = reversed.map((_, i) => {
    const size = minSize;
    // margin分も加味してy座標を計算
    const y = i * (itemHeight + verticalMargin * 2) + itemHeight / 2 + verticalMargin;
    const x = getItemWidth()/2 - getCardMinWidth()/2 - getIconMargin() + size/2;
    return { y, size, x };
  });
  // SVGの高さもmargin分を加味
  const svgHeight = iconPositions.length > 0 ? iconPositions[iconPositions.length-1].y + minSize/2 + verticalMargin : 100;

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