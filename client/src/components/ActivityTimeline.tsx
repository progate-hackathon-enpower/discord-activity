import React, { useRef, useEffect, useState } from 'react';
import './ActivityTimeline.css';

// (Line removed)

export type Activity = {
  user_id: string;
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
const verticalMargin = 16; // 要素間の縦マージン

// タイムラインアイテムのコンポーネント
const ActivityTimelineItem: React.FC<{
  activity: Activity;
  size: number;
  cardMinWidth: number;
  iconMargin: number;
  index: number;
  totalItems: number;
  isCenter: boolean;
}> = ({ activity, size, cardMinWidth, iconMargin, index, totalItems, isCenter }) => {
  // 中央の要素を大きく、それ以外は小さくする
  const scale = isCenter ? 1 : 0.8;
  const opacity = isCenter ? 1 : 0.7;
  const fontSize = 16 * scale;

  return (
    <div 
      className="timeline-item" 
      style={{ 
        margin: `${verticalMargin}px 0`,
        transform: `scale(${scale})`,
        opacity: opacity,
        transformOrigin: 'center bottom',
        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
      }}
    >
      <div 
        className="timeline-icon" 
        style={{
          width: size * scale, 
          height: size * scale, 
          zIndex: 2, 
          marginRight: iconMargin * scale
        }}
      >
        <img src={activity.iconUrl} alt="icon" />
      </div>
      <div 
        className="timeline-card" 
        style={{ 
          background: '#56D364', 
          fontSize: fontSize, 
          minWidth: cardMinWidth * scale, 
          padding: cardPadding 
        }}
      >
        <div className="timeline-type">{activity.activityType}</div>
        <div className="timeline-time">{activity.time}</div>
        <div className="timeline-detail">{activity.detail}</div>
      </div>
    </div>
  );
};

const ActivityTimeline: React.FC<Props> = ({ activities }) => {
  const reversed = [...activities].reverse();
  const n = reversed.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [centerIndex, setCenterIndex] = useState<number>(0);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      // 各アイテムの位置を計算
      const items = container.getElementsByClassName('timeline-item');
      let closestIndex = 0;
      let minDistance = Infinity;

      Array.from(items).forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - containerCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setCenterIndex(closestIndex);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // 初期位置でも中央の要素を計算
      container.scrollTop = container.scrollHeight;
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
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
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '100px' // 下部にマージンを追加
      }}
    >
      <div 
        className="timeline-list" 
        style={{
          width: getItemWidth(),
          margin: '0 auto',
          paddingTop: '20vh',
          paddingBottom: '20vh'
        }}
      >
        {reversed.map((a, i) => (
          <ActivityTimelineItem
            key={i}
            activity={a}
            size={minSize}
            cardMinWidth={getCardMinWidth()}
            iconMargin={getIconMargin()}
            index={i}
            totalItems={n}
            isCenter={i === centerIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline; 