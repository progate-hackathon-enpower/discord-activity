import React from 'react';
import '../Home.css';
import { FaCrown } from 'react-icons/fa';

type Participant = {
    username: string;
    iconUrl: string;
    commit: number;
};

type ParticipantRankingProps = {
    participants: Participant[];
};

const crownColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // 金・銀・銅

const ParticipantRanking: React.FC<ParticipantRankingProps> = ({ participants }) => {
    // commit数で降順ソート
    const sorted = [...participants].sort((a, b) => b.commit - a.commit).slice(0, 10);
    return (
        <div className="home__footer">
            {sorted.map((p, i) => (
                <div key={p.username} className="home__footer-icon-wrapper">
                    <div style={{position:'relative', display:'inline-block'}}>
                        <img src={p.iconUrl} alt={p.username} className="home__footer-icon" />
                        {i < 3 && (
                            <FaCrown className="home__footer-crown" style={{color: crownColors[i], position:'absolute', top: -12, left: 8, fontSize: 20}} />
                        )}
                    </div>
                    <div className="home__footer-username">{p.username}</div>
                    <div className="home__footer-commit">{p.commit} commits</div>
                </div>
            ))}
        </div>
    );
};

export default ParticipantRanking; 