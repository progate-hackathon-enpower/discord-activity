import React from 'react';

type Participant = {
  username: string;
  iconUrl: string;
  commit: number;
};

type ResultRankingProps = {
  participants: Participant[];
};

const crownEmojis = ['🥇', '🥈', '🥉'];
const TABBAR_WIDTH = 72; // タブバーの幅(px)

const ResultRanking: React.FC<ResultRankingProps> = ({ participants }) => {
  // commit数で降順ソート
  const sorted = [...participants].sort((a, b) => b.commit - a.commit);
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: 'clamp(8px, 2vw, 32px)',
      alignItems: 'flex-end',
      justifyContent: 'center',
      minWidth: 'min-content',
      marginLeft: TABBAR_WIDTH + 16, // タブバー分の余白
      transition: 'margin 0.2s',
    }}>
      {sorted.map((p, i) => (
        <div key={p.username} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: 'clamp(10px, 3vw, 24px) clamp(8px, 2vw, 20px)',
          minWidth: 'clamp(60px, 12vw, 120px)',
          minHeight: 'clamp(120px, 24vw, 220px)',
          boxShadow: 'none',
          transition: 'all 0.2s',
        }}>
          <span style={{ fontSize: 'clamp(16px, 2.5vw, 28px)', marginBottom: 'clamp(2px, 0.8vw, 10px)' }}>
            {i < 3 ? crownEmojis[i] : `${i + 1}位`}
          </span>
          <img 
            src={p.iconUrl} 
            alt={p.username} 
            style={{ 
              width: 'clamp(36px, 7vw, 72px)',
              height: 'clamp(36px, 7vw, 72px)',
              borderRadius: '50%',
              marginBottom: 'clamp(4px, 1vw, 12px)',
              objectFit: 'cover',
              background: '#fff',
              display: 'block',
              transition: 'all 0.2s',
            }} 
            onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/56x56?text=No+Img'; }}
          />
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 'clamp(11px, 1.5vw, 18px)', marginBottom: 'clamp(1px, 0.5vw, 6px)' }}>{p.username}</span>
          <span style={{ color: '#56D364', fontWeight: 'bold', fontSize: 'clamp(12px, 1.8vw, 20px)' }}>{p.commit}</span>
        </div>
      ))}
    </div>
  );
};

export default ResultRanking; 