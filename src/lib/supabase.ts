import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://vkwsivnvcyqjtjryjyyg.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4LRk-9FmcX73WXx5u0jedw_C4f4XSFX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
