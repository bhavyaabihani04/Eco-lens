import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://ownsemlvxsjlflbbqbgi.supabase.co";
const supabaseKey = "sb_publishable_vp8K_9e3hEdvRd4_6-6UMA_RYFCbfyj";

const supabase = createClient(
    supabaseUrl,
    supabaseKey
);
