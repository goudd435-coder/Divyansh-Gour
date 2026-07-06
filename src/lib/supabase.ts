import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://vkwsivnvcyqjtjryjyyg.supabase.co';
const defaultAnonKey = 'sb_publishable_4LRk-9FmcX73WXx5u0jedw_C4f4XSFX';

function isValidUrl(url: string | undefined): boolean {
  if (!url) return false;
  if (url.includes('your-supabase-project')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

let supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
let supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!isValidUrl(supabaseUrl)) {
  console.log('[Supabase Client] Configured VITE_SUPABASE_URL is invalid or missing. Using default fallback.');
  supabaseUrl = defaultUrl;
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-supabase-anon-key')) {
  console.log('[Supabase Client] Configured VITE_SUPABASE_ANON_KEY is invalid or missing. Using default fallback.');
  supabaseAnonKey = defaultAnonKey;
}

let supabaseClient: any = null;
try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.error('[Supabase Client] Critical error initializing Supabase:', err);
  try {
    supabaseClient = createClient(defaultUrl, defaultAnonKey);
  } catch (e) {
    console.error('[Supabase Client] Fallback client initialization failed:', e);
  }
}

export const supabase = supabaseClient;
