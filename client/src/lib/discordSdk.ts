import { DiscordSDK } from "@discord/embedded-app-sdk";

let sdk:DiscordSDK

export const getDiscordSdk = () => {
    if (sdk == null) {
        sdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
    }
    return sdk;
}