export type AssetCategory = 'Stock' | 'ETF' | 'Crypto';

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'DEPOSIT' | 'WITHDRAWAL';
  date: string;
  ticker: string;
  name: string;
  amount: number; // shares or units, or cash amount for deposit/withdrawal
  price: number; // price per share, or 1 for cash
  fee: number;
  tax: number;
  category: AssetCategory;
  currency?: 'EUR' | 'USD' | 'CHF';
  exchangeRate?: number; // how many currency units per EUR, e.g. 1.08 USD per 1 EUR
}

export interface Holding {
  ticker: string;
  name: string;
  category: AssetCategory;
  shares: number;
  averageBuyPrice: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  totalGain: number;
  totalGainPercent: number;
  portfolioWeight: number;
  yieldOnCost: number;
}

export interface TargetAllocation {
  category: AssetCategory;
  weight: number; // percentage (e.g. 70 for 70%)
}

export interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalGains: number;
  totalGainsPercent: number;
  dividendsReceived: number;
  cashBalance: number;
  irr: number;
  ttwrr: number;
  maxDrawdown: number;
  sharpeRatio: number;
  realizedGains: number;
  taxExemptionUsed: number;
}

export interface WatchlistItem {
  id: string;
  ticker: string;
  name: string;
  category: AssetCategory;
  targetPrice: number;
  notes?: string;
  addedAt: string;
}

export interface SavingsPlan {
  id: string;
  ticker: string;
  name: string;
  category: AssetCategory;
  amount: number; // monthly savings rate
  isActive: boolean;
}

export interface Portfolio {
  id: string;
  name: string;
  transactions: Transaction[];
  watchlist: WatchlistItem[];
  savingsPlans?: SavingsPlan[];
  targetAllocations?: TargetAllocation[];
}


