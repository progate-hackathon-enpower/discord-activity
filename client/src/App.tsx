import {useEffect, useState, useRef} from 'react';
import './App.css';
import backgroundImg from './assets/mokuhub_main.png';
import qrcodeImage from './assets/qrcode.png';
import FrontendButton from './components/froatButton.tsx';
import SimpleButton from './components/simpleButton.tsx';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home.tsx';
import { getDiscordSdk } from './lib/discordSdk.ts';
import { getSupabaseClient } from './lib/supabase.ts';
// SDK のインスタンスを生成
const discordSdk = getDiscordSdk();

type authType = Awaited<ReturnType<typeof discordSdk.commands.authenticate>>;
setupDiscordSdk().then(() => {
  console.log("Discord SDK is ready");
});

const supabase = getSupabaseClient()

// SDK を介してアプリにアクセス
async function setupDiscordSdk() {
  await discordSdk.ready();
}
/// 1: リクエストに失敗 2: 認証が未完了 3:アプリ側で未登録
async function authenticate():Promise<authType|number> {

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
  const overlayRef = useRef<HTMLDivElement>(null);
  const [authContext, setAuthContext] = useState<authType | number>(0);
  
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
            <img src={qrcodeImage} style={{width:"80vh",maxWidth:"80%"}} draggable="false"></img>
            <h1>アプリから登録を完了してください。</h1>
            <SimpleButton text='登録しました' onClick={()=>{
              window.location.reload();
            }}/>
          </>
        );
    }
    return (
      <h1>ローディング中...</h1>
    );
  }
const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';

    const rect = overlay.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    overlay.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  };
  return (
    <body style={{display: "grid",backgroundImage: `url(${backgroundImg})`,backgroundSize: "cover", backgroundPosition: "start",placeItems:"center",alignContent: "center",alignItems:"center" }}>
      <div 
        className="overlay"  
        ref={overlayRef}
        onClick={(e) => {
          createRipple(e);
          navigate("/home");
        }}
      ></div>
      <div style={{zIndex:999,position:"relative",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}>
        {/* <img className="logo" src={mainLogo} style={{width:"60%"}} draggable="false"/> */}
        {/* <p style={{fontSize:20}}>ようこそ、{authContext.user.global_name != null ? authContext.user.global_name:authContext.user.username}</p> */}
        <br/>
        <br/>
        <br/>
        <p className="start-text">TAP TO START</p>
        <style>
          {`
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
              100% { transform: translateY(0px); }
            }
          `}
        </style>
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
