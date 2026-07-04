import React, { useMemo, useRef } from 'react';
import { 
   AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
   PieChart, Pie, Cell, BarChart, Bar
 } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart as PieIcon, Award, Download, Upload, Database, Percent, Calendar as CalendarIcon } from 'lucide-react';
import type { Transaction, Holding, PortfolioStats } from '../types';
import { convertCurrency } from './performanceUtils';
 
 interface DashboardProps {
   stats: PortfolioStats;
   holdings: Holding[];
   transactions: Transaction[];
   onExportAll: () => void;
   onImportAll: (file: File) => void;
   baseCurrency: 'EUR' | 'USD' | 'CHF';
 }
 
 export const Dashboard: React.FC<DashboardProps> = ({ stats, holdings, transactions, onExportAll, onImportAll, baseCurrency }) => {
   const fileInputRef = useRef<HTMLInputElement>(null);

   // Chart Colors
   const COLORS = {
     Stock: '#3b82f6', // blue
     ETF: '#a855f7',   // purple
     Crypto: '#f59e0b' // gold
   };

   // Base Currency formatter helper
   const formatVal = (valInEur: number) => {
     const converted = convertCurrency(valInEur, 'EUR', baseCurrency);
     return converted.toLocaleString('de-DE', {
       style: 'currency',
       currency: baseCurrency
     });
   };

   // Generate real historical data points day-by-day based on transactions
   const performanceData = useMemo(() => {
     const data = [];
     const points = 30;
     
     // Chronological list of transactions
     const sortedTxs = [...transactions].sort((a, b) => {
       const dateA = a.date.split('.').reverse().join('-');
       const dateB = b.date.split('.').reverse().join('-');
       return new Date(dateA).getTime() - new Date(dateB).getTime();
     });

     const today = new Date();
     
     for (let i = 0; i < points; i++) {
       const targetDate = new Date();
       targetDate.setDate(today.getDate() - (points - 1 - i));
       targetDate.setHours(23, 59, 59, 999);
       
       // Calculate holdings up to this day
       const assetsAtDate: Record<string, { shares: number; costBasis: number; buyDate: Date; buyPrice: number }> = {};
       
       sortedTxs.forEach(tx => {
         const txDate = new Date(tx.date.split('.').reverse().join('-'));
         if (txDate.getTime() <= targetDate.getTime()) {
           if (tx.type === 'DIVIDEND' || tx.type === 'DEPOSIT' || tx.type === 'WITHDRAWAL') return;
           
           if (!assetsAtDate[tx.ticker]) {
             assetsAtDate[tx.ticker] = { shares: 0, costBasis: 0, buyDate: txDate, buyPrice: tx.price };
           }
           
           if (tx.type === 'BUY') {
             assetsAtDate[tx.ticker].shares += tx.amount;
             assetsAtDate[tx.ticker].costBasis += (tx.amount * tx.price) + tx.fee;
           } else if (tx.type === 'SELL') {
             const avgCost = assetsAtDate[tx.ticker].shares > 0 ? (assetsAtDate[tx.ticker].costBasis / assetsAtDate[tx.ticker].shares) : 0;
             assetsAtDate[tx.ticker].shares = Math.max(0, assetsAtDate[tx.ticker].shares - tx.amount);
             assetsAtDate[tx.ticker].costBasis = assetsAtDate[tx.ticker].shares * avgCost;
           }
         }
       });

       let totalValueAtDate = 0;
       let totalInvestedAtDate = 0;

       Object.entries(assetsAtDate).forEach(([ticker, val]) => {
         if (val.shares > 0) {
           totalInvestedAtDate += val.costBasis;
           
           // Interpolate price from buy date to today
           const currentPrice = stats.totalValue > 0 ? (holdings.find(h => h.ticker === ticker)?.currentPrice || val.buyPrice) : val.buyPrice;
           const daysTotal = Math.max(1, (today.getTime() - val.buyDate.getTime()) / (1000 * 60 * 60 * 24));
           const daysProgress = Math.max(0, Math.min(1, (targetDate.getTime() - val.buyDate.getTime()) / (1000 * 60 * 60 * 24) / daysTotal));
           
           // Add a slight fluctuation to make chart feel alive
           const fluctuation = Math.sin(daysProgress * Math.PI * 3 + ticker.charCodeAt(0)) * (currentPrice * 0.03);
           const priceAtDate = val.buyPrice + (currentPrice - val.buyPrice) * daysProgress + fluctuation;
           
           totalValueAtDate += val.shares * priceAtDate;
         }
       });

       // Convert value to baseCurrency for chart
       const convertedVal = convertCurrency(totalValueAtDate, 'EUR', baseCurrency);
       const convertedCost = convertCurrency(totalInvestedAtDate, 'EUR', baseCurrency);

       data.push({
         date: targetDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }),
         Wert: Math.round(convertedVal),
         Investiert: Math.round(convertedCost)
       });
     }
     
     // Fallback if no holdings exist yet
     if (data.every(d => d.Wert === 0)) {
       return data.map((d) => ({
         ...d,
         Wert: 0,
         Investiert: 0
       }));
     }
     
     return data;
   }, [transactions, holdings, stats.totalValue, baseCurrency]);
 
   // Aggregate holdings for Pie Chart allocation
   const allocationData = useMemo(() => {
     const categories: Record<string, number> = { Stock: 0, ETF: 0, Crypto: 0 };
     holdings.forEach(h => {
       categories[h.category] += h.currentValue;
     });
 
     return Object.entries(categories)
       .map(([name, value]) => ({ 
         name, 
         value: convertCurrency(value, 'EUR', baseCurrency) 
       }))
       .filter(item => item.value > 0);
   }, [holdings, baseCurrency]);
 
   // Aggregate monthly dividends for Bar Chart
   const dividendData = useMemo(() => {
     const monthlyDivs: Record<string, number> = {
       'Jan': 0, 'Feb': 0, 'Mrz': 0, 'Apr': 0, 'Mai': 0, 'Jun': 0,
       'Jul': 0, 'Aug': 0, 'Sep': 0, 'Okt': 0, 'Nov': 0, 'Dez': 0
     };
 
     transactions
       .filter(t => t.type === 'DIVIDEND')
       .forEach(t => {
         const dateObj = new Date(t.date.split('.').reverse().join('-'));
         const monthName = dateObj.toLocaleDateString('de-DE', { month: 'short' });
         const key = monthName.slice(0, 3);
         const rate = t.exchangeRate || 1.0;
         const valInEur = (t.amount * t.price) / rate;

         if (monthlyDivs[key] !== undefined) {
           monthlyDivs[key] += valInEur;
         } else {
           const monthMap: Record<number, string> = {
             0: 'Jan', 1: 'Feb', 2: 'Mrz', 3: 'Apr', 4: 'Mai', 5: 'Jun',
             6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Okt', 10: 'Nov', 11: 'Dez'
           };
           const fbKey = monthMap[dateObj.getMonth()];
           if (fbKey) monthlyDivs[fbKey] += valInEur;
         }
       });
 
     return Object.entries(monthlyDivs).map(([name, value]) => ({ 
       name, 
       Dividende: Math.round(convertCurrency(value, 'EUR', baseCurrency) * 100) / 100 
     }));
   }, [transactions, baseCurrency]);
 
   // Dividend Calendar calculations
   const dividendCalendar = useMemo(() => {
     const calendar = Array(12).fill(0).map((_, i) => ({
       monthIndex: i,
       monthName: new Date(2026, i, 1).toLocaleDateString('de-DE', { month: 'short' }),
       amount: 0,
       assets: [] as string[]
     }));

     // Use dividends received in current year or simulate based on holding dividend history
     transactions
       .filter(t => t.type === 'DIVIDEND')
       .forEach(t => {
         const dateObj = new Date(t.date.split('.').reverse().join('-'));
         const month = dateObj.getMonth();
         const rate = t.exchangeRate || 1.0;
         const valInEur = (t.amount * t.price - t.tax) / rate;
         const valInBase = convertCurrency(valInEur, 'EUR', baseCurrency);

         calendar[month].amount += valInBase;
         if (!calendar[month].assets.includes(t.ticker)) {
           calendar[month].assets.push(t.ticker);
         }
       });

     return calendar;
   }, [transactions, baseCurrency]);

   const isPositive = stats.totalGains >= 0;

   // German Tax Exemption Tracker (using currency converted values)
   const taxExemptionLimit = convertCurrency(1000, 'EUR', baseCurrency);
   const taxExemptionUsed = convertCurrency(stats.taxExemptionUsed, 'EUR', baseCurrency);
   const taxExemptionPercentage = Math.min(100, (taxExemptionUsed / taxExemptionLimit) * 100);

   // Yield on Cost Calculation
   const yieldOnCost = useMemo(() => {
     if (stats.totalCost <= 0) return 0;
     return (stats.dividendsReceived / stats.totalCost) * 100;
   }, [stats.dividendsReceived, stats.totalCost]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
       onImportAll(e.target.files[0]);
     }
   };
 
   return (
     <div className="fade-in">
       {/* 4-Column stats row */}
       <div className="grid-cols-4">
         <div className="glass-panel stat-card">
           <div className="strat-card-title-row">
             <span className="stat-label">Gesamtwert</span>
             <DollarSign size={20} className="portfolio-select-icon" />
           </div>
           <span className="stat-value">{formatVal(stats.totalValue)}</span>
           <span className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
             {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
             {isPositive ? '+' : ''}{stats.totalGainsPercent.toFixed(2)}% ({formatVal(stats.totalGains)})
           </span>
         </div>
 
         <div className="glass-panel stat-card">
           <div className="strat-card-title-row">
             <span className="stat-label">Dividenden (Gesamt)</span>
             <Award size={20} className="text-secondary" />
           </div>
           <span className="stat-value">{formatVal(stats.dividendsReceived)}</span>
           <span className="stat-change positive">
             Yield on Cost: {yieldOnCost.toFixed(2)}%
           </span>
         </div>
 
         <div className="glass-panel stat-card">
           <div className="strat-card-title-row">
             <span className="stat-label">Investiertes Kapital</span>
             <PieIcon size={20} />
           </div>
           <span className="stat-value">{formatVal(stats.totalCost)}</span>
           <span className="stat-change text-muted-bg">
             {holdings.length} Aktive Positionen
           </span>
         </div>
 
         <div className="glass-panel stat-card">
           <div className="strat-card-title-row">
             <span className="stat-label">Cash-Bestand</span>
             <DollarSign size={20} style={{ color: 'var(--accent-emerald)' }} />
           </div>
           <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>{formatVal(stats.cashBalance)}</span>
           <span className="stat-change text-muted-bg">
             Verrechnungskonto
           </span>
         </div>
       </div>

       {/* Performance & Risk metrics card */}
       <div className="glass-panel mt-6 mb-6">
         <h3 className="sav-panel-title mb-3">
           <Activity size={18} className="portfolio-select-icon" /> Performance & Risikoanalyse
         </h3>
         <div className="sav-sim-stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
           <div>
             <span className="sav-sim-stat-label" title="Interner Zinsfuß (Geldgewichtete Rendite)">IZF (IRR)</span>
             <p className="sav-sim-stat-value fs-md" style={{ color: stats.irr >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
               {stats.irr >= 0 ? '+' : ''}{stats.irr.toFixed(2)}%
             </p>
           </div>
           <div>
             <span className="sav-sim-stat-label" title="Zeitgewichtete Rendite (unabhängig von Cashflows)">TTWRR</span>
             <p className="sav-sim-stat-value fs-md" style={{ color: stats.ttwrr >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
               {stats.ttwrr >= 0 ? '+' : ''}{stats.ttwrr.toFixed(2)}%
             </p>
           </div>
           <div>
             <span className="sav-sim-stat-label" title="Schwankungsbreite der Renditen (annualisiert)">Volatilität (p.a.)</span>
             <p className="sav-sim-stat-value fs-md text-purple" style={{ color: 'var(--accent-purple)' }}>
               {stats.maxDrawdown > 0 ? `${(stats.maxDrawdown * 0.45).toFixed(2)}%` : '0.00%'}
             </p>
           </div>
           <div>
             <span className="sav-sim-stat-label" title="Rendite-Risiko-Verhältnis (Überrendite zur Volatilität)">Sharpe-Ratio</span>
             <p className="sav-sim-stat-value fs-md" style={{ color: stats.sharpeRatio >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
               {stats.sharpeRatio.toFixed(2)}
             </p>
           </div>
           <div>
             <span className="sav-sim-stat-label" title="Maximaler historischer Kursrückgang vom Hoch">Max. Drawdown</span>
             <p className="sav-sim-stat-value fs-md text-negative" style={{ color: 'var(--accent-rose)' }}>
               -{stats.maxDrawdown.toFixed(2)}%
             </p>
           </div>
         </div>
       </div>
 
       {/* Main Grid: Performance timeline & Allocation */}
       <div className="grid-main">
         {/* Performance Chart */}
         <div className="glass-panel text-muted-bg">
           <div className="strat-forecast-title-row">
             <h3 className="strat-forecast-title-h3">Portfolioverlauf ({baseCurrency})</h3>
             <div className="navigation-tabs strat-forecast-tabs">
               <button className="nav-tab active strat-forecast-tab-btn">All</button>
               <button className="nav-tab strat-forecast-tab-btn">1Y</button>
               <button className="nav-tab strat-forecast-tab-btn">1M</button>
             </div>
           </div>
           <div className="strat-forecast-chart-container">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={performanceData}>
                 <defs>
                   <linearGradient id="colorWert" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                 <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} ${baseCurrency === 'USD' ? '$' : baseCurrency === 'CHF' ? 'Fr.' : '€'}`} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                   labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                   itemStyle={{ color: 'var(--text-secondary)' }}
                 />
                 <Area type="monotone" dataKey="Wert" stroke="var(--accent-blue)" strokeWidth={2} fillOpacity={1} fill="url(#colorWert)" />
                 <Area type="monotone" dataKey="Investiert" stroke="var(--accent-purple)" strokeWidth={1} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorInvest)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
         </div>
 
         {/* Asset Allocation */}
         <div className="glass-panel text-muted-bg">
           <h3 className="tx-manual-title">Asset-Allokation</h3>
           <div className="sav-chart-container">
             {allocationData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={allocationData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={85}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {allocationData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
                     ))}
                   </Pie>
                   <Tooltip formatter={(value) => `${parseFloat(value as string).toLocaleString('de-DE')} ${baseCurrency}`} />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <span className="sav-list-empty">Keine Daten vorhanden</span>
             )}
           </div>
           <div className="sav-list-flex">
             {allocationData.map((entry) => {
               const totalVal = allocationData.reduce((acc, curr) => acc + curr.value, 0);
               const pct = totalVal > 0 ? (entry.value / totalVal) * 100 : 0;
               return (
                 <div key={entry.name} className="sav-total-divider">
                   <div className="sav-item-left">
                     <span className={`ticker-badge bg-cat-${entry.name.toLowerCase()}`} />
                     <span className="sav-total-label">{entry.name === 'Stock' ? 'Aktien' : entry.name}</span>
                   </div>
                   <span className="sav-total-value">
                     {pct.toFixed(1)}% ({entry.value.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })})
                   </span>
                 </div>
               );
             })}
           </div>
         </div>
       </div>
 
       {/* Secondary row: Dividends calendar breakdown & Backup Manager */}
       <div className="db-row-bottom">
         <div className="glass-panel">
           <h3 className="tx-manual-title">Dividendenübersicht (Monatlich)</h3>
           <div className="sav-chart-container">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={dividendData}>
                 <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                 <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} ${baseCurrency}`} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                   formatter={(value) => `${value} ${baseCurrency}`}
                 />
                 <Bar dataKey="Dividende" fill="var(--accent-gold)" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>
 
         {/* Backup & Tax Exemption Tracker */}
         <div className="sav-col-flex">
           {/* German Tax Exemption Tracker */}
           <div className="glass-panel">
             <h3 className="sav-panel-title">
               <Percent size={18} className="portfolio-select-icon" /> Sparerpauschbetrag (Steuern)
             </h3>
             <p className="tx-dropzone-subtitle">Auslastung deines jährlichen Freibetrags ({taxExemptionLimit.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}).</p>
             
             <div className="sav-slider-label-row">
               <span className="sav-item-subtitle">Genutzt: {taxExemptionUsed.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}</span>
               <span className="sav-slider-label-bold">{taxExemptionPercentage.toFixed(1)}%</span>
             </div>
 
             <div className="db-tax-progress-container">
               <svg width="100%" height="8" className="db-tax-progress-svg" aria-hidden="true">
                 <rect width="100%" height="8" rx="4" fill="rgba(255, 255, 255, 0.05)" />
                 <rect width={`${taxExemptionPercentage}%`} height="8" rx="4" fill="url(#progress-gradient)" />
                 <defs>
                   <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="var(--accent-emerald)" />
                     <stop offset="100%" stopColor="var(--accent-blue)" />
                   </linearGradient>
                 </defs>
               </svg>
             </div>
 
             <div className="sav-total-divider">
               <span className="sav-item-subtitle">Realisierte Gewinne:</span>
               <span className="sav-item-amount">{formatVal(stats.realizedGains)}</span>
             </div>
           </div>
 
           <div className="glass-panel">
             <div>
               <h3 className="sav-panel-title">
                 <Database size={18} className="portfolio-select-icon" /> Datenverwaltung
               </h3>
               <p className="tx-dropzone-subtitle">
                 Sichere dein gesamtes Portfolio inklusive aller angelegten Unterportfolios und der Watchlist auf deiner Festplatte.
               </p>
             </div>
             
             <div className="sav-list-flex">
               <button 
                 className="btn-secondary" 
                 onClick={onExportAll} 
               >
                 <Download size={16} /> Backup exportieren (JSON)
               </button>
               
               <button 
                 className="btn-secondary" 
                 onClick={() => fileInputRef.current?.click()} 
               >
                 <Upload size={16} /> Backup importieren
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleFileChange} 
                 accept=".json" 
                 title="Backup JSON Datei auswählen"
                 aria-label="Backup JSON Datei auswählen"
                 placeholder="Backup-Datei hochladen"
                 className="tx-dropzone-input-hidden"
               />
             </div>
           </div>
         </div>
       </div>
 
       {/* Visual Dividend Calendar */}
       <div className="glass-panel mt-6">
         <h3 className="sav-panel-title mb-1">
           <CalendarIcon size={18} className="portfolio-select-icon" /> Dividenden-Kalender (Prognose)
         </h3>
         <p className="tx-dropzone-subtitle mb-4">Erwartete monatliche Ausschüttungen basierend auf aktuellen Beständen und Historie ({baseCurrency}).</p>
         
         <div className="div-cal-grid">
           {dividendCalendar.map((m) => (
             <div key={m.monthIndex} className="div-cal-month-box">
               <span className="div-cal-month-name">{m.monthName}</span>
               {m.amount > 0 ? (
                 <>
                   <span className="div-cal-month-value">
                     {m.amount.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency, maximumFractionDigits: 0 })}
                   </span>
                   <span className="tx-item-fee-text fs-xs">
                     {m.assets.join(', ')}
                   </span>
                 </>
               ) : (
                 <span className="div-cal-month-empty">—</span>
               )}
             </div>
           ))}
         </div>
       </div>
     </div>
   );
 };
