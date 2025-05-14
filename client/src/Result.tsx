import React, { useRef, useState } from 'react';
import ResultRanking from './components/ResultRanking';
// ...他のimportは適宜

const dummyParticipants = [
  { username: 'Alice', iconUrl: 'assets/logo.png', commit: 12 },
  { username: 'Bob', iconUrl: 'assets/logo.png', commit: 8 },
  { username: 'Carol', iconUrl: 'assets/logo.png', commit: 5 },
  { username: 'Dave', iconUrl: 'assets/logo.png', commit: 3 },
  { username: 'Eve', iconUrl: 'assets/logo.png', commit: 2 },
];

const Result = () => {
  const rankingRef = useRef<HTMLDivElement>(null);
  // ...他のstateやロジック

  return (
    <div className="result__ranking-center">
      <div className="result__ranking-container" ref={rankingRef}>
        <div>
          <div style={{color: '#fff', fontWeight: 'bold', marginBottom: 2, textAlign: 'center'}}>ランキング</div>
          <ResultRanking participants={dummyParticipants} />
        </div>
      </div>
    </div>
  );
};

export default Result; 