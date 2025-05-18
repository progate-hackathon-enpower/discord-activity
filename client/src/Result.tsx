import { useState, useEffect, useRef } from "react";
import "./Result.css";
import StarsBackground from "./components/StarsBackground";
import ActivityStats from "./components/ActivityStats";
import ResultRanking from "./components/ResultRanking";
import ActivityTimeline from "./components/ActivityTimeline";
import CommitGraph from "./components/CommitGraph";

const dummyParticipants = [
  { username: 'Alice', iconUrl: 'https://example.com/alice.png', commit: 100 },
  { username: 'Bob', iconUrl: 'https://example.com/bob.png', commit: 80 },
  { username: 'Charlie', iconUrl: 'https://example.com/charlie.png', commit: 60 },
];
const dummyActivities = [
  { user_id: '1', username: 'Alice', iconUrl: 'https://example.com/alice.png', activityType: 'pushed 2 commits', time: '17:43', detail: 'Add: new feature' },
  { user_id: '2', username: 'Bob', iconUrl: 'https://example.com/bob.png', activityType: 'created issue', time: '17:21', detail: 'Fix: bug in timeline' },
  { user_id: '3', username: 'Charlie', iconUrl: 'https://example.com/charlie.png', activityType: 'opened PR', time: '17:00', detail: 'Refactor: UI' },
];
const thumbnail = 'https://example.com/thumbnail.png';
const dummyCommitData = [
  { time: '2022-01-01', commits: 5 },
  { time: '2022-01-02', commits: 10 },
  { time: '2022-01-03', commits: 15 },
];

const Result = () => {
  const [selectedTab, setSelectedTab] = useState('Alice');
  const [selectedView, setSelectedView] = useState<'timeline' | 'graph'>('timeline');
  const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const startTime = new Date(Date.now() - 2 * 60 * 60 * 1000 - 13 * 60 * 1000 - 4 * 1000); // 2:13:04前
  const totalContributions = dummyParticipants.reduce((sum, p) => sum + p.commit, 0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // パーティクルエフェクト
  useEffect(() => {
    const spawnParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      particle.style.left = `${cursorPos.x + (Math.random() - 0.5) * 20}px`;
      particle.style.top = `${cursorPos.y + (Math.random() - 0.5) * 20}px`;
      document.body.appendChild(particle);
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 500);
    };
    const interval = setInterval(() => {
      if (document.hasFocus()) {
        if (Math.random() < 0.5) spawnParticle();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [cursorPos]);

  // タブリスト（アイコン化）
  const tabList = [
    ...dummyParticipants.map(p => ({ key: p.username, icon: p.iconUrl })),
    { key: '👑 Ranking', icon: null }
  ];

  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden'}}>
      <StarsBackground />
      <div 
        ref={cursorRef}
        className="cursor-glow"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'block'
        }}
      />
      <div style={{position: 'relative', zIndex: 1, padding: '32px 0'}}>
        <div style={{textAlign: 'center', color: '#fff', marginBottom: 16, fontSize: 24, fontWeight: 'bold', letterSpacing: 2}}>
          ハッカソンもくもくかい①<br />お疲れ様でしたー！🌱
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, marginBottom: 24, width: '100%', maxWidth: '1200px', margin: '0 auto 24px'}}>
          <ActivityStats startTime={startTime} totalContributions={totalContributions} />
          <div style={{fontSize: 32, color: '#56D364', fontWeight: 'bold'}}>🌱 {totalContributions} Contributions</div>
          <span style={{background: '#56D364', color: '#201653', borderRadius: 8, padding: '4px 12px', fontWeight: 'bold'}}>Excellent!!</span>
        </div>
        {/* メインエリアを横並びflexで分割 */}
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', minHeight: 360, gap: 0}}>
          {/* タブバー（縦並び・左側固定） */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginRight: 32, minWidth: 56, position: 'sticky', left: 0, top: 120}}>
            {tabList.map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                style={{
                  background: selectedTab === tab.key ? '#874FFF' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: 16,
                  padding: 0,
                  width: 48,
                  height: 48,
                  marginBottom: 4,
                  fontWeight: 'bold',
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: selectedTab === tab.key ? '0 0 8px #874FFF' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {tab.icon ? (
                  <img src={tab.icon} alt={tab.key} style={{width: 28, height: 28, borderRadius: '50%'}} />
                ) : (
                  <span style={{fontSize: 22}}>👑</span>
                )}
              </button>
            ))}
          </div>
          {/* タブ内容 */}
          <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
            {selectedTab === '👑 Ranking' ? (
              <div className="result__ranking-center">
                <div>
                  <div style={{color: '#fff', fontWeight: 'bold', marginBottom: 8}}>ランキング</div>
                  <ResultRanking participants={dummyParticipants} />
                </div>
              </div>
            ) : (
              <div className="result__timeline-center">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 16}}>
                  <div style={{color: '#fff', fontWeight: 'bold'}}>{selectedTab} の{selectedView === 'timeline' ? 'タイムライン' : 'コミット履歴'}</div>
                  <div style={{display: 'flex', gap: 8}}>
                    <button
                      onClick={() => setSelectedView('graph')}
                      style={{
                        background: selectedView === 'graph' ? '#874FFF' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      📊
                    </button>
                    <button
                      onClick={() => setSelectedView('timeline')}
                      style={{
                        background: selectedView === 'timeline' ? '#874FFF' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      🌱
                    </button>
                  </div>
                </div>
                {selectedView === 'timeline' ? (
                  <ActivityTimeline activities={dummyActivities} />
                ) : (
                  <CommitGraph commitData={dummyCommitData} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
