import React, { useEffect, useRef } from 'react';
import './Home.css';
import logo from './assets/logo.png';
import SidebarDrawer from './components/SidebarDrawer';
import TopTitle from './components/TopTitle';
import ParticipantRanking from './components/ParticipantRanking';
import ActivityTimeline from './components/ActivityTimeline';
import type { Activity } from './components/ActivityTimeline';

const dummyParticipants = [
    { username: 'Alice', iconUrl: logo, commit: 12 },
    { username: 'Bob', iconUrl: logo, commit: 8 },
    { username: 'Carol', iconUrl: logo, commit: 5 },
    { username: 'Dave', iconUrl: logo, commit: 3 },
    { username: 'Eve', iconUrl: logo, commit: 2 },
];

const dummyActivities: Activity[] = [
  { iconUrl: logo, activityType: 'pushed 2 commits!', time: '17:43', detail: 'Add: emoi modal...' },
  { iconUrl: logo, activityType: 'Issue tateta...', time: '17:21', detail: 'Issue tateta...' },
  { iconUrl: logo, activityType: 'Issue tateta...', time: '17:21', detail: 'Issue tateta...' },
  { iconUrl: logo, activityType: 'created issue', time: '17:10', detail: 'Fix: bug in timeline' },
  { iconUrl: logo, activityType: 'pushed 1 commit', time: '17:00', detail: 'Refactor: UI' },
  { iconUrl: logo, activityType: 'opened PR', time: '16:50', detail: 'Add: new feature' },
  { iconUrl: logo, activityType: 'commented', time: '16:40', detail: 'Looks good!' },
  { iconUrl: logo, activityType: 'closed issue', time: '16:30', detail: 'Resolved: typo' },
  { iconUrl: logo, activityType: 'reviewed PR', time: '16:20', detail: 'Approve changes' },
  { iconUrl: logo, activityType: 'merged PR', time: '16:10', detail: 'Feature complete' },
  { iconUrl: logo, activityType: 'reopened issue', time: '16:00', detail: 'Bug reappeared' },
  { iconUrl: logo, activityType: 'assigned issue', time: '15:50', detail: 'Assign to Alice' },
];

const StarsBackground = () => {
    const starsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const createStars = () => {
            if (!starsRef.current) return;
            
            const starsContainer = starsRef.current;
            const numberOfStars = 100;

            for (let i = 0; i < numberOfStars; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // ランダムな位置とサイズを設定
                const size = Math.random() * 2 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                
                // アニメーションの遅延をランダムに設定
                star.style.animationDelay = `${Math.random() * 4}s`;
                
                starsContainer.appendChild(star);
            }
        };

        createStars();
    }, []);

    return <div ref={starsRef} className="stars" />;
};

const Home = () => {
    return (
        <div style={{position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden'}}>
            <StarsBackground />
            <div className="ranking-background" />
            <ParticipantRanking participants={dummyParticipants} />
            <div className="home__container">
                <SidebarDrawer />
                <TopTitle title="ハッカソンもくもくかい①" />
                <div style={{
                    flex: 1,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    height: 'calc(100vh - 300px)',
                    maxHeight: 'calc(100vh - 100px)',
                    overflowY: 'auto'
                }}>
                    <ActivityTimeline activities={dummyActivities} />
                </div>
            </div>
        </div>
    );
}

export default Home;