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
 * Calculate realized gains for tax purposes
 * (from SELL transactions)
 */
export function calculateRealizedGains(
  transactions: Transaction[],
  rateMap: Record<string, number> = DEFAULT_EXCHANGE_RATES
): number {
  let realized = 0;
  
  // Track buy history to match against sells (FIFO or average cost basis)
  // Let's use average cost basis per asset category for simplicity
  const buyCostBasis: Record<string, { totalShares: number; totalCost: number }> = {};
  
  const sortedTxs = [...transactions].sort((a, b) => {
    const dateA = a.date.split('.').reverse().join('-');
    const dateB = b.date.split('.').reverse().join('-');
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  sortedTxs.forEach(tx => {
    const rate = tx.exchangeRate || rateMap[tx.currency || 'EUR'] || 1.0;
    if (tx.type === 'BUY') {
      if (!buyCostBasis[tx.ticker]) {
        buyCostBasis[tx.ticker] = { totalShares: 0, totalCost: 0 };
      }
      const cost = (tx.amount * tx.price + tx.fee) / rate;
      buyCostBasis[tx.ticker].totalShares += tx.amount;
      buyCostBasis[tx.ticker].totalCost += cost;
    } else if (tx.type === 'SELL') {
      const stats = buyCostBasis[tx.ticker];
      if (stats && stats.totalShares > 0) {
        const avgPrice = stats.totalCost / stats.totalShares;
        const sellRevenue = (tx.amount * tx.price - tx.fee - tx.tax) / rate;
        const buyCostOfSold = tx.amount * avgPrice;
        
        realized += (sellRevenue - buyCostOfSold);
        
        // Update cost basis
        stats.totalShares = Math.max(0, stats.totalShares - tx.amount);
        stats.totalCost = stats.totalShares * avgPrice;
      }
    }
  });

  return realized;
}
