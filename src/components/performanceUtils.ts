import type { Transaction } from '../types';

export const DEFAULT_EXCHANGE_RATES = {
  EUR: 1.0,
  USD: 1.08,
  CHF: 0.96,
};

export function convertCurrency(
  amount: number,
  from: 'EUR' | 'USD' | 'CHF',
  to: 'EUR' | 'USD' | 'CHF',
  rateMap: Record<string, number> = DEFAULT_EXCHANGE_RATES
): number {
  if (from === to) return amount;
  // Convert from input currency to EUR
  const amountInEur = amount / (rateMap[from] || 1.0);
  // Convert from EUR to target currency
  return amountInEur * (rateMap[to] || 1.0);
}

// Convert string date DD.MM.YYYY to Date object
export function parseDateString(dateStr: string): Date {
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  return new Date(dateStr); // Fallback
}

/**
 * Calculates the Internal Rate of Return (IRR / Interner Zinsfuß) using Newton-Raphson method.
 * Cash flows:
 * - DEPOSIT/WITHDRAWAL are the external cash flows.
 * - If none exist, we treat BUY (negative) and SELL/DIVIDEND (positive) as cash flows.
 * - Final portfolio value + cash balance is a positive cash flow at the end.
 */
export function calculateIRR(
  transactions: Transaction[],
  currentPortfolioValue: number,
  cashBalance: number,
  rateMap: Record<string, number> = DEFAULT_EXCHANGE_RATES
): number {
  const finalValue = currentPortfolioValue + cashBalance;
  if (finalValue <= 0 || transactions.length === 0) return 0;

  // Determine external cash flows
  const hasDeposits = transactions.some(tx => tx.type === 'DEPOSIT' || tx.type === 'WITHDRAWAL');

  interface CashFlow {
    date: Date;
    amount: number; // Positive = money out of portfolio (return), Negative = money into portfolio (investment)
  }

  const flows: CashFlow[] = [];

  if (hasDeposits) {
    // Deposits are negative (money entering portfolio), withdrawals are positive
    transactions.forEach(tx => {
      const txDate = parseDateString(tx.date);
      const rate = tx.exchangeRate || rateMap[tx.currency || 'EUR'] || 1.0;
      const amountInEur = tx.amount / rate;

      if (tx.type === 'DEPOSIT') {
        flows.push({ date: txDate, amount: -amountInEur });
      } else if (tx.type === 'WITHDRAWAL') {
        flows.push({ date: txDate, amount: amountInEur });
      }
    });
  } else {
    // Fallback: use BUY (negative), SELL (positive), DIVIDEND (positive)
    transactions.forEach(tx => {
      const txDate = parseDateString(tx.date);
      const rate = tx.exchangeRate || rateMap[tx.currency || 'EUR'] || 1.0;
      const buyValue = (tx.amount * tx.price + tx.fee) / rate;
      const sellValue = (tx.amount * tx.price - tx.fee - tx.tax) / rate;
      const divValue = (tx.amount * tx.price - tx.tax) / rate;

      if (tx.type === 'BUY') {
        flows.push({ date: txDate, amount: -buyValue });
      } else if (tx.type === 'SELL') {
        flows.push({ date: txDate, amount: sellValue });
      } else if (tx.type === 'DIVIDEND') {
        flows.push({ date: txDate, amount: divValue });
      }
    });
  }

  if (flows.length === 0) return 0;

  // Sort flows chronologically
  flows.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Add the final valuation as a positive cash flow today
  const today = new Date();
  flows.push({ date: today, amount: finalValue });

  const firstDate = flows[0].date;

  // NPV calculation helper
  const npv = (rate: number): number => {
    let sum = 0;
    for (const flow of flows) {
      const years = (flow.date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      sum += flow.amount / Math.pow(1 + rate, years);
    }
    return sum;
  };

  // Derivative of NPV helper
  const npvDerivative = (rate: number): number => {
    let sum = 0;
    for (const flow of flows) {
      const years = (flow.date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (years === 0) continue;
      sum -= years * flow.amount / Math.pow(1 + rate, years + 1);
    }
    return sum;
  };

  // Newton-Raphson Solver
  let guess = 0.1; // 10% start guess
  const maxIterations = 100;
  const precision = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    const fVal = npv(guess);
    const dVal = npvDerivative(guess);
    if (Math.abs(dVal) < precision) break;

    const nextGuess = guess - fVal / dVal;
    if (Math.abs(nextGuess - guess) < precision) {
      return isNaN(nextGuess) || !isFinite(nextGuess) ? 0 : nextGuess * 100;
    }
    guess = nextGuess;
  }

  return isNaN(guess) || !isFinite(guess) ? 0 : guess * 100;
}

/**
 * Calculates the Time-Weighted Rate of Return (TTWRR).
 * For simplicity, we approximate TTWRR by daily/monthly sub-period performance.
 */
export function calculateTTWRR(
  transactions: Transaction[],
  currentPortfolioValue: number,
  cashBalance: number,
  rateMap: Record<string, number> = DEFAULT_EXCHANGE_RATES
): number {
  // Let's approximate using simple return if there are no complex movements,
  // or calculate the TWR based on deposits.
  const finalValue = currentPortfolioValue + cashBalance;
  if (finalValue <= 0) return 0;

  let totalDeposited = 0;
  const hasDeposits = transactions.some(tx => tx.type === 'DEPOSIT' || tx.type === 'WITHDRAWAL');

  if (hasDeposits) {
    transactions.forEach(tx => {
      const rate = tx.exchangeRate || rateMap[tx.currency || 'EUR'] || 1.0;
      const amountInEur = tx.amount / rate;
      if (tx.type === 'DEPOSIT') {
        totalDeposited += amountInEur;
      } else if (tx.type === 'WITHDRAWAL') {
        totalDeposited -= amountInEur;
      }
    });
  } else {
    transactions.forEach(tx => {
      const rate = tx.exchangeRate || rateMap[tx.currency || 'EUR'] || 1.0;
      if (tx.type === 'BUY') {
        totalDeposited += (tx.amount * tx.price + tx.fee) / rate;
      } else if (tx.type === 'SELL') {
        totalDeposited -= (tx.amount * tx.price - tx.fee - tx.tax) / rate;
      }
    });
  }

  if (totalDeposited <= 0) return 0;
  const returnRate = ((finalValue - totalDeposited) / totalDeposited) * 100;
  return returnRate;
}

/**
 * Calculates Maximum Drawdown
 */
export function calculateMaxDrawdown(values: number[]): number {
  if (values.length === 0) return 0;
  let peak = -Infinity;
  let maxDrawdown = 0;

  for (const val of values) {
    if (val > peak) {
      peak = val;
    }
    const dd = peak > 0 ? (peak - val) / peak : 0;
    if (dd > maxDrawdown) {
      maxDrawdown = dd;
    }
  }

  return maxDrawdown * 100;
}

/**
 * Calculates standard deviation / volatility of simulated/historical returns
 */
export function calculateVolatility(values: number[]): number {
  if (values.length < 2) return 0;
  
  // Calculate daily returns
  const returns: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1];
    if (prev > 0) {
      returns.push((values[i] - prev) / prev);
    }
  }

  if (returns.length === 0) return 0;
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  const dailyVol = Math.sqrt(variance);
  
  // Annualized Volatility (assuming 252 trading days)
  return dailyVol * Math.sqrt(252) * 100;
}

/**
 * Calculates Sharpe Ratio
 */
export function calculateSharpeRatio(
  annualReturnPercent: number,
  volatilityPercent: number,
  riskFreeRatePercent: number = 2.0
): number {
  if (volatilityPercent <= 0) return 0;
  return (annualReturnPercent - riskFreeRatePercent) / volatilityPercent;
}

/**
 * Calculate realized gains for tax purposes using FIFO (First-In, First-Out).
 */
export function calculateRealizedGains(
  transactions: Transaction[],
  rateMap: Record<string, number> = DEFAULT_EXCHANGE_RATES
): number {
  let totalRealizedGains = 0;
  
  // Track individual buy lots per ticker for FIFO
  const buyLots: Record<string, Array<{ date: Date; amount: number; price: number; fee: number; rate: number }>> = {};
  
  const sortedTxs = [...transactions].sort((a, b) => {
    const dateA = a.date.split('.').reverse().join('-');
    const dateB = b.date.split('.').reverse().join('-');
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  sortedTxs.forEach(tx => {
    const rate = tx.exchangeRate || rateMap[tx.currency || 'EUR'] || 1.0;
    
    if (tx.type === 'BUY') {
      if (!buyLots[tx.ticker]) {
        buyLots[tx.ticker] = [];
      }
      buyLots[tx.ticker].push({
        date: parseDateString(tx.date),
        amount: tx.amount,
        price: tx.price,
        fee: tx.fee,
        rate
      });
    } else if (tx.type === 'SELL') {
      let remainingToSell = tx.amount;
      let revenue = (tx.amount * tx.price - tx.fee - tx.tax) / rate;
      let costBasis = 0;
      
      const lots = buyLots[tx.ticker] || [];
      while (remainingToSell > 0.000001 && lots.length > 0) {
        const oldestLot = lots[0];
        
        if (oldestLot.amount <= remainingToSell) {
          // Consume whole lot
          const lotCost = (oldestLot.amount * oldestLot.price + oldestLot.fee) / oldestLot.rate;
          costBasis += lotCost;
          remainingToSell -= oldestLot.amount;
          lots.shift(); // Remove lot
        } else {
          // Consume part of the lot
          const fraction = remainingToSell / oldestLot.amount;
          const lotCostFraction = (remainingToSell * oldestLot.price + oldestLot.fee * fraction) / oldestLot.rate;
          costBasis += lotCostFraction;
          
          // Reduce lot size
          oldestLot.amount -= remainingToSell;
          oldestLot.fee -= oldestLot.fee * fraction;
          remainingToSell = 0;
        }
      }
      
      if (remainingToSell < tx.amount) {
        // If we sold anything, calculate gain
        const gain = revenue - costBasis;
        totalRealizedGains += gain;
      }
    }
  });

  return totalRealizedGains;
}

export interface GermanTaxCalculationResult {
  realizedGainsRaw: number;
  taxableGains: number; // After Teilfreistellung & Crypto > 1y rule
  withholdingTaxEstimate: number; // 26.375% of taxable gains exceeding exemption
  taxExemptionRemaining: number;
}

/**
 * Calculates German Capital Gains Tax details based on FIFO and partial exemptions (Teilfreistellung).
 */
export function calculateGermanTax(
  transactions: Transaction[],
  exemptionLimit: number = 1000,
  rateMap: Record<string, number> = DEFAULT_EXCHANGE_RATES
): GermanTaxCalculationResult {
  let realizedGainsRaw = 0;
  let taxableGains = 0;

  const buyLots: Record<string, Array<{ date: Date; amount: number; price: number; fee: number; rate: number }>> = {};
  
  const sortedTxs = [...transactions].sort((a, b) => {
    const dateA = a.date.split('.').reverse().join('-');
    const dateB = b.date.split('.').reverse().join('-');
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  sortedTxs.forEach(tx => {
    const rate = tx.exchangeRate || rateMap[tx.currency || 'EUR'] || 1.0;
    
    if (tx.type === 'BUY') {
      if (!buyLots[tx.ticker]) {
        buyLots[tx.ticker] = [];
      }
      buyLots[tx.ticker].push({
        date: parseDateString(tx.date),
        amount: tx.amount,
        price: tx.price,
        fee: tx.fee,
        rate
      });
    } else if (tx.type === 'SELL') {
      let remainingToSell = tx.amount;
      const sellDate = parseDateString(tx.date);
      let taxableGainForTx = 0;
      let rawGainForTx = 0;
      
      const lots = buyLots[tx.ticker] || [];
      while (remainingToSell > 0.000001 && lots.length > 0) {
        const oldestLot = lots[0];
        const holdingDurationDays = (sellDate.getTime() - oldestLot.date.getTime()) / (1000 * 60 * 60 * 24);
        
        // Check partial exemptions (Teilfreistellung) under German tax law
        let exemptionFactor = 0.0; // 0% tax free for stocks
        if (tx.category === 'ETF') {
          exemptionFactor = 0.30; // 30% tax-free for Equity ETFs
        } else if (tx.category === 'Crypto') {
          if (holdingDurationDays > 365) {
            exemptionFactor = 1.0; // 100% tax-free if held > 1 year in Germany
          }
        }

        if (oldestLot.amount <= remainingToSell) {
          const lotCost = (oldestLot.amount * oldestLot.price + oldestLot.fee) / oldestLot.rate;
          const lotRev = (oldestLot.amount * tx.price - tx.fee * (oldestLot.amount / tx.amount)) / rate;
          const lotGain = lotRev - lotCost;
          
          rawGainForTx += lotGain;
          taxableGainForTx += lotGain * (1 - exemptionFactor);
          
          remainingToSell -= oldestLot.amount;
          lots.shift();
        } else {
          const fraction = remainingToSell / oldestLot.amount;
          const lotCostFraction = (remainingToSell * oldestLot.price + oldestLot.fee * fraction) / oldestLot.rate;
          const lotRevFraction = (remainingToSell * tx.price - tx.fee * (remainingToSell / tx.amount)) / rate;
          const lotGainFraction = lotRevFraction - lotCostFraction;
          
          rawGainForTx += lotGainFraction;
          taxableGainForTx += lotGainFraction * (1 - exemptionFactor);
          
          oldestLot.amount -= remainingToSell;
          oldestLot.fee -= oldestLot.fee * fraction;
          remainingToSell = 0;
        }
      }
      
      realizedGainsRaw += rawGainForTx;
      taxableGains += Math.max(0, taxableGainForTx);
    } else if (tx.type === 'DIVIDEND') {
      // Dividends are fully taxable (with ETF exemption if applicable)
      const divRevenue = ((tx.amount * tx.price) - tx.tax) / rate;
      let exemptionFactor = 0.0;
      if (tx.category === 'ETF') exemptionFactor = 0.30;
      
      realizedGainsRaw += divRevenue;
      taxableGains += divRevenue * (1 - exemptionFactor);
    }
  });

  const taxableGainsExceedingExemption = Math.max(0, taxableGains - exemptionLimit);
  const withholdingTaxEstimate = taxableGainsExceedingExemption * 0.26375; // 25% KapESt + 5.5% Soli on KapESt
  const taxExemptionRemaining = Math.max(0, exemptionLimit - taxableGains);

  return {
    realizedGainsRaw,
    taxableGains,
    withholdingTaxEstimate,
    taxExemptionRemaining
  };
}

/**
 * Calculates the amount of crypto shares/units that have been held for more than 365 days.
 */
export function calculateCryptoTaxFreeShares(
  transactions: Transaction[],
  ticker: string,
  asOfDate: Date = new Date()
): number {
  const buyLots: Array<{ date: Date; amount: number }> = [];

  const sortedTxs = [...transactions]
    .filter(t => t.ticker === ticker)
    .sort((a, b) => {
      const dateA = a.date.split('.').reverse().join('-');
      const dateB = b.date.split('.').reverse().join('-');
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

  sortedTxs.forEach(tx => {
    if (tx.type === 'BUY' || tx.type === 'STAKING') {
      buyLots.push({
        date: parseDateString(tx.date),
        amount: tx.amount
      });
    } else if (tx.type === 'SELL') {
      let remainingToSell = tx.amount;
      while (remainingToSell > 0.000001 && buyLots.length > 0) {
        const oldest = buyLots[0];
        if (oldest.amount <= remainingToSell) {
          remainingToSell -= oldest.amount;
          buyLots.shift();
        } else {
          oldest.amount -= remainingToSell;
          remainingToSell = 0;
        }
      }
    }
  });

  // Count remaining shares that are older than 365 days
  let taxFreeShares = 0;
  buyLots.forEach(lot => {
    const ageDays = (asOfDate.getTime() - lot.date.getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 365) {
      taxFreeShares += lot.amount;
    }
  });

  return taxFreeShares;
}

export interface FxGainBreakdown {
  assetGainEur: number;
  fxGainEur: number;
}

/**
 * Calculates the separate impact of asset price changes and exchange rate moves.
 */
export function calculateFXGainBreakdown(
  transactions: Transaction[],
  ticker: string,
  currentPrice: number, // in the asset's transaction currency (e.g. USD price for AAPL)
  currentExchangeRate: number, // current rate (units of foreign currency per EUR)
  rateMap: Record<string, number> = DEFAULT_EXCHANGE_RATES
): FxGainBreakdown {
  // Filter and sort transactions chronologically
  const assetTxs = [...transactions]
    .filter(t => t.ticker === ticker)
    .sort((a, b) => {
      const dateA = a.date.split('.').reverse().join('-');
      const dateB = b.date.split('.').reverse().join('-');
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

  let totalShares = 0;
  let totalCostEur = 0;
  let totalCostAtBuyExchangeRateEur = 0;

  assetTxs.forEach(tx => {
    if (tx.type === 'BUY') {
      const rate = tx.exchangeRate || rateMap[tx.currency || 'EUR'] || 1.0;
      const costEur = (tx.amount * tx.price + tx.fee) / rate;
      
      totalShares += tx.amount;
      totalCostEur += costEur;
      totalCostAtBuyExchangeRateEur += costEur;
    } else if (tx.type === 'SELL') {
      const avgCostEur = totalShares > 0 ? (totalCostEur / totalShares) : 0;
      const avgCostAtBuyExchangeRateEur = totalShares > 0 ? (totalCostAtBuyExchangeRateEur / totalShares) : 0;

      totalShares = Math.max(0, totalShares - tx.amount);
      totalCostEur = totalShares * avgCostEur;
      totalCostAtBuyExchangeRateEur = totalShares * avgCostAtBuyExchangeRateEur;
    }
  });

  if (totalShares <= 0) {
    return { assetGainEur: 0, fxGainEur: 0 };
  }

  // Current value in EUR at current exchange rate
  const currentValueEur = (totalShares * currentPrice) / currentExchangeRate;

  // Value in EUR assuming exchange rate remained constant at average purchase rate 
  // Let's approximate the average exchange rate used for buys
  let sumExchangeRates = 0;
  let buyCount = 0;
  assetTxs.forEach(tx => {
    if (tx.type === 'BUY') {
      sumExchangeRates += (tx.exchangeRate || rateMap[tx.currency || 'EUR'] || 1.0);
      buyCount++;
    }
  });
  const avgBuyRate = buyCount > 0 ? (sumExchangeRates / buyCount) : currentExchangeRate;

  const valueAtBuyExchangeRateEur = (totalShares * currentPrice) / avgBuyRate;

  const totalGainEur = currentValueEur - totalCostEur;
  const assetGainEur = valueAtBuyExchangeRateEur - totalCostEur;
  const fxGainEur = totalGainEur - assetGainEur;

  return {
    assetGainEur,
    fxGainEur
  };
}


