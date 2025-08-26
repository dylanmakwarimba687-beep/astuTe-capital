-- Create users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(10) DEFAULT 'dark',
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(10) DEFAULT 'EST',
    notifications_signals BOOLEAN DEFAULT true,
    notifications_trades BOOLEAN DEFAULT true,
    notifications_news BOOLEAN DEFAULT true,
    notifications_system BOOLEAN DEFAULT false,
    chart_default_type VARCHAR(20) DEFAULT 'candlestick',
    chart_timeframe VARCHAR(10) DEFAULT '1h',
    chart_indicators TEXT[], -- Array of preferred indicators
    trading_confirm_orders BOOLEAN DEFAULT true,
    trading_default_quantity INTEGER DEFAULT 100,
    trading_risk_management BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create broker_connections table
CREATE TABLE IF NOT EXISTS broker_connections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    broker_name VARCHAR(100) NOT NULL,
    account_id VARCHAR(100) NOT NULL,
    api_key_encrypted TEXT,
    api_secret_encrypted TEXT,
    status VARCHAR(20) DEFAULT 'disconnected', -- connected, disconnected, error
    balance DECIMAL(15,2) DEFAULT 0.00,
    last_sync TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL, -- signal, trade, news, system
    priority VARCHAR(10) DEFAULT 'medium', -- high, medium, low
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table for JWT token management
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_broker_connections_user_id ON broker_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions(token_hash);

-- Insert sample data for testing
INSERT INTO users (first_name, last_name, email, password_hash, created_at) VALUES
('John', 'Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', NOW()),
('Jane', 'Smith', 'jane@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert default preferences for sample users
INSERT INTO user_preferences (user_id, theme, currency, timezone) 
SELECT id, 'dark', 'USD', 'EST' FROM users WHERE email IN ('john@example.com', 'jane@example.com')
ON CONFLICT DO NOTHING;

-- Insert sample broker connections
INSERT INTO broker_connections (user_id, broker_name, account_id, status, balance)
SELECT id, 'TD Ameritrade', '123456789', 'connected', 45230.50 FROM users WHERE email = 'john@example.com'
ON CONFLICT DO NOTHING;
