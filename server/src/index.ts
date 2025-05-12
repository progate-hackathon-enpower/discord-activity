import { Hono } from "hono";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import fetch from "node-fetch";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: "../.env" });

const app = new Hono();

// `/api/token` エンドポイント
app.post("/api/token", async (c) => {
  console.log("Received request to /api/token");
  try {
    const body = await c.req.json();

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
      const data = await response.json();
      console.log(data);
      return c.json({ error: "Failed to fetch access token" },500);
    }

    const data = await response.json() as { access_token: string };
    
    return c.json({ access_token: data.access_token });    
  } catch (error) {
    console.log(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

app.post("/api/supabase/token", async (c) => {
  try {
    const body = await c.req.json();

    if (!body.access_token) {
      return c.json({ error: "Authorization code is required" }, 400);
    }

    const response = await fetch("https://discord.com/api/users/@me", {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${body.access_token}`,
      }
    });

    if (!response.ok) {
      return c.json({ error: "Failed to fetch access token" },500);
    }

    const data = await response.json() as { id: string };
    const now = Math.floor(Date.now() / 1000);

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: user } = await supabase.auth.admin.listUsers();


    const filtered = user.users.filter(user =>{
      if (user.user_metadata) {
        if (user.user_metadata.iss == "https://discord.com/api" && user.user_metadata.sub == data.id) {
          return user;
        }
      }
    });

    if (filtered.length === 0) {
      return c.json({ error: "User not found" }, 404);
    }

    if (filtered.length > 1) {
      return c.json({ error: "Multiple users found" }, 500);
    }

    const payload = {
      sub: filtered[0].id,
      aud: 'authenticated',
      role: 'authenticated',
      iss: 'supabase',
      iat: now,
      exp: now + 60 * 60 * 24 * 7, // 1週間
    };
    
    return c.json({ access_token: jwt.sign(payload, process.env.JWT_SECRET!, { algorithm: 'HS256' }), refresh_token: crypto.randomBytes(64).toString('base64url') });    
  } catch (error) {
    console.log(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
})

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