interface ImportMetaEnv {
    readonly VITE_DISCORD_CLIENT_ID: string;
    readonly DISCORD_CLIENT_SECRET: string;   
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}