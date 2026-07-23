export type AssetCategory = 'Stock' | 'ETF' | 'Crypto' | 'Bond' | 'Cash' | 'RealEstate' | 'P2P';

export type Sector = 'Technology' | 'Healthcare' | 'Financials' | 'Consumer' | 'Industrials' | 'Energy' | 'Utilities' | 'Real Estate' | 'Other';

export type Region = 'North America' | 'Europe' | 'Emerging Markets' | 'Asia Pacific' | 'Global' | 'Other';

export interface AssetMappingRule {
  id: string;
  pattern: string;
  ticker: string;
  name: string;
  category: AssetCategory;
  sector?: Sector;
  region?: Region;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'DEPOSIT' | 'WITHDRAWAL' | 'STAKING';
  date: string;
  ticker: string;
  name: string;
  amount: number; // shares or units, or cash amount for deposit/withdrawal
  price: number; // price per share, or 1 for cash
  fee: number;
  tax: number;
  category: AssetCategory;
  sector?: Sector;
  region?: Region;
  currency?: 'EUR' | 'USD' | 'CHF' | 'GBP';
  exchangeRate?: number; // how many currency units per EUR, e.g. 1.08 USD per 1 EUR
  notes?: string;
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
  assetGainEur?: number;
  fxGainEur?: number;
  cryptoTaxFreeShares?: number;
  sector?: Sector;
  region?: Region;
  teilfreistellungRate?: number; // e.g. 0.30 for 30% Equity ETF
  notes?: string;
  tags?: string[];
}

export interface TargetAllocation {
  category: AssetCategory;
  weight: number; // percentage (e.g. 70 for 70%)
}

export interface TaxLossPools {
  stockLossPool: number; // Aktien-Verlusttopf
  generalLossPool: number; // Sonstiger Verlusttopf
  vorabpauschaleEstimate: number; // Expected Vorabpauschale
  taxExemptionUsed: number; // Freistellungsauftrag genutzt
  teilfreistellungTaxSaved: number;
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
  stakingRewards?: number;
  vorabpauschaleEstimate?: number;
  stockLossPool?: number;
  generalLossPool?: number;
  teilfreistellungTaxSaved?: number;
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
  sector?: Sector;
  region?: Region;
}

export interface Portfolio {
  id: string;
  name: string;
  transactions: Transaction[];
  watchlist: WatchlistItem[];
  savingsPlans?: SavingsPlan[];
  targetAllocations?: TargetAllocation[];
  mappingRules?: AssetMappingRule[];
  taxLossPools?: TaxLossPools;
}

export interface BenchmarkSeries {
  name: string;
  ticker: string;
  color: string;
  data: { date: string; value: number; changePercent: number }[];
}

export interface MarketPriceData {
  ticker: string;
  price: number;
  change24h?: number;
  updatedAt: string;
}
