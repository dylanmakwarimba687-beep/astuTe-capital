-- Create market data tables for storing real-time and historical data
CREATE TABLE IF NOT EXISTS market_symbols (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255),
    exchange VARCHAR(50),
    sector VARCHAR(100),
    market_cap BIGINT,
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create real-time market data table
CREATE TABLE IF NOT EXISTS market_data_realtime (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    price DECIMAL(15,6) NOT NULL,
    bid DECIMAL(15,6),
    ask DECIMAL(15,6),
    volume BIGINT,
    high DECIMAL(15,6),
    low DECIMAL(15,6),
    open_price DECIMAL(15,6),
    close_price DECIMAL(15,6),
    change_amount DECIMAL(15,6),
    change_percent DECIMAL(8,4),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (symbol) REFERENCES market_symbols(symbol)
);

-- Create historical candlestick data table
CREATE TABLE IF NOT EXISTS market_data_historical (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    timeframe VARCHAR(10) NOT NULL, -- 1m, 5m, 15m, 1h, 4h, 1d
    timestamp TIMESTAMP NOT NULL,
    open_price DECIMAL(15,6) NOT NULL,
    high_price DECIMAL(15,6) NOT NULL,
    low_price DECIMAL(15,6) NOT NULL,
    close_price DECIMAL(15,6) NOT NULL,
    volume BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (symbol) REFERENCES market_symbols(symbol),
    UNIQUE(symbol, timeframe, timestamp)
);

-- Create market depth/order book table
CREATE TABLE IF NOT EXISTS market_depth (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    side VARCHAR(4) NOT NULL, -- 'bid' or 'ask'
    price DECIMAL(15,6) NOT NULL,
    size DECIMAL(15,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (symbol) REFERENCES market_symbols(symbol)
);

-- Create user watchlists table
CREATE TABLE IF NOT EXISTS user_watchlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) DEFAULT 'Default',
    symbols TEXT[], -- Array of symbols
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create market alerts table
CREATE TABLE IF NOT EXISTS market_alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    alert_type VARCHAR(20) NOT NULL, -- 'price_above', 'price_below', 'volume_spike', etc.
    target_value DECIMAL(15,6) NOT NULL,
    current_value DECIMAL(15,6),
    is_triggered BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    triggered_at TIMESTAMP,
    FOREIGN KEY (symbol) REFERENCES market_symbols(symbol)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_data_realtime_symbol ON market_data_realtime(symbol);
CREATE INDEX IF NOT EXISTS idx_market_data_realtime_timestamp ON market_data_realtime(timestamp);
CREATE INDEX IF NOT EXISTS idx_market_data_historical_symbol_timeframe ON market_data_historical(symbol, timeframe);
CREATE INDEX IF NOT EXISTS idx_market_data_historical_timestamp ON market_data_historical(timestamp);
CREATE INDEX IF NOT EXISTS idx_market_depth_symbol ON market_depth(symbol);
CREATE INDEX IF NOT EXISTS idx_user_watchlists_user_id ON user_watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_market_alerts_user_id ON market_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_market_alerts_symbol ON market_alerts(symbol);

-- Insert sample market symbols
INSERT INTO market_symbols (symbol, name, exchange, sector) VALUES
('AAPL', 'Apple Inc.', 'NASDAQ', 'Technology'),
('GOOGL', 'Alphabet Inc.', 'NASDAQ', 'Technology'),
('TSLA', 'Tesla Inc.', 'NASDAQ', 'Automotive'),
('MSFT', 'Microsoft Corporation', 'NASDAQ', 'Technology'),
('NVDA', 'NVIDIA Corporation', 'NASDAQ', 'Technology'),
('EUR/USD', 'Euro/US Dollar', 'FOREX', 'Currency'),
('GBP/USD', 'British Pound/US Dollar', 'FOREX', 'Currency'),
('BTC/USD', 'Bitcoin/US Dollar', 'CRYPTO', 'Cryptocurrency')
ON CONFLICT (symbol) DO NOTHING;

-- Insert sample real-time data
INSERT INTO market_data_realtime (symbol, price, bid, ask, volume, high, low, open_price, change_amount, change_percent) VALUES
('AAPL', 175.43, 175.42, 175.44, 45200000, 177.25, 173.10, 174.50, 2.34, 1.35),
('GOOGL', 2847.92, 2847.90, 2847.94, 1200000, 2865.00, 2840.50, 2863.59, -15.67, -0.55),
('TSLA', 248.50, 248.48, 248.52, 28900000, 252.80, 245.20, 239.58, 8.92, 3.72),
('MSFT', 378.85, 378.83, 378.87, 22100000, 380.45, 376.20, 374.64, 4.21, 1.12),
('NVDA', 456.78, 456.76, 456.80, 35700000, 460.25, 452.30, 444.33, 12.45, 2.80),
('EUR/USD', 1.0845, 1.0844, 1.0846, 2100000000, 1.0868, 1.0832, 1.0868, -0.0023, -0.21),
('GBP/USD', 1.2634, 1.2633, 1.2635, 1800000000, 1.2648, 1.2615, 1.2589, 0.0045, 0.36),
('BTC/USD', 43250.00, 43248.50, 43251.50, 890000000, 43850.00, 41980.00, 42000.00, 1250.00, 2.98)
ON CONFLICT DO NOTHING;
