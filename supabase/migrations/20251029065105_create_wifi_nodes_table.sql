/*
  # WiFi Nodes Network Schema

  1. New Tables
    - `wifi_nodes`
      - `id` (uuid, primary key) - Internal unique identifier
      - `node_id` (integer, unique, not null) - Blockchain node ID
      - `owner_address` (text, not null) - Ethereum address of node owner
      - `location` (text, not null) - Node location description
      - `price_per_hour_eth` (numeric, not null) - Price per hour in ETH
      - `price_per_hour_usd` (numeric, not null) - Price per hour in USD
      - `reputation_score` (integer, not null, default 50) - Node reputation (0-100)
      - `total_connections` (integer, not null, default 0) - Total user connections
      - `is_active` (boolean, not null, default true) - Node active status
      - `upvotes` (integer, not null, default 0) - Positive ratings
      - `downvotes` (integer, not null, default 0) - Negative ratings
      - `registered_at` (timestamptz, not null) - Blockchain registration timestamp
      - `last_synced_at` (timestamptz, not null, default now()) - Last sync with blockchain
      - `created_at` (timestamptz, not null, default now()) - Database record creation
      - `updated_at` (timestamptz, not null, default now()) - Last database update

    - `node_sync_status`
      - `id` (uuid, primary key) - Internal identifier
      - `last_sync_timestamp` (timestamptz, not null) - Last successful sync time
      - `next_node_id` (integer, not null, default 1) - Next node ID to fetch from blockchain
      - `sync_in_progress` (boolean, not null, default false) - Sync operation status
      - `last_error` (text) - Last sync error message if any

  2. Security
    - Enable RLS on both tables
    - Add public read access policies for authenticated and anonymous users
    - Restrict write access to service role only (managed by backend/sync service)

  3. Indexes
    - Index on node_id for fast lookups
    - Index on is_active for filtering active nodes
    - Index on location for search functionality
    - Index on reputation_score for sorting
    - Index on price_per_hour_eth for price filtering
    - Index on price_per_hour_usd for price filtering

  4. Important Notes
    - Uses numeric type for prices to maintain precision
    - Timestamps use timestamptz for timezone awareness
    - RLS policies allow public read but no public write
    - Sync service will update data from blockchain periodically
*/

-- Create wifi_nodes table
CREATE TABLE IF NOT EXISTS wifi_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id integer UNIQUE NOT NULL,
  owner_address text NOT NULL,
  location text NOT NULL,
  price_per_hour_eth numeric NOT NULL DEFAULT 0,
  price_per_hour_usd numeric NOT NULL DEFAULT 0,
  reputation_score integer NOT NULL DEFAULT 50 CHECK (reputation_score >= 0 AND reputation_score <= 100),
  total_connections integer NOT NULL DEFAULT 0 CHECK (total_connections >= 0),
  is_active boolean NOT NULL DEFAULT true,
  upvotes integer NOT NULL DEFAULT 0 CHECK (upvotes >= 0),
  downvotes integer NOT NULL DEFAULT 0 CHECK (downvotes >= 0),
  registered_at timestamptz NOT NULL,
  last_synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create node_sync_status table
CREATE TABLE IF NOT EXISTS node_sync_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  last_sync_timestamp timestamptz NOT NULL DEFAULT now(),
  next_node_id integer NOT NULL DEFAULT 1 CHECK (next_node_id >= 1),
  sync_in_progress boolean NOT NULL DEFAULT false,
  last_error text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for wifi_nodes
CREATE INDEX IF NOT EXISTS idx_wifi_nodes_node_id ON wifi_nodes(node_id);
CREATE INDEX IF NOT EXISTS idx_wifi_nodes_is_active ON wifi_nodes(is_active);
CREATE INDEX IF NOT EXISTS idx_wifi_nodes_location ON wifi_nodes(location);
CREATE INDEX IF NOT EXISTS idx_wifi_nodes_reputation_score ON wifi_nodes(reputation_score DESC);
CREATE INDEX IF NOT EXISTS idx_wifi_nodes_price_eth ON wifi_nodes(price_per_hour_eth);
CREATE INDEX IF NOT EXISTS idx_wifi_nodes_price_usd ON wifi_nodes(price_per_hour_usd);
CREATE INDEX IF NOT EXISTS idx_wifi_nodes_registered_at ON wifi_nodes(registered_at DESC);

-- Enable Row Level Security
ALTER TABLE wifi_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_sync_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wifi_nodes (public read access)
CREATE POLICY "Allow public read access to wifi nodes"
  ON wifi_nodes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create RLS policies for node_sync_status (public read access)
CREATE POLICY "Allow public read access to sync status"
  ON node_sync_status
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert initial sync status record
INSERT INTO node_sync_status (id, last_sync_timestamp, next_node_id, sync_in_progress)
VALUES (gen_random_uuid(), now(), 1, false)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for wifi_nodes
DROP TRIGGER IF EXISTS update_wifi_nodes_updated_at ON wifi_nodes;
CREATE TRIGGER update_wifi_nodes_updated_at
  BEFORE UPDATE ON wifi_nodes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for node_sync_status
DROP TRIGGER IF EXISTS update_node_sync_status_updated_at ON node_sync_status;
CREATE TRIGGER update_node_sync_status_updated_at
  BEFORE UPDATE ON node_sync_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();