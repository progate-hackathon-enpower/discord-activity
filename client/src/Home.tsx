import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <div>
                <h1>Welcome to the Discord Activity</h1>
                <p>Click the button below to start your adventure!</p>
                <button className="home__button">Start</button>
            </div>
        </div>
    );
}

export default Home;