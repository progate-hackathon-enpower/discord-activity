import { useState,use, Suspense } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import { DiscordSDK } from "@discord/embedded-app-sdk";

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
  const [count, setCount] = useState(0)

  const auth = use(authenticate());
  console.log(auth);
  if(auth == null) return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <h1>ユーザー認証に失敗しました。</h1>
    </Suspense>
  );
  
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>ようこそ、{auth.user.username}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </Suspense>
  )
}

export default App
