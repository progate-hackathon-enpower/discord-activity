import './Home.css';
import logo from './assets/logo.png';
import SidebarDrawer from './components/SidebarDrawer';
import TopTitle from './components/TopTitle';
import ParticipantRanking from './components/ParticipantRanking';

const dummyParticipants = [
    { username: 'Alice', iconUrl: logo, commit: 12 },
    { username: 'Bob', iconUrl: logo, commit: 8 },
    { username: 'Carol', iconUrl: logo, commit: 5 },
    { username: 'Dave', iconUrl: logo, commit: 3 },
    { username: 'Eve', iconUrl: logo, commit: 2 },
];

const Home = () => {
    return (
        <div style={{position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden'}}>
            <ParticipantRanking participants={dummyParticipants} />
            <div className="home__container">
                <SidebarDrawer />
                <TopTitle title="ハッカソンもくもくかい①" />
                <div style={{flex:1, width:'100%'}}>
                    <div className="home__header">
                        <span className="home__title">ハッカソンもくもくかい①</span>
                        <span className="home__timer">1:04:23</span>
                    </div>
                    <div className="home__contribution">Contribution <span>23</span></div>
                    <div className="home__chat">
                        <div className="home__chat-item home__chat-item--left">
                            <img src={logo} alt="avatar" className="home__avatar" />
                            <div className="home__bubble home__bubble--blue">
                                Issue tateta...
                            </div>
                            <span className="home__time">17:21</span>
                        </div>
                        <div className="home__chat-item home__chat-item--left">
                            <img src={logo} alt="avatar" className="home__avatar" />
                            <div className="home__bubble home__bubble--blue">
                                Issue tateta...
                            </div>
                            <span className="home__time">17:21</span>
                        </div>
                        <div className="home__chat-item home__chat-item--right">
                            <img src={logo} alt="avatar" className="home__avatar" />
                            <div className="home__bubble home__bubble--green">
                                pushed 2 commits!<br />Add: emoi modal...
                            </div>
                            <span className="home__time">17:43</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;