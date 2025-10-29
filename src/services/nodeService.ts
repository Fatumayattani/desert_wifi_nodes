import { supabase, WifiNode } from '../lib/supabase';

export interface NodeFilters {
  searchQuery?: string;
  minPriceETH?: number;
  maxPriceETH?: number;
  minPriceUSD?: number;
  maxPriceUSD?: number;
  minReputation?: number;
  activeOnly?: boolean;
}

export type SortOption =
  | 'price_eth_asc'
  | 'price_eth_desc'
  | 'price_usd_asc'
  | 'price_usd_desc'
  | 'reputation_desc'
  | 'connections_desc'
  | 'newest';

export async function getAllNodes(): Promise<WifiNode[]> {
  const { data, error } = await supabase
    .from('wifi_nodes')
    .select('*')
    .order('reputation_score', { ascending: false });

  if (error) {
    console.error('Error fetching nodes:', error);
    return [];
  }

  return data || [];
}

export async function getActiveNodes(): Promise<WifiNode[]> {
  const { data, error } = await supabase
    .from('wifi_nodes')
    .select('*')
    .eq('is_active', true)
    .order('reputation_score', { ascending: false });

  if (error) {
    console.error('Error fetching active nodes:', error);
    return [];
  }

  return data || [];
}

export async function getNodeById(nodeId: number): Promise<WifiNode | null> {
  const { data, error } = await supabase
    .from('wifi_nodes')
    .select('*')
    .eq('node_id', nodeId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching node:', error);
    return null;
  }

  return data;
}

export async function searchNodes(
  filters: NodeFilters = {},
  sortBy: SortOption = 'reputation_desc'
): Promise<WifiNode[]> {
  let query = supabase.from('wifi_nodes').select('*');

  if (filters.activeOnly) {
    query = query.eq('is_active', true);
  }

  if (filters.searchQuery) {
    query = query.ilike('location', `%${filters.searchQuery}%`);
  }

  if (filters.minPriceETH !== undefined) {
    query = query.gte('price_per_hour_eth', filters.minPriceETH);
  }

  if (filters.maxPriceETH !== undefined) {
    query = query.lte('price_per_hour_eth', filters.maxPriceETH);
  }

  if (filters.minPriceUSD !== undefined) {
    query = query.gte('price_per_hour_usd', filters.minPriceUSD);
  }

  if (filters.maxPriceUSD !== undefined) {
    query = query.lte('price_per_hour_usd', filters.maxPriceUSD);
  }

  if (filters.minReputation !== undefined) {
    query = query.gte('reputation_score', filters.minReputation);
  }

  switch (sortBy) {
    case 'price_eth_asc':
      query = query.order('price_per_hour_eth', { ascending: true });
      break;
    case 'price_eth_desc':
      query = query.order('price_per_hour_eth', { ascending: false });
      break;
    case 'price_usd_asc':
      query = query.order('price_per_hour_usd', { ascending: true });
      break;
    case 'price_usd_desc':
      query = query.order('price_per_hour_usd', { ascending: false });
      break;
    case 'reputation_desc':
      query = query.order('reputation_score', { ascending: false });
      break;
    case 'connections_desc':
      query = query.order('total_connections', { ascending: false });
      break;
    case 'newest':
      query = query.order('registered_at', { ascending: false });
      break;
    default:
      query = query.order('reputation_score', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error searching nodes:', error);
    return [];
  }

  return data || [];
}

export async function getSyncStatus() {
  const { data, error } = await supabase
    .from('node_sync_status')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching sync status:', error);
    return null;
  }

  return data;
}
