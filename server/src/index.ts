import { Hono } from "hono";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: "../.env" });

const app = new Hono();

app.use("*", async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  console.log("Body:", await c.req.text());

  await next();
});

// `/api/token` エンドポイント
app.post("/api/token", async (c) => {
  console.log("Received request to /api/token");
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

app.get("/", (c) => {
  return c.text("Hello from Hono!");
});

// サーバーを3001番ポートで起動
serve({
  fetch: app.fetch,
  port: 3001,
},(info)=>{
  console.log(`Server is running on http://localhost:${info.port}`);
});