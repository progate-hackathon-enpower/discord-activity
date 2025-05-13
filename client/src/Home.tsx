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
                <ParticipantRanking participants={dummyParticipants} />
                {/* <div className="home__footer">
                    <img src={logo} alt="icon1" className="home__footer-icon" />
                    <img src={logo} alt="icon2" className="home__footer-icon" />
                    <img src={logo} alt="icon3" className="home__footer-icon" />
                    <button className="home__footer-btn">休</button>
                    <img src={logo} alt="icon4" className="home__footer-icon" />
                </div> */}
            </div>
        </div>
    );
}

export default Home;