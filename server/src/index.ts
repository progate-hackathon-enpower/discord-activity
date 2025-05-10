import { Hono } from "hono";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: "../.env" });

const app = new Hono();

// `/api/token` エンドポイント
app.post("/api/token", async (c) => {
  try {
    const body = await c.req.parseBody<{ code: string }>();

    if (!body.code) {
      return c.json({ error: "Authorization code is required" }, 400);
    }

    // Discordのトークン交換
    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.VITE_DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code: body.code,
      }),
    });

    if (!response.ok) {
      return c.json({ error: "Failed to fetch access token" },500);
    }

    const data = await response.json() as { access_token: string };
    
    return c.json({ access_token: data.access_token });    
  } catch (error) {
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// サーバーを3001番ポートで起動
serve(app, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});