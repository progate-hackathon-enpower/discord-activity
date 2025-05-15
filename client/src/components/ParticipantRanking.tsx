import React from 'react';
import { FaCrown } from 'react-icons/fa';
import logo from '../assets/logo.png';

export interface ActivityUser {
    id: string;
    username: string;
    iconUrl: string;
    activityCount: number;
}

type ParticipantRankingProps = {
    participants: ActivityUser[];
};

const crownColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // 金・銀・銅
const iconSizes = [50, 40, 35, 30]; // 1位,2位,3位,4位以降
const crownSizes = [14, 12, 10, 8];

// 同率順位計算（全員表示）
function getRanks(sorted: ActivityUser[]) {
    let lastScore: number | null = null;
    let lastRank = 0;
    return sorted.map((user, idx) => {
        if (user.activityCount !== lastScore) {
            lastRank = idx + 1;
            lastScore = user.activityCount;
        }
        return { ...user, rank: lastRank };
    });
}

const ParticipantRanking: React.FC<ParticipantRankingProps> = ({ participants }) => {
    // アクティビティ数で降順ソート
    const sorted = [...participants].sort((a, b) => b.activityCount - a.activityCount);
    const ranked = getRanks(sorted);
    // 各順位ごとに何人いるかを取得
    const rankCount: { [rank: number]: number } = {};
    ranked.forEach(u => { rankCount[u.rank] = (rankCount[u.rank] || 0) + 1; });

    return (
        <div className="home__footer home__footer--left" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {ranked.map((p, i) => {
                // 1,2,3位までは色・サイズを割り当て、それ以降は4位扱い
                const displayRank = p.rank <= 3 ? p.rank - 1 : 3;
                const iconSize = iconSizes[displayRank] + 'px';
                const crownSize = crownSizes[displayRank] + 'px';
                const showCrown = p.rank <= 3;
                return (
                    <div key={p.id} className="home__footer-icon-wrapper" style={{ display: 'inline-block' }}>
                        <div style={{position: 'relative', display: 'inline-block'}}>
                            <img 
                                src={p.iconUrl} 
                                alt={p.username} 
                                className="home__footer-icon"
                                style={{width: iconSize, height: iconSize}} 
                            />
                            {showCrown && (
                                <FaCrown 
                                    className="home__footer-crown"
                                    style={{ 
                                        color: crownColors[displayRank], 
                                        fontSize: crownSize,
                                    }} 
                                />
                            )}
                        </div>
                        <div className="home__footer-username">{p.username}</div>
                        <div className="home__footer-commit">
                            {p.activityCount} commits
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ParticipantRanking; 