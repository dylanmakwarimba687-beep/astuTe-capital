// Alpaca API integration for broker connectivity
interface AlpacaConfig {
  keyId: string
  secretKey: string
  baseUrl: string
  paper: boolean
}

class AlpacaClient {
  private config: AlpacaConfig
  private headers: Record<string, string>

  constructor(config: AlpacaConfig) {
    this.config = config
    this.headers = {
      'APCA-API-KEY-ID': config.keyId,
      'APCA-API-SECRET-KEY': config.secretKey,
      'Content-Type': 'application/json',
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Alpaca API request failed:', error)
      throw error
    }
  }

  // Account methods
  async getAccount() {
    return this.request('/v2/account')
  }

  async getPositions() {
    return this.request('/v2/positions')
  }

  async getOrders() {
    return this.request('/v2/orders')
  }

  // Market data methods
  async getLatestTrade(symbol: string) {
    return this.request(`/v2/stocks/${symbol}/trades/latest`)
  }

  async getLatestQuote(symbol: string) {
    return this.request(`/v2/stocks/${symbol}/quotes/latest`)
  }

  async getBars(symbol: string, timeframe: string, start?: string, end?: string) {
    const params = new URLSearchParams({
      symbols: symbol,
      timeframe,
      ...(start && { start }),
      ...(end && { end }),
    })
    return this.request(`/v2/stocks/bars?${params}`)
  }

  // Trading methods
  async createOrder(orderData: {
    symbol: string
    qty: number
    side: 'buy' | 'sell'
    type: 'market' | 'limit' | 'stop' | 'stop_limit'
    time_in_force?: 'day' | 'gtc' | 'ioc' | 'fok'
    limit_price?: number
    stop_price?: number
  }) {
    return this.request('/v2/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async cancelOrder(orderId: string) {
    return this.request(`/v2/orders/${orderId}`, {
      method: 'DELETE',
    })
  }

  async closePosition(symbol: string) {
    return this.request(`/v2/positions/${symbol}`, {
      method: 'DELETE',
    })
  }
}

// Create Alpaca client instance
export const createAlpacaClient = (credentials?: {
  keyId: string
  secretKey: string
}): AlpacaClient => {
  const config: AlpacaConfig = {
    keyId: credentials?.keyId || import.meta.env.VITE_ALPACA_KEY_ID || 'demo',
    secretKey: credentials?.secretKey || import.meta.env.VITE_ALPACA_SECRET_KEY || 'demo',
    baseUrl: import.meta.env.VITE_ALPACA_BASE_URL || 'https://paper-api.alpaca.markets',
    paper: true, // Always use paper trading for safety
  }

  return new AlpacaClient(config)
}

// Default client for demo mode
export const alpacaClient = createAlpacaClient()