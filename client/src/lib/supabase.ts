
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let client:SupabaseClient<Database> | null = null;

export const getSupabaseClient = () => {
    if (client == null) {
        client = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
    }
    return client;
}