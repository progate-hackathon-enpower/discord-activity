import {useEffect, useState} from 'react';
// import reactLogo from './assets/react.svg';
import mainLogo from './assets/logo.png';
import './App.css';
import { DiscordSDK,Events, type Types } from "@discord/embedded-app-sdk";
import backgroundImg from './assets/home_background.png';
import qrcodeImage from './assets/qrcode.png';
import FrontendButton from './components/froatButton.tsx';
import SimpleButton from './components/simpleButton.tsx';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home.tsx';
import { createClient } from '@supabase/supabase-js'
// SDK のインスタンスを生成
const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

type authType = Awaited<ReturnType<typeof discordSdk.commands.authenticate>>;
setupDiscordSdk().then(() => {
  console.log("Discord SDK is ready");
});

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// SDK を介してアプリにアクセス
async function setupDiscordSdk() {
  await discordSdk.ready();
}
/// 1: リクエストに失敗 2: 認証が未完了 3:アプリ側で未登録
async function authenticate():Promise<authType|number> {
  console.log("Starting authentication process...");
  const { code } = await discordSdk.commands.authorize({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: [
      "identify",
      "guilds",
      "applications.commands",
      "guilds.members.read",
    ],
  });

  const discordTokenResponse = await fetch("/.proxy/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });

  if(discordTokenResponse.status !== 200) return 1;
  const discordData = await discordTokenResponse.json();

  const { data: { user } } = await supabase.auth.getUser();
  console.log(user);

  const auth = await discordSdk.commands.authenticate({
    access_token: discordData.access_token,
  });
  
  try{
    const supabaseTokenResponse = await fetch("/.proxy/api/supabase/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: auth.access_token,
      }),
    });

    if(supabaseTokenResponse.status !== 200) return 3;
    const { access_token, refresh_token } = await supabaseTokenResponse.json();

    await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
  }catch(e){
    console.error(e);
    return 1;
  }

  const { data } = await supabase.auth.getUser();
  console.log(data.user);
  
  if (auth == null) {
    return 2;
  }
  return auth;
}

function MainApp() {
  const navigate = useNavigate();
  const [authContext, setAuthContext] = useState<authType | number>(0);
  const [currentUserUpdate , setCurrentUserUpdate] = useState<Types.GetActivityInstanceConnectedParticipantsResponse["participants"][0]|null>(null);
  useEffect(()=>{
    const fetchAuth = async () => {
      const auth = await authenticate();
      setAuthContext(auth);
    };
    fetchAuth();
  },[authContext]);
  if(authContext == null) return (
    <h1>ローディング中...</h1>
  );

  if(typeof authContext == 'number'){
    /// 1: リクエストに失敗 2: 認証が未完了 3:アプリ側で未登録
    switch(authContext){
      case 1:
        return (
          <h1>サーバーとの通信に失敗しました</h1>
        );
      case 2:
        return (
          <h1>ローディング中...</h1>
        );
      case 3:
        return (
          <>
          <img src={qrcodeImage} style={{width:"80vh",maxWidth:"80%"}}></img>
            <h1>アプリから登録を完了してください。</h1>
          </>
        );
    }
    return (
      <h1>ローディング中...</h1>
    );
  }

  // ユーザーの参加イベントを監視
  function updateParticipants(participants: Types.GetActivityInstanceConnectedParticipantsResponse) {
    console.log(JSON.stringify(participants.participants));
    participants.participants.forEach((p)=>{
      console.log(p.username);
      setCurrentUserUpdate(p);
    });
  }

  discordSdk.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updateParticipants);
  return (
    <body style={{display: "grid",backgroundImage: `url(${backgroundImg})`,backgroundSize: "cover", backgroundPosition: "center",placeItems:"center",alignContent: "center",alignItems:"center" }}>
      <div className="overlay"></div>
      <div style={{zIndex:999,position:"relative",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}>
        <img className="logo" src={mainLogo} style={{width:"60%"}}/>
        <p style={{fontSize:20}}>ようこそ、{authContext.user.global_name != null ? authContext.user.global_name:authContext.user.username}</p>
        <SimpleButton text='タップで始める' onClick={()=>{navigate("/home")}}/>
        {currentUserUpdate != null ?<p>{currentUserUpdate.username}が参加しました</p>: <p>ユーザーの参加イベントはありません</p>}
        {/*ここより上にコンポーネントを追加*/}
        <FrontendButton/>
      </div>
    </body>
  )
}

const MainRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<MainApp />}
      />
      <Route
        path="/Home"
        element={<Home/>}
      />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
      <Router>
        <MainRoutes />
      </Router>
  );
};

export default App
