import type { AssetCategory, Sector, Region } from '../types';

export interface IsinMetadata {
  isin: string;
  ticker: string;
  name: string;
  category: AssetCategory;
  sector: Sector;
  region: Region;
  terPercent?: number; // Total Expense Ratio for ETFs
  isDistributing?: boolean; // Ausschüttend vs. Thesaurierend
}

// Built-in high-accuracy directory of top European & Global ETFs and Stocks
export const ISIN_DATABASE: Record<string, Partial<IsinMetadata>> = {
  // Global & US ETFs
  'IE00B4L5Y983': { ticker: 'EUNL', name: 'iShares Core MSCI World UCITS ETF', category: 'ETF', sector: 'Financials', region: 'Global', terPercent: 0.20, isDistributing: false },
  'IE00B3RBWM25': { ticker: 'VWRL', name: 'Vanguard FTSE All-World UCITS ETF (Dist)', category: 'ETF', sector: 'Financials', region: 'Global', terPercent: 0.22, isDistributing: true },
  'IE00BK5BQT80': { ticker: 'VWCE', name: 'Vanguard FTSE All-World UCITS ETF (Acc)', category: 'ETF', sector: 'Financials', region: 'Global', terPercent: 0.22, isDistributing: false },
  'IE00B3XXRP09': { ticker: 'VUSA', name: 'Vanguard S&P 500 UCITS ETF', category: 'ETF', sector: 'Technology', region: 'North America', terPercent: 0.07, isDistributing: true },
  'IE00B5BMR087': { ticker: 'SXR8', name: 'iShares Core S&P 500 UCITS ETF', category: 'ETF', sector: 'Technology', region: 'North America', terPercent: 0.07, isDistributing: false },
  'IE00B53SZB19': { ticker: 'IS3N', name: 'iShares Core MSCI Emerging Markets IMI', category: 'ETF', sector: 'Financials', region: 'Emerging Markets', terPercent: 0.18, isDistributing: false },
  'LU0274208692': { ticker: 'DBX1', name: 'Xtrackers DAX UCITS ETF', category: 'ETF', sector: 'Industrials', region: 'Europe', terPercent: 0.09, isDistributing: false },
  'IE00B0M62Q58': { ticker: 'IQQQ', name: 'iShares NASDAQ-100 UCITS ETF', category: 'ETF', sector: 'Technology', region: 'North America', terPercent: 0.33, isDistributing: true },
  'IE00B4X9L533': { ticker: 'HIGH', name: 'iShares European Property Yield', category: 'ETF', sector: 'Real Estate', region: 'Europe', terPercent: 0.40, isDistributing: true },
  'LU0290358497': { ticker: 'DBXG', name: 'Xtrackers Euro Stoxx 50', category: 'ETF', sector: 'Financials', region: 'Europe', terPercent: 0.09, isDistributing: false },

  // Big Tech & US Equities
  'US0378331002': { ticker: 'AAPL', name: 'Apple Inc.', category: 'Stock', sector: 'Technology', region: 'North America' },
  'US5949181045': { ticker: 'MSFT', name: 'Microsoft Corp.', category: 'Stock', sector: 'Technology', region: 'North America' },
  'US67066G1040': { ticker: 'NVDA', name: 'NVIDIA Corp.', category: 'Stock', sector: 'Technology', region: 'North America' },
  'US0231351067': { ticker: 'AMZN', name: 'Amazon.com Inc.', category: 'Stock', sector: 'Consumer', region: 'North America' },
  'US02079K3059': { ticker: 'GOOGL', name: 'Alphabet Inc. (Class A)', category: 'Stock', sector: 'Communication', region: 'North America' },
  'US88160R1014': { ticker: 'TSLA', name: 'Tesla Inc.', category: 'Stock', sector: 'Consumer', region: 'North America' },
  'US30303M1027': { ticker: 'META', name: 'Meta Platforms Inc.', category: 'Stock', sector: 'Communication', region: 'North America' },
  'US92826C8394': { ticker: 'V', name: 'Visa Inc.', category: 'Stock', sector: 'Financials', region: 'North America' },

  // European Bluechips (DAX / EuroStoxx)
  'DE0008404005': { ticker: 'ALV', name: 'Allianz SE', category: 'Stock', sector: 'Financials', region: 'Europe' },
  'DE0007236101': { ticker: 'SIE', name: 'Siemens AG', category: 'Stock', sector: 'Industrials', region: 'Europe' },
  'DE0007164600': { ticker: 'MBG', name: 'Mercedes-Benz Group AG', category: 'Stock', sector: 'Consumer', region: 'Europe' },
  'DE0007100000': { ticker: 'DAI', name: 'Daimler Truck Holding AG', category: 'Stock', sector: 'Industrials', region: 'Europe' },
  'DE000BAY0017': { ticker: 'BAYN', name: 'Bayer AG', category: 'Stock', sector: 'Healthcare', region: 'Europe' },
  'DE0007037129': { ticker: 'RWE', name: 'RWE AG', category: 'Stock', sector: 'Utilities', region: 'Europe' },
  'DE000BASF111': { ticker: 'BAS', name: 'BASF SE', category: 'Stock', sector: 'Materials', region: 'Europe' },
  'DE000SAP0008': { ticker: 'SAP', name: 'SAP SE', category: 'Stock', sector: 'Technology', region: 'Europe' },
  'NL0010273215': { ticker: 'ASML', name: 'ASML Holding NV', category: 'Stock', sector: 'Technology', region: 'Europe' },
  'FR0000121014': { ticker: 'MC', name: 'LVMH Moët Hennessy', category: 'Stock', sector: 'Consumer', region: 'Europe' },
  'CH0038863350': { ticker: 'NESN', name: 'Nestlé S.A.', category: 'Stock', sector: 'Consumer', region: 'Europe' },
  'CH0012005267': { ticker: 'NOVN', name: 'Novartis AG', category: 'Stock', sector: 'Healthcare', region: 'Europe' }
};

/**
 * Enriches holding metadata based on ISIN or Ticker lookup
 */
export function lookupIsinMetadata(identifier: string, currentName: string = ''): Partial<IsinMetadata> {
  const cleanId = identifier.trim().toUpperCase();

  // 1. Direct ISIN match
  if (ISIN_DATABASE[cleanId]) {
    return ISIN_DATABASE[cleanId];
  }

  // 2. Direct Ticker match
  const matchByTicker = Object.values(ISIN_DATABASE).find(item => item.ticker === cleanId);
  if (matchByTicker) return matchByTicker;

  // 3. Heuristic classification based on name
  const nameLower = (currentName + ' ' + identifier).toLowerCase();

  let category: AssetCategory = 'Stock';
  if (nameLower.includes('etf') || nameLower.includes('ucits') || nameLower.includes('ishares') || nameLower.includes('vanguard') || nameLower.includes('xtrackers')) {
    category = 'ETF';
  } else if (nameLower.includes('bitcoin') || nameLower.includes('ethereum') || cleanId === 'BTC' || cleanId === 'ETH' || cleanId === 'SOL') {
    category = 'Crypto';
  }

  let sector: Sector = 'Other';
  const nameOnly = currentName.toLowerCase();
  if (nameOnly.includes('energy') || nameOnly.includes('clean energy') || nameOnly.includes('oil') || nameOnly.includes('solar')) sector = 'Energy';
  else if (nameLower.includes('tech') || nameLower.includes('software') || nameLower.includes('semi') || nameLower.includes('cloud')) sector = 'Technology';
  else if (nameLower.includes('health') || nameLower.includes('pharma') || nameLower.includes('bio')) sector = 'Healthcare';
  else if (nameLower.includes('bank') || nameLower.includes('allianz') || nameLower.includes('finance') || nameLower.includes('insurance')) sector = 'Financials';
  else if (nameLower.includes('energy') || nameLower.includes('oil') || nameLower.includes('gas') || nameLower.includes('solar')) sector = 'Energy';
  else if (nameLower.includes('estate') || nameLower.includes('reit') || nameLower.includes('immo') || nameLower.includes('property')) sector = 'Real Estate';
  else if (nameLower.includes('auto') || nameLower.includes('consumer') || nameLower.includes('retail')) sector = 'Consumer';
  else if (nameLower.includes('industrial') || nameLower.includes('aero') || nameLower.includes('defense')) sector = 'Industrials';

  let region: Region = 'Global';
  if (cleanId.startsWith('US') || cleanId.startsWith('CA')) region = 'North America';
  else if (cleanId.startsWith('DE') || cleanId.startsWith('FR') || cleanId.startsWith('NL') || cleanId.startsWith('CH') || cleanId.startsWith('GB')) region = 'Europe';
  else if (cleanId.startsWith('LU') || cleanId.startsWith('IE')) {
    region = nameLower.includes('world') ? 'Global' : nameLower.includes('s&p 500') || nameLower.includes('nasdaq') ? 'North America' : 'Europe';
  }

  return {
    category,
    sector,
    region
  };
}
