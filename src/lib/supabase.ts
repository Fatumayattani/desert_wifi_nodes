import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WifiNode {
  id: string;
  node_id: number;
  owner_address: string;
  location: string;
  price_per_hour_eth: number;
  price_per_hour_usd: number;
  reputation_score: number;
  total_connections: number;
  is_active: boolean;
  upvotes: number;
  downvotes: number;
  registered_at: string;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}
