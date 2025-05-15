import React from 'react';

type Participant = {
  username: string;
  iconUrl: string;
  commit: number;
};

type ResultRankingProps = {
  participants: Participant[];
};

const crownColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // 金・銀・銅

const ResultRanking: React.FC<ResultRankingProps> = ({ participants }) => {
  // commit数で降順ソート
  const sorted = [...participants].sort((a, b) => b.commit - a.commit);
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-end',
      width: '100%',
      maxWidth: '90vw',
      overflowX: 'auto',
      padding: '4px 0',
      scrollbarWidth: 'thin',
      WebkitOverflowScrolling: 'touch',
    }}>
      {sorted.map((p, i) => (
        <div key={p.username} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 8,
          padding: '6px 8px',
          minWidth: 80,
          boxShadow: i < 3 ? `0 0 4px ${crownColors[i]}55` : 'none',
          border: i < 3 ? `2px solid ${crownColors[i]}` : '1px solid #444',
        }}>
          <span style={{ fontSize: 18, marginBottom: 2 }}>{i < 3 ? '🥇🥈🥉'[i] : i + 1}</span>
          <img src={p.iconUrl} alt={p.username} style={{ width: 28, height: 28, borderRadius: '50%', border: i < 3 ? `2px solid ${crownColors[i]}` : '1px solid #444', marginBottom: 2 }} />
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 12, marginBottom: 1 }}>{p.username}</span>
          <span style={{ color: '#56D364', fontWeight: 'bold', fontSize: 13 }}>{p.commit}</span>
        </div>
      ))}
    </div>
  );
};

export default ResultRanking;
