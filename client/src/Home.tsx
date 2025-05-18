import { useEffect, useRef, useState } from 'react';
import './Home.css';
import SidebarDrawer from './components/SidebarDrawer';
import TopTitle from './components/Title';
import ParticipantRanking, { type ActivityUser }from './components/ParticipantRanking';
import { useNavigate } from 'react-router-dom';

import ActivityTimeline from './components/ActivityTimeline';
import ActivityStats from './components/ActivityStats';
import type { Activity } from './components/ActivityTimeline';
import type { Types } from '@discord/embedded-app-sdk';
import { Events } from '@discord/embedded-app-sdk';
import { getDiscordSdk } from './lib/discordSdk';
import { getSupabaseClient } from './lib/supabase';
import type { Database } from './lib/database.types';

interface TranslateId{
    discord_id: string;
    supabase_id: string;
}

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

const translateActivityMessage = (type: Database["public"]["Tables"]["stats"]["Row"]["type"]) => {
    switch(type){
        case "commit":
            return "Push 1 Commits";
        case "issue":
            return "Issue 1 Created";
        case "comment":
            return "Comment 1 Created";
        case "pull_request":
            return "Pull Request 1 Created";
        case "review":
            return "Review 1 Created";
        case "review_comment":
            return "Review Comment 1 Created";
        default:
            return "Push 1 Commits";
    }
}

const Home = () => {
    const navigate = useNavigate();
    // もくもく会の開始時間を設定（例：現在時刻から1時間前）
    const startTime = new Date(Date.now() - 60 * 60 * 1000);
    const discordSdk = getDiscordSdk();
    
    // 総Contribution数を計算
    const [currentUser, setCurrentUser] = useState<Types.GetActivityInstanceConnectedParticipantsResponse["participants"]|null>(null);
    const [activity, setActivity] = useState<Activity[]>([]);
    const [activityUser, setActivityUser] = useState<ActivityUser[]>([]);
    // const [translateIdList, setTranslateIdList] = useState<TranslateId[]>([]);
    const [totalContributions, setTotalContributions] = useState<number>(0);
    const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // パーティクルエフェクト（止まっていても出す）
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

    useEffect(() => {
        discordSdk.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updateParticipants);

    }, []);

    function updateParticipants(participants: Types.GetActivityInstanceConnectedParticipantsResponse) {
        setCurrentUser(participants.participants);
    }

    useEffect(() => {
        if (currentUser) {
            const supabase = getSupabaseClient();
            const filterString = `user_id=in.(${currentUser?.map(user => user.id)})`;
            
    
            const channel = supabase
                .channel("table-db-changes")
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "stats",
                        filter: filterString,
                    },
                    (payload: {new:Database["public"]["Tables"]["stats"]["Row"]}) => {
                        const user = currentUser!.find(user => user.id === payload.new.user_id);
    
                        const newActivity: Activity = {
                            user_id: payload.new.user_id,
                            iconUrl: `https://cdn.discordapp.com/avatars/${user!.id}/${user!.avatar}.png?size=256`,
                            activityType: translateActivityMessage(payload.new.type),
                            time: payload.new.created_at,
                            detail: payload.new.detail || "",
                        };
    
                        setActivity(prevActivity => [...prevActivity, newActivity]);
                    }
                )
                .subscribe();
            return () => {
                channel.unsubscribe();
            }
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            const activityUser: ActivityUser[] = currentUser!.map(user => {
                const ActivityList = activity.filter(activity => activity.user_id === user.id);
                return {
                    id: user.id,
                    username: user.username,
                    iconUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`,
                    activityCount: ActivityList.length,
                    isActive: true,
                }
            });

            // activityに存在するが、currentUserに存在しないユーザーを追加
            const currentUserIds = new Set(currentUser.map(user => user.id));
            const inactiveUsers = activity
                .filter(act => !currentUserIds.has(act.user_id))
                .reduce((acc, act) => {
                    if (!acc.some(user => user.id === act.user_id)) {
                        const userActivities = activity.filter((a: Activity) => a.user_id === act.user_id);
                        acc.push({
                            id: act.user_id,
                            username: "離席中", // ユーザー名は取得できないため、離席中と表示
                            iconUrl: act.iconUrl,
                            activityCount: userActivities.length,
                            isActive: false,
                        });
                    }
                    return acc;
                }, [] as ActivityUser[]);
    
            setActivityUser([...activityUser, ...inactiveUsers]);
            setTotalContributions(activity.length);
        }
    },[activity,currentUser])

    const handleResultClick = () => {
        const resultParticipants = activityUser.map(user => ({
            username: user.username,
            iconUrl: user.iconUrl,
            commit: user.activityCount
        }));
        navigate('/result', { state: { participants: resultParticipants } });
    };

    return (
        <div style={{position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden'}}>
            <StarsBackground />
            <div className="ranking-background" />
            <ParticipantRanking participants={activityUser} />
            <ActivityStats startTime={startTime} totalContributions={totalContributions} />
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
                    <ActivityTimeline activities={activity} />
                </div>
                <button
                    onClick={handleResultClick}
                    style={{
                        position: 'fixed',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '12px 24px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        zIndex: 1000
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                >
                    結果を見る
                </button>
            </div>
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
        </div>
    );
}

export default Home;