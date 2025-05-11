import {useEffect, useState} from 'react';
// import reactLogo from './assets/react.svg';
import mainLogo from './assets/logo.png';
import './App.css';
import { DiscordSDK } from "@discord/embedded-app-sdk";
import backgroundImg from './assets/home_background.png';
import FrontendButton from './components/froatButton.tsx';
import SimpleButton from './components/simpleButton.tsx';

// SDK のインスタンスを生成
const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

type authType = Awaited<ReturnType<typeof discordSdk.commands.authenticate>>;
setupDiscordSdk().then(() => {
  console.log("Discord SDK is ready");
});

// SDK を介してアプリにアクセス
async function setupDiscordSdk() {
  await discordSdk.ready();
}

async function authenticate():Promise<authType|null> {
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

  // Retrieve an access_token from your activity's server
  // Note: We need to prefix our backend `/api/token` route with `/.proxy` to stay compliant with the CSP.
  // Read more about constructing a full URL and using external resources at
  // https://discord.com/developers/docs/activities/development-guides#construct-a-full-url
  const response = await fetch("/.proxy/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  if(response.status !== 200) return null;
  const { access_token } = await response.json();
  // Authenticate with Discord client (using the access_token)

  const auth = await discordSdk.commands.authenticate({
    access_token,
  });
  
  if (auth == null) {
    return null;
  }
  return auth;
}

function App() {
  const [authContext, setAuthContext] = useState<authType | null>(null);
  useEffect(()=>{
    const fetchAuth = async () => {
      const auth = await authenticate();
      setAuthContext(auth);
    };
    fetchAuth();
  });
  if(authContext == null) return (
    <h1>ローディング中...</h1>
  );
  
  return (
    <body style={{display: "grid",backgroundImage: `url(${backgroundImg})`,backgroundSize: "cover", backgroundPosition: "center",placeItems:"center",alignContent: "center",alignItems:"center" }}>
      <div className="overlay"></div>
      <div style={{zIndex:999,position:"relative",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}>
        <img className="logo" src={mainLogo} style={{width:"60%"}}/>
        <p style={{fontSize:20}}>ようこそ、{authContext.user.global_name != null ? authContext.user.global_name:authContext.user.username}</p>
        <SimpleButton text='タップで始める' onClick={()=>{}}/>
        
        {/*ここより上にコンポーネントを追加*/}
        <FrontendButton/>
      </div>
    </body>
  )
}

export default App
