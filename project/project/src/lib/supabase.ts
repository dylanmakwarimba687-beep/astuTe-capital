import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth helpers
export const auth = {
  signUp: (email: string, password: string, metadata?: Record<string, any>) =>
    supabase.auth.signUp({ email, password, options: { data: metadata } }),
  
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  
  signOut: () => supabase.auth.signOut(),
  
  getUser: () => supabase.auth.getUser(),
  
  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback),
}

// Database helpers
export const db = {
  // Users
  createUser: (userData: any) =>
    supabase.from('users').insert(userData).select().single(),
  
  updateUser: (id: string, updates: any) =>
    supabase.from('users').update(updates).eq('id', id).select().single(),
  
  getUser: (id: string) =>
    supabase.from('users').select('*').eq('id', id).single(),
  
  // Portfolio
  getPortfolio: (userId: string) =>
    supabase.from('portfolios').select('*').eq('user_id', userId).single(),
  
  updatePortfolio: (userId: string, portfolioData: any) =>
    supabase.from('portfolios').upsert({ user_id: userId, ...portfolioData }),
  
  // Positions
  getPositions: (userId: string) =>
    supabase.from('positions').select('*').eq('user_id', userId),
  
  createPosition: (positionData: any) =>
    supabase.from('positions').insert(positionData).select().single(),
  
  updatePosition: (id: string, updates: any) =>
    supabase.from('positions').update(updates).eq('id', id).select().single(),
  
  deletePosition: (id: string) =>
    supabase.from('positions').delete().eq('id', id),
  
  // Orders
  getOrders: (userId: string) =>
    supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  
  createOrder: (orderData: any) =>
    supabase.from('orders').insert(orderData).select().single(),
  
  updateOrder: (id: string, updates: any) =>
    supabase.from('orders').update(updates).eq('id', id).select().single(),
  
  // Watchlist
  getWatchlist: (userId: string) =>
    supabase.from('watchlists').select('*').eq('user_id', userId),
  
  addToWatchlist: (userId: string, symbol: string) =>
    supabase.from('watchlists').insert({ user_id: userId, symbol }),
  
  removeFromWatchlist: (userId: string, symbol: string) =>
    supabase.from('watchlists').delete().eq('user_id', userId).eq('symbol', symbol),
}