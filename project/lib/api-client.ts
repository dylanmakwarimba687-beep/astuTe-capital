"use client"

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" })
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" })
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.post("/auth/login", { email, password })
  }

  async signup(userData: any) {
    return this.post("/auth/signup", userData)
  }

  async validateToken() {
    return this.get("/auth/validate")
  }

  // Trading methods
  async getPortfolio() {
    return this.get("/portfolio")
  }

  async getPositions() {
    return this.get("/positions")
  }

  async getOrders() {
    return this.get("/orders")
  }

  async placeOrder(orderData: any) {
    return this.post("/orders", orderData)
  }

  async cancelOrder(orderId: string) {
    return this.delete(`/orders/${orderId}`)
  }

  // Market data methods
  async getMarketData(symbols: string[]) {
    return this.get(`/market-data?symbols=${symbols.join(",")}`)
  }

  async getSignals() {
    return this.get("/signals")
  }

  async getNews() {
    return this.get("/news")
  }
}

export const apiClient = new ApiClient()
