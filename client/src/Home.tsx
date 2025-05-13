import './Home.css';
import logo from './assets/logo.png';
import SidebarDrawer from './components/SidebarDrawer';
import TopTitle from './components/topTitle';
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

// タイムライン用ダミーデータ
const dummyActivities: Activity[] = [
  {
    iconUrl: logo,
    activityType: 'pushed commit',
    time: '17:21',
    detail: 'Add: emoi modal, fix: bug in timeline'
  },
  {
    iconUrl: logo,
    activityType: 'opened issue',
    time: '17:25',
    detail: 'Issue: unexpected behavior in ranking'
  },
  {
    iconUrl: logo,
    activityType: 'reviewed PR',
    time: '17:30',
    detail: 'Approve changes for feature-x'
  },
  {
    iconUrl: logo,
    activityType: 'closed issue',
    time: '17:35',
    detail: 'Resolved: typo in README'
  },
  {
    iconUrl: logo,
    activityType: 'merged PR',
    time: '17:40',
    detail: 'Feature complete!'
  },
];

const Home = () => {
    return (
        <div style={{position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden'}}>
            <ParticipantRanking participants={dummyParticipants} />
            <div className="home__container">
                <SidebarDrawer />
                <TopTitle title="ハッカソンもくもくかい①" />
                <div style={{flex:1, width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <ActivityTimeline activities={dummyActivities} />
                </div>
            </div>
        </div>
    );
}

export default Home;