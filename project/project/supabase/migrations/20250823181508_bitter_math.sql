/*
  # Trading Platform Database Schema
  
  1. New Tables
    - `users` - User accounts and authentication
    - `portfolios` - User portfolio summaries
    - `positions` - Current stock/asset positions
    - `orders` - Trading orders history
    - `watchlists` - User watchlists
    - `signals` - AI trading signals
    - `notifications` - User notifications
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure user data access
*/

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  email_verified boolean DEFAULT false,
  broker_connected boolean DEFAULT false,
  account_type text DEFAULT 'demo' CHECK (account_type IN ('demo', 'live')),
  preferences jsonb DEFAULT '{}'::jsonb
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  total_value decimal(15,2) DEFAULT 0.00,
  cash_balance decimal(15,2) DEFAULT 100000.00,
  day_change decimal(15,2) DEFAULT 0.00,
  day_change_percent decimal(8,4) DEFAULT 0.0000,
  total_pnl decimal(15,2) DEFAULT 0.00,
  total_pnl_percent decimal(8,4) DEFAULT 0.0000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Positions table
CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  quantity decimal(15,4) NOT NULL,
  avg_cost decimal(15,4) NOT NULL,
  current_price decimal(15,4) NOT NULL,
  market_value decimal(15,2) NOT NULL,
  unrealized_pnl decimal(15,2) NOT NULL,
  unrealized_pnl_percent decimal(8,4) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  quantity decimal(15,4) NOT NULL,
  side text NOT NULL CHECK (side IN ('buy', 'sell')),
  order_type text NOT NULL CHECK (order_type IN ('market', 'limit', 'stop', 'stop_limit')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'cancelled', 'rejected')),
  price decimal(15,4),
  filled_price decimal(15,4),
  stop_price decimal(15,4),
  take_profit decimal(15,4),
  created_at timestamptz DEFAULT now(),
  filled_at timestamptz,
  broker_order_id text
);

-- Watchlists table
CREATE TABLE IF NOT EXISTS watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Signals table
CREATE TABLE IF NOT EXISTS signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  signal_type text NOT NULL CHECK (signal_type IN ('BUY', 'SELL')),
  confidence integer NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  target_price decimal(15,4) NOT NULL,
  stop_loss decimal(15,4) NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'triggered', 'expired')),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  triggered_at timestamptz
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  notification_type text NOT NULL CHECK (notification_type IN ('signal', 'trade', 'news', 'system')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Market data cache table
CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  price decimal(15,4) NOT NULL,
  change_amount decimal(15,4) NOT NULL,
  change_percent decimal(8,4) NOT NULL,
  volume bigint DEFAULT 0,
  high decimal(15,4) NOT NULL,
  low decimal(15,4) NOT NULL,
  open_price decimal(15,4) NOT NULL,
  bid decimal(15,4) NOT NULL,
  ask decimal(15,4) NOT NULL,
  timestamp timestamptz DEFAULT now(),
  UNIQUE(symbol)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own portfolio" ON portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own portfolio" ON portfolios FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own positions" ON positions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own positions" ON positions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own watchlist" ON watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own watchlist" ON watchlists FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read signals" ON signals FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can read market data" ON market_data FOR SELECT TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_user_id ON positions(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_symbol ON positions(symbol);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_symbol ON orders(symbol);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_signals_symbol ON signals(symbol);
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);
CREATE INDEX IF NOT EXISTS idx_market_data_symbol ON market_data(symbol);
CREATE INDEX IF NOT EXISTS idx_market_data_timestamp ON market_data(timestamp);

-- Insert default watchlist symbols
INSERT INTO market_data (symbol, price, change_amount, change_percent, volume, high, low, open_price, bid, ask) VALUES
('AAPL', 175.43, 2.15, 1.24, 45200000, 177.25, 173.8, 174.2, 175.42, 175.44),
('GOOGL', 2847.32, -12.45, -0.44, 1200000, 2865.0, 2840.15, 2859.77, 2847.3, 2847.34),
('TSLA', 248.67, 5.23, 2.15, 28700000, 251.45, 243.2, 243.44, 248.65, 248.69),
('MSFT', 378.92, 1.87, 0.5, 22100000, 380.25, 376.8, 377.05, 378.9, 378.94),
('NVDA', 445.78, 8.92, 2.04, 35600000, 448.5, 436.86, 436.86, 445.76, 445.8)
ON CONFLICT (symbol) DO UPDATE SET
  price = EXCLUDED.price,
  change_amount = EXCLUDED.change_amount,
  change_percent = EXCLUDED.change_percent,
  volume = EXCLUDED.volume,
  high = EXCLUDED.high,
  low = EXCLUDED.low,
  open_price = EXCLUDED.open_price,
  bid = EXCLUDED.bid,
  ask = EXCLUDED.ask,
  timestamp = now();