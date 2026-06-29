import { useState, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { Holdings } from './components/Holdings';
import { Transactions } from './components/Transactions';
import { Strategy } from './components/Strategy';
import type { Transaction, Holding, PortfolioStats } from './types';
import { Wallet, PieChart, Activity, Sliders } from 'lucide-react';
import './App.css';

// Initial Mock Data
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'BUY',
    date: '15.01.2026',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    amount: 15,
    price: 172.50,
    fee: 1.00,
    tax: 0,
    category: 'Stock'
  },
  {
    id: 'tx-2',
    type: 'BUY',
    date: '20.02.2026',
    ticker: 'EUNL',
    name: 'iShares Core MSCI World ETF',
    amount: 80,
    price: 82.30,
    fee: 0,
    tax: 0,
    category: 'ETF'
  },
  {
    id: 'tx-3',
    type: 'BUY',
    date: '05.03.2026',
    ticker: 'BTC',
    name: 'Bitcoin (BTC)',
    amount: 0.085,
    price: 61200.00,
    fee: 4.50,
    tax: 0,
    category: 'Crypto'
  },
  {
    id: 'tx-4',
    type: 'DIVIDEND',
    date: '12.04.2026',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    amount: 15,
    price: 0.25,
    fee: 0,
    tax: 0.94,
    category: 'Stock'
  },
  {
    id: 'tx-5',
    type: 'BUY',
    date: '10.05.2026',
    ticker: 'EUNL',
    name: 'iShares Core MSCI World ETF',
    amount: 25,
    price: 85.10,
    fee: 0,
    tax: 0,
    category: 'ETF'
  },
  {
    id: 'tx-6',
    type: 'SELL',
    date: '18.06.2026',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    amount: 5,
    price: 189.20,
    fee: 1.00,
    tax: 2.10,
    category: 'Stock'
  }
];

// Initial mock live prices
const INITIAL_PRICES: Record<string, number> = {
  'AAPL': 191.45,
  'EUNL': 87.65,
  'BTC': 63450.00
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>(INITIAL_PRICES);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'holdings' | 'transactions' | 'strategy'>('dashboard');

  // Handle adding transactions
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [transaction, ...prev]);

    // Seed price if it is a new ticker we don't have price for
    if (!currentPrices[transaction.ticker]) {
      setCurrentPrices(prev => ({
        ...prev,
        [transaction.ticker]: transaction.price
      }));
    }
  };



  // Handle deleting transactions
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // Simulate market price changes
  const handleTriggerPriceRefresh = () => {
    setCurrentPrices(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(ticker => {
        // change price randomly between -2.5% and +3.5%
        const changePercent = (Math.random() * 6 - 2.5) / 100;
        updated[ticker] = Math.round(updated[ticker] * (1 + changePercent) * 100) / 100;
      });
      return updated;
    });
  };

  // Dynamically compute holdings based on transaction list
  const holdings: Holding[] = useMemo(() => {
    const assets: Record<string, {
      ticker: string;
      name: string;
      category: 'Stock' | 'ETF' | 'Crypto';
      totalShares: number;
      totalCostBasis: number;
      totalBuyShares: number;
      totalBuyCost: number;
    }> = {};

    // Process transactions in chronological order to correctly calculate weighted cost basis
    const sortedTxs = [...transactions].sort((a, b) => {
      const dateA = a.date.split('.').reverse().join('-');
      const dateB = b.date.split('.').reverse().join('-');
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    sortedTxs.forEach(tx => {
      if (tx.type === 'DIVIDEND') return; // Dividends don't affect share count directly here

      if (!assets[tx.ticker]) {
        assets[tx.ticker] = {
          ticker: tx.ticker,
          name: tx.name,
          category: tx.category,
          totalShares: 0,
          totalCostBasis: 0,
          totalBuyShares: 0,
          totalBuyCost: 0
        };
      }

      const asset = assets[tx.ticker];
      if (tx.type === 'BUY') {
        const cost = (tx.amount * tx.price) + tx.fee;
        asset.totalShares += tx.amount;
        asset.totalCostBasis += cost;
        asset.totalBuyShares += tx.amount;
        asset.totalBuyCost += cost;
      } else if (tx.type === 'SELL') {
        // Average cost remains the same, but share count and absolute cost basis reduce
        const avgPrice = asset.totalShares > 0 ? (asset.totalCostBasis / asset.totalShares) : 0;
        asset.totalShares = Math.max(0, asset.totalShares - tx.amount);
        asset.totalCostBasis = asset.totalShares * avgPrice;
      }
    });

    // Convert aggregated assets map into Holding list
    const holdingsList: Holding[] = Object.values(assets)
      .filter(asset => asset.totalShares > 0.00001) // Filter out fully sold positions
      .map(asset => {
        const shares = asset.totalShares;
        const averageBuyPrice = asset.totalShares > 0 ? (asset.totalCostBasis / asset.totalShares) : 0;
        const currentPrice = currentPrices[asset.ticker] || averageBuyPrice;
        const totalCost = asset.totalCostBasis;
        const currentValue = shares * currentPrice;
        const totalGain = currentValue - totalCost;
        const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

        return {
          ticker: asset.ticker,
          name: asset.name,
          category: asset.category,
          shares,
          averageBuyPrice,
          currentPrice,
          totalCost,
          currentValue,
          totalGain,
          totalGainPercent,
          portfolioWeight: 0 // Will compute in next step
        };
      });

    // Calculate weight for each holding
    const grandValueTotal = holdingsList.reduce((acc, curr) => acc + curr.currentValue, 0);
    return holdingsList.map(h => ({
      ...h,
      portfolioWeight: grandValueTotal > 0 ? (h.currentValue / grandValueTotal) * 100 : 0
    })).sort((a, b) => b.currentValue - a.currentValue);
  }, [transactions, currentPrices]);

  // Compute portfolio level statistics
  const stats: PortfolioStats = useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;
    let dividendsReceived = 0;

    holdings.forEach(h => {
      totalValue += h.currentValue;
      totalCost += h.totalCost;
    });

    // Aggregate dividends from transaction list
    transactions
      .filter(tx => tx.type === 'DIVIDEND')
      .forEach(tx => {
        dividendsReceived += (tx.amount * tx.price) - tx.tax;
      });

    const totalGains = totalValue - totalCost;
    const totalGainsPercent = totalCost > 0 ? (totalGains / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalGains,
      totalGainsPercent,
      dividendsReceived
    };
  }, [holdings, transactions]);

  return (
    <div className="app-container">
      {/* Premium Navigation Header */}
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon">
            <Wallet size={20} color="#fff" />
          </div>
          <span className="logo-text">FinanzPortfolio CoPilot</span>
        </div>

        <nav className="navigation-tabs">
          <button 
            className={`nav-tab ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentTab('dashboard')}
          >
            <PieChart size={16} /> Dashboard
          </button>
          <button 
            className={`nav-tab ${currentTab === 'holdings' ? 'active' : ''}`}
            onClick={() => setCurrentTab('holdings')}
          >
            <Wallet size={16} /> Investments
          </button>
          <button 
            className={`nav-tab ${currentTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setCurrentTab('transactions')}
          >
            <Activity size={16} /> Aktivitäten
          </button>
          <button 
            className={`nav-tab ${currentTab === 'strategy' ? 'active' : ''}`}
            onClick={() => setCurrentTab('strategy')}
          >
            <Sliders size={16} /> Strategie & Prognose
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, paddingBottom: '3rem' }}>
        {currentTab === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            holdings={holdings} 
            transactions={transactions} 
          />
        )}
        {currentTab === 'holdings' && (
          <Holdings 
            holdings={holdings} 
            onTriggerPriceRefresh={handleTriggerPriceRefresh} 
          />
        )}
        {currentTab === 'transactions' && (
          <Transactions 
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
        {currentTab === 'strategy' && (
          <Strategy 
            holdings={holdings} 
            totalValue={stats.totalValue} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
