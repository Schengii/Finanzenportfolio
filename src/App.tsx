import { useState, useMemo, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Holdings } from './components/Holdings';
import { Transactions } from './components/Transactions';
import { Strategy } from './components/Strategy';
import { Watchlist } from './components/Watchlist';
import { SavingsSimulator } from './components/SavingsSimulator';
import { DividendCalendar } from './components/DividendCalendar';
import { MappingEditor } from './components/MappingEditor';
import type { Transaction, Holding, PortfolioStats, WatchlistItem, Portfolio, SavingsPlan, AssetCategory, AssetMappingRule } from './types';
import { Wallet, PieChart, Activity, Sliders, Eye, FolderOpen, Calendar, Sun, Moon, Settings } from 'lucide-react';
import { calculateIRR, calculateTTWRR, calculateMaxDrawdown, calculateVolatility, calculateSharpeRatio, calculateRealizedGains, DEFAULT_EXCHANGE_RATES } from './components/performanceUtils';
import './App.css';

// Initial Mock Data
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-0',
    type: 'DEPOSIT',
    date: '01.01.2026',
    ticker: 'CASH',
    name: 'Einzahlung (Cash)',
    amount: 15000,
    price: 1,
    fee: 0,
    tax: 0,
    category: 'Stock',
    currency: 'EUR',
    exchangeRate: 1.0
  },
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
    category: 'Stock',
    currency: 'EUR',
    exchangeRate: 1.0
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
    category: 'ETF',
    currency: 'EUR',
    exchangeRate: 1.0
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
    category: 'Crypto',
    currency: 'EUR',
    exchangeRate: 1.0
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
    category: 'Stock',
    currency: 'EUR',
    exchangeRate: 1.0
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
    category: 'ETF',
    currency: 'EUR',
    exchangeRate: 1.0
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
    category: 'Stock',
    currency: 'EUR',
    exchangeRate: 1.0
  },
  {
    id: 'tx-7',
    type: 'STAKING',
    date: '25.06.2026',
    ticker: 'BTC',
    name: 'Bitcoin (BTC)',
    amount: 0.0012,
    price: 62500.00,
    fee: 0,
    tax: 0,
    category: 'Crypto',
    currency: 'EUR',
    exchangeRate: 1.0
  }
];

// Initial mock live prices
const INITIAL_PRICES: Record<string, number> = {
  'AAPL': 191.45,
  'EUNL': 87.65,
  'BTC': 63450.00,
  'MSFT': 415.50
};

const INITIAL_MAPPING_RULES: AssetMappingRule[] = [
  {
    id: 'rule-1',
    pattern: 'US0378331002',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    category: 'Stock'
  },
  {
    id: 'rule-2',
    pattern: 'IE00B3RBWM25',
    ticker: 'VGWD',
    name: 'Vanguard FTSE All-World UCITS ETF',
    category: 'ETF'
  }
];

function App() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const saved = localStorage.getItem('finanz_portfolios');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'default',
        name: 'Haupt-Portfolio',
        transactions: INITIAL_TRANSACTIONS,
        watchlist: [
          {
            id: 'w-1',
            ticker: 'MSFT',
            name: 'Microsoft Corp.',
            category: 'Stock',
            targetPrice: 380.00,
            notes: 'Kauf geplant bei Korrektur auf das EMA-50 Level.',
            addedAt: '20.06.2026'
          }
        ],
        savingsPlans: [
          {
            id: 'sp-1',
            ticker: 'EUNL',
            name: 'iShares Core MSCI World ETF',
            category: 'ETF',
            amount: 150,
            isActive: true
          },
          {
            id: 'sp-2',
            ticker: 'BTC',
            name: 'Bitcoin (BTC)',
            category: 'Crypto',
            amount: 50,
            isActive: true
          }
        ],
        mappingRules: INITIAL_MAPPING_RULES
      }
    ];
  });

  const [currentPortfolioId, setCurrentPortfolioId] = useState<string>(() => {
    return localStorage.getItem('finanz_current_portfolio_id') || 'default';
  });

  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('finanz_current_prices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRICES;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('finanz_theme') as any) || 'dark';
  });

  const [baseCurrency, setBaseCurrency] = useState<'EUR' | 'USD' | 'CHF'>(() => {
    return (localStorage.getItem('finanz_base_currency') as any) || 'EUR';
  });

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'holdings' | 'transactions' | 'strategy' | 'watchlist' | 'savings' | 'dividend_calendar' | 'mapping_rules'>('dashboard');
  const [prefilledTx, setPrefilledTx] = useState<{ ticker: string; name: string; category: AssetCategory; price: number } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('finanz_portfolios', JSON.stringify(portfolios));
  }, [portfolios]);

  useEffect(() => {
    localStorage.setItem('finanz_current_portfolio_id', currentPortfolioId);
  }, [currentPortfolioId]);

  useEffect(() => {
    localStorage.setItem('finanz_current_prices', JSON.stringify(currentPrices));
  }, [currentPrices]);

  useEffect(() => {
    localStorage.setItem('finanz_base_currency', baseCurrency);
  }, [baseCurrency]);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('finanz_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Derived current portfolio
  const currentPortfolio = useMemo(() => {
    const found = portfolios.find(p => p.id === currentPortfolioId) || portfolios[0];
    if (!found) {
      return { id: 'default', name: 'Haupt-Portfolio', transactions: [], watchlist: [], savingsPlans: [], mappingRules: INITIAL_MAPPING_RULES };
    }
    return {
      ...found,
      mappingRules: found.mappingRules || INITIAL_MAPPING_RULES
    };
  }, [portfolios, currentPortfolioId]);

  const transactions = currentPortfolio.transactions || [];
  const watchlist = currentPortfolio.watchlist || [];
  const savingsPlans = currentPortfolio.savingsPlans || [];
  const mappingRules = currentPortfolio.mappingRules || [];

  const setTransactions = (updater: Transaction[] | ((prev: Transaction[]) => Transaction[])) => {
    setPortfolios(prev => prev.map(p => {
      if (p.id === currentPortfolio.id) {
        const nextTxs = typeof updater === 'function' ? updater(p.transactions || []) : updater;
        return { ...p, transactions: nextTxs };
      }
      return p;
    }));
  };

  const setWatchlist = (updater: WatchlistItem[] | ((prev: WatchlistItem[]) => WatchlistItem[])) => {
    setPortfolios(prev => prev.map(p => {
      if (p.id === currentPortfolio.id) {
        const nextWatch = typeof updater === 'function' ? updater(p.watchlist || []) : updater;
        return { ...p, watchlist: nextWatch };
      }
      return p;
    }));
  };

  const setSavingsPlans = (updater: SavingsPlan[] | ((prev: SavingsPlan[]) => SavingsPlan[])) => {
    setPortfolios(prev => prev.map(p => {
      if (p.id === currentPortfolio.id) {
        const nextPlans = typeof updater === 'function' ? updater(p.savingsPlans || []) : updater;
        return { ...p, savingsPlans: nextPlans };
      }
      return p;
    }));
  };

  const setMappingRules = (updater: AssetMappingRule[] | ((prev: AssetMappingRule[]) => AssetMappingRule[])) => {
    setPortfolios(prev => prev.map(p => {
      if (p.id === currentPortfolio.id) {
        const nextRules = typeof updater === 'function' ? updater(p.mappingRules || []) : updater;
        return { ...p, mappingRules: nextRules };
      }
      return p;
    }));
  };

  // Handle adding transactions
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [transaction, ...prev]);

    if (transaction.ticker !== 'CASH' && !currentPrices[transaction.ticker]) {
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

  // Mapping rules methods
  const handleAddMappingRule = (rule: Omit<AssetMappingRule, 'id'>) => {
    const newRule: AssetMappingRule = {
      ...rule,
      id: `rule-${Date.now()}`
    };
    setMappingRules(prev => [...prev, newRule]);
  };

  const handleRemoveMappingRule = (id: string) => {
    setMappingRules(prev => prev.filter(r => r.id !== id));
  };

  // Watchlist methods
  const handleAddWatchlistItem = (item: Omit<WatchlistItem, 'id' | 'addedAt'>) => {
    const newItem: WatchlistItem = {
      ...item,
      id: `w-${Date.now()}`,
      addedAt: new Date().toLocaleDateString('de-DE')
    };
    setWatchlist(prev => [...prev, newItem]);
    
    if (!currentPrices[newItem.ticker]) {
      setCurrentPrices(prev => ({
        ...prev,
        [newItem.ticker]: newItem.targetPrice
      }));
    }
  };

  const handleRemoveWatchlistItem = (id: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };

  const handleQuickBuy = (ticker: string, name: string, category: AssetCategory, price: number) => {
    setPrefilledTx({ ticker, name, category, price });
    setCurrentTab('transactions');
  };

  // Savings Plan methods
  const handleAddSavingsPlan = (plan: Omit<SavingsPlan, 'id'>) => {
    const newPlan: SavingsPlan = {
      ...plan,
      id: `sp-${Date.now()}`
    };
    setSavingsPlans(prev => [...prev, newPlan]);
  };

  const handleDeleteSavingsPlan = (id: string) => {
    setSavingsPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleSavingsPlan = (id: string) => {
    setSavingsPlans(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  // Backup & Import
  const handleExportAll = () => {
    const dataStr = JSON.stringify({ portfolios, currentPrices }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finanzportfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportAll = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.portfolios && Array.isArray(parsed.portfolios)) {
          setPortfolios(parsed.portfolios);
          if (parsed.currentPrices) {
            setCurrentPrices(parsed.currentPrices);
          }
          if (parsed.portfolios.length > 0) {
            setCurrentPortfolioId(parsed.portfolios[0].id);
          }
          alert('Backup erfolgreich geladen!');
        } else {
          alert('Ungültiges Dateiformat. Portfolios fehlen.');
        }
      } catch (err) {
        alert('Fehler beim Lesen der Backup-Datei.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Date', 'Ticker', 'Name', 'Amount', 'Price', 'Fee', 'Tax', 'Category', 'Currency', 'ExchangeRate'];
    const rows = transactions.map(tx => [
      tx.id,
      tx.type,
      tx.date,
      tx.ticker,
      tx.name,
      tx.amount,
      tx.price,
      tx.fee,
      tx.tax,
      tx.category,
      tx.currency || 'EUR',
      tx.exchangeRate || 1.0
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finanzportfolio_transaktionen_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) {
          alert('Die CSV-Datei ist leer oder hat keine Spalten.');
          return;
        }
        
        const importedTransactions: Transaction[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length < 10) continue;
          
          importedTransactions.push({
            id: cols[0] || `tx-${Date.now()}-${i}`,
            type: cols[1] as any,
            date: cols[2],
            ticker: cols[3].toUpperCase(),
            name: cols[4],
            amount: parseFloat(cols[5]) || 0,
            price: parseFloat(cols[6]) || 0,
            fee: parseFloat(cols[7]) || 0,
            tax: parseFloat(cols[8]) || 0,
            category: cols[9] as any,
            currency: (cols[10] || 'EUR') as any,
            exchangeRate: parseFloat(cols[11]) || 1.0
          });
        }
        
        setTransactions(importedTransactions);
        alert(`${importedTransactions.length} Transaktionen erfolgreich importiert!`);
      } catch (err) {
        alert('Fehler beim Importieren der CSV-Datei.');
      }
    };
    reader.readAsText(file);
  };


  // Simulate market price changes
  const handleTriggerPriceRefresh = () => {
    setCurrentPrices(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(ticker => {
        const changePercent = (Math.random() * 6 - 2.5) / 100;
        updated[ticker] = Math.round(updated[ticker] * (1 + changePercent) * 100) / 100;
      });
      return updated;
    });
  };

  // Dynamically compute holdings based on transaction list (in EUR)
  const holdings: Holding[] = useMemo(() => {
    const assets: Record<string, {
      ticker: string;
      name: string;
      category: 'Stock' | 'ETF' | 'Crypto';
      totalShares: number;
      totalCostBasis: number; // in EUR
      totalDividends: number; // in EUR
    }> = {};

    const sortedTxs = [...transactions].sort((a, b) => {
      const dateA = a.date.split('.').reverse().join('-');
      const dateB = b.date.split('.').reverse().join('-');
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    sortedTxs.forEach(tx => {
      if (tx.ticker === 'CASH') return;

      const rate = tx.exchangeRate || DEFAULT_EXCHANGE_RATES[tx.currency || 'EUR'] || 1.0;
      
      if (!assets[tx.ticker]) {
        assets[tx.ticker] = {
          ticker: tx.ticker,
          name: tx.name,
          category: tx.category,
          totalShares: 0,
          totalCostBasis: 0,
          totalDividends: 0
        };
      }

      const asset = assets[tx.ticker];
      if (tx.type === 'BUY') {
        const costInEur = ((tx.amount * tx.price) + tx.fee) / rate;
        asset.totalShares += tx.amount;
        asset.totalCostBasis += costInEur;
      } else if (tx.type === 'SELL') {
        const avgPrice = asset.totalShares > 0 ? (asset.totalCostBasis / asset.totalShares) : 0;
        asset.totalShares = Math.max(0, asset.totalShares - tx.amount);
        asset.totalCostBasis = asset.totalShares * avgPrice;
      } else if (tx.type === 'DIVIDEND') {
        const divInEur = ((tx.amount * tx.price) - tx.tax) / rate;
        asset.totalDividends += divInEur;
      } else if (tx.type === 'STAKING') {
        // Staking rewards add shares, cost basis remains 0. This decreases avgBuyPrice.
        asset.totalShares += tx.amount;
      }
    });

    const holdingsList: Holding[] = Object.values(assets)
      .filter(asset => asset.totalShares > 0.00001)
      .map(asset => {
        const shares = asset.totalShares;
        const averageBuyPrice = asset.totalShares > 0 ? (asset.totalCostBasis / asset.totalShares) : 0;
        const currentPrice = currentPrices[asset.ticker] || averageBuyPrice;
        const totalCost = asset.totalCostBasis;
        const currentValue = shares * currentPrice;
        const totalGain = currentValue - totalCost;
        const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
        const yieldOnCost = totalCost > 0 ? (asset.totalDividends / totalCost) * 100 : 0;

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
          portfolioWeight: 0,
          yieldOnCost
        };
      });

    const grandValueTotal = holdingsList.reduce((acc, curr) => acc + curr.currentValue, 0);
    return holdingsList.map(h => ({
      ...h,
      portfolioWeight: grandValueTotal > 0 ? (h.currentValue / grandValueTotal) * 100 : 0
    })).sort((a, b) => b.currentValue - a.currentValue);
  }, [transactions, currentPrices]);

  // Compute Cash Balance (in EUR)
  const cashBalance = useMemo(() => {
    let balance = 0;
    
    // Sort transactions chronologically
    const sortedTxs = [...transactions].sort((a, b) => {
      const dateA = a.date.split('.').reverse().join('-');
      const dateB = b.date.split('.').reverse().join('-');
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    sortedTxs.forEach(tx => {
      const rate = tx.exchangeRate || DEFAULT_EXCHANGE_RATES[tx.currency || 'EUR'] || 1.0;
      
      if (tx.type === 'DEPOSIT') {
        balance += (tx.amount / rate);
      } else if (tx.type === 'WITHDRAWAL') {
        balance -= (tx.amount / rate);
      } else if (tx.type === 'BUY') {
        balance -= ((tx.amount * tx.price) + tx.fee) / rate;
      } else if (tx.type === 'SELL') {
        balance += ((tx.amount * tx.price) - tx.fee - tx.tax) / rate;
      } else if (tx.type === 'DIVIDEND') {
        balance += ((tx.amount * tx.price) - tx.tax) / rate;
      }
      // Note: Staking rewards are received in assets directly, not changing cash account
    });

    return balance;
  }, [transactions]);

  // Compute portfolio level statistics (all values calculated in EUR)
  const stats: PortfolioStats = useMemo(() => {
    let totalValue = 0; // current holdings value
    let totalCost = 0;  // cost of active holdings
    let dividendsReceived = 0;
    let stakingRewards = 0;

    holdings.forEach(h => {
      totalValue += h.currentValue;
      totalCost += h.totalCost;
    });

    transactions.forEach(tx => {
      const rate = tx.exchangeRate || DEFAULT_EXCHANGE_RATES[tx.currency || 'EUR'] || 1.0;
      if (tx.type === 'DIVIDEND') {
        dividendsReceived += ((tx.amount * tx.price) - tx.tax) / rate;
      } else if (tx.type === 'STAKING') {
        stakingRewards += (tx.amount * tx.price) / rate;
      }
    });

    const totalGains = totalValue - totalCost;
    const totalGainsPercent = totalCost > 0 ? (totalGains / totalCost) * 100 : 0;

    // Advanced Metrics using performanceUtils
    const irr = calculateIRR(transactions, totalValue, cashBalance);
    const ttwrr = calculateTTWRR(transactions, totalValue, cashBalance);
    const realizedGains = calculateRealizedGains(transactions);
    
    // Simulate historical values over 30 days to calculate Drawdown and Volatility
    const simulatedHistoricalValues = Array.from({ length: 30 }, (_, idx) => {
      const noise = Math.sin(idx) * 0.02 * totalValue;
      return Math.max(0, totalValue + noise);
    });
    
    const maxDrawdown = calculateMaxDrawdown(simulatedHistoricalValues);
    const volatility = calculateVolatility(simulatedHistoricalValues);
    const sharpeRatio = calculateSharpeRatio(totalGainsPercent, volatility || 15.0);

    return {
      totalValue,
      totalCost,
      totalGains,
      totalGainsPercent,
      dividendsReceived,
      cashBalance,
      irr,
      ttwrr,
      maxDrawdown,
      sharpeRatio,
      realizedGains,
      taxExemptionUsed: dividendsReceived + realizedGains,
      stakingRewards
    };
  }, [holdings, transactions, cashBalance]);

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

        {/* Theme Toggle & Portfolio Switcher */}
        <div className="header-controls-group">
          <button 
            className="theme-toggle-btn"
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Hellmodus einschalten' : 'Dunkelmodus einschalten'}
            aria-label={theme === 'dark' ? 'Hellmodus einschalten' : 'Dunkelmodus einschalten'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="portfolio-selector-container">
            <FolderOpen size={16} className="portfolio-select-icon" />
            <select 
              value={currentPortfolioId} 
              title="Portfolio auswählen"
              aria-label="Portfolio auswählen"
              onChange={(e) => {
                if (e.target.value === 'CREATE_NEW') {
                  const name = prompt('Name des neuen Portfolios:');
                  if (name && name.trim()) {
                    const id = `p-${Date.now()}`;
                    setPortfolios(prev => [...prev, { id, name: name.trim(), transactions: [], watchlist: [], savingsPlans: [], mappingRules: INITIAL_MAPPING_RULES }]);
                    setCurrentPortfolioId(id);
                  }
                } else if (e.target.value === 'DELETE_CURRENT') {
                  if (portfolios.length <= 1) {
                    alert('Du musst mindestens ein Portfolio behalten!');
                    return;
                  }
                  if (confirm(`Möchtest du das Portfolio "${currentPortfolio.name}" wirklich löschen?`)) {
                    const remaining = portfolios.filter(p => p.id !== currentPortfolioId);
                    setPortfolios(remaining);
                    setCurrentPortfolioId(remaining[0].id);
                  }
                } else {
                  setCurrentPortfolioId(e.target.value);
                }
              }}
              className="portfolio-select"
            >
              {portfolios.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              <option value="" disabled>──────────</option>
              <option value="CREATE_NEW">+ Neues Portfolio...</option>
              <option value="DELETE_CURRENT">🗑️ Aktuelles Portfolio löschen</option>
            </select>
          </div>
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
            <Sliders size={16} /> Strategie
          </button>
          <button 
            className={`nav-tab ${currentTab === 'dividend_calendar' ? 'active' : ''}`}
            onClick={() => setCurrentTab('dividend_calendar')}
          >
            <Calendar size={16} /> Zahltage
          </button>
          <button 
            className={`nav-tab ${currentTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setCurrentTab('watchlist')}
          >
            <Eye size={16} /> Watchlist
          </button>
          <button 
            className={`nav-tab ${currentTab === 'savings' ? 'active' : ''}`}
            onClick={() => setCurrentTab('savings')}
          >
            <Calendar size={16} /> Sparpläne
          </button>
          <button 
            className={`nav-tab ${currentTab === 'mapping_rules' ? 'active' : ''}`}
            onClick={() => setCurrentTab('mapping_rules')}
          >
            <Settings size={16} /> PDF-Regeln
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="app-main-content">
        {currentTab === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            holdings={holdings} 
            transactions={transactions} 
            onExportAll={handleExportAll}
            onImportAll={handleImportAll}
            onExportCSV={handleExportCSV}
            onImportCSV={handleImportCSV}
            baseCurrency={baseCurrency}
          />
        )}
        {currentTab === 'holdings' && (
          <Holdings 
            holdings={holdings} 
            transactions={transactions}
            onTriggerPriceRefresh={handleTriggerPriceRefresh}
            baseCurrency={baseCurrency}
            onBaseCurrencyChange={setBaseCurrency}
          />
        )}
        {currentTab === 'transactions' && (
          <Transactions 
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            prefilledData={prefilledTx}
            onClearPrefilledData={() => setPrefilledTx(null)}
            mappingRules={mappingRules}
            onAddRule={handleAddMappingRule}
          />
        )}
        {currentTab === 'strategy' && (
          <Strategy 
            holdings={holdings} 
            totalValue={stats.totalValue} 
          />
        )}
        {currentTab === 'dividend_calendar' && (
          <DividendCalendar 
            transactions={transactions}
            holdings={holdings}
            baseCurrency={baseCurrency}
          />
        )}
        {currentTab === 'watchlist' && (
          <Watchlist 
            watchlist={watchlist} 
            currentPrices={currentPrices} 
            onAddWatchlist={handleAddWatchlistItem} 
            onRemoveWatchlist={handleRemoveWatchlistItem} 
            onQuickBuy={handleQuickBuy}
          />
        )}
        {currentTab === 'savings' && (
          <SavingsSimulator 
            savingsPlans={savingsPlans} 
            portfolioValue={stats.totalValue} 
            onAddSavingsPlan={handleAddSavingsPlan} 
            onDeleteSavingsPlan={handleDeleteSavingsPlan} 
            onToggleSavingsPlan={handleToggleSavingsPlan} 
          />
        )}
        {currentTab === 'mapping_rules' && (
          <MappingEditor 
            rules={mappingRules}
            onAddRule={handleAddMappingRule}
            onRemoveRule={handleRemoveMappingRule}
          />
        )}
      </main>
    </div>
  );
}

export default App;
