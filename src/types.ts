export type AssetCategory = 'Stock' | 'ETF' | 'Crypto';

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  date: string;
  ticker: string;
  name: string;
  amount: number; // shares or units
  price: number; // price per share
  fee: number;
  tax: number;
  category: AssetCategory;
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
}
