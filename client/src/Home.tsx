
import { useEffect, useRef, useState } from 'react';
import './Home.css';
import SidebarDrawer from './components/SidebarDrawer';
import TopTitle from './components/Title';
import ParticipantRanking, { type ActivityUser }from './components/ParticipantRanking';

import ActivityTimeline from './components/ActivityTimeline';
import ActivityStats from './components/ActivityStats';
import type { Activity } from './components/ActivityTimeline';
import type { Types } from '@discord/embedded-app-sdk';
import { Events } from '@discord/embedded-app-sdk';
import { getDiscordSdk } from './lib/discordSdk';
import { getSupabaseClient } from './lib/supabase';

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

const Home = () => {
    // もくもく会の開始時間を設定（例：現在時刻から1時間前）
    const startTime = new Date(Date.now() - 60 * 60 * 1000);
    const discordSdk = getDiscordSdk();
    
    // 総Contribution数を計算
    const [currentUser, setCurrentUser] = useState<Types.GetActivityInstanceConnectedParticipantsResponse["participants"]|null>(null);
    const [activity, setActivity] = useState<Activity[]>([]);
    const [activityUser, setActivityUser] = useState<ActivityUser[]>([]);
    const [translateIdList, setTranslateIdList] = useState<TranslateId[]>([]);
    const [totalContributions, setTotalContributions] = useState<number>(0);

    useEffect(() => {
        const subscription = discordSdk.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updateParticipants);
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
                    (payload) => {
                        const user = currentUser!.find(user => user.id === payload.new.user_id);
    
                        const newActivity: Activity = {
                            user_id: payload.new.user_id,
                            iconUrl: `https://cdn.discordapp.com/avatars/${user!.id}/${user!.avatar}.png?size=256`,
                            activityType: "Push 1 Commits",
                            time: payload.new.created_at,
                            detail: payload.new.detail
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
                }
            });
    
            setActivityUser(activityUser)
            setTotalContributions(activity.length)
        }
    },[activity,currentUser])

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
            </div>
        </div>
    );
}

export default Home;