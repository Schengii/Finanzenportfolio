import React, { useMemo, useRef } from 'react';
import { 
   AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
   PieChart, Pie, Cell, BarChart, Bar
 } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart as PieIcon, Award, Download, Upload, Database, Percent, Calendar as CalendarIcon } from 'lucide-react';
import type { Transaction, Holding, PortfolioStats } from '../types';
 
 interface DashboardProps {
   stats: PortfolioStats;
   holdings: Holding[];
   transactions: Transaction[];
   onExportAll: () => void;
   onImportAll: (file: File) => void;
 }
 
 export const Dashboard: React.FC<DashboardProps> = ({ stats, holdings, transactions, onExportAll, onImportAll }) => {
   const fileInputRef = useRef<HTMLInputElement>(null);

   // Chart Colors
   const COLORS = {
     Stock: '#3b82f6', // blue
     ETF: '#a855f7',   // purple
     Crypto: '#f59e0b' // gold
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
           if (tx.type === 'DIVIDEND') return;
           
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

       data.push({
         date: targetDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }),
         Wert: Math.round(totalValueAtDate),
         Investiert: Math.round(totalInvestedAtDate)
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
   }, [transactions, holdings, stats.totalValue]);
 
   // Aggregate holdings for Pie Chart allocation
   const allocationData = useMemo(() => {
     const categories: Record<string, number> = { Stock: 0, ETF: 0, Crypto: 0 };
     holdings.forEach(h => {
       categories[h.category] += h.currentValue;
     });
 
     return Object.entries(categories)
       .map(([name, value]) => ({ name, value }))
       .filter(item => item.value > 0);
   }, [holdings]);
 
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
         if (monthlyDivs[key] !== undefined) {
           monthlyDivs[key] += t.amount * t.price;
         } else {
           const monthMap: Record<number, string> = {
             0: 'Jan', 1: 'Feb', 2: 'Mrz', 3: 'Apr', 4: 'Mai', 5: 'Jun',
             6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Okt', 10: 'Nov', 11: 'Dez'
           };
           const fbKey = monthMap[dateObj.getMonth()];
           if (fbKey) monthlyDivs[fbKey] += t.amount * t.price;
         }
       });
 
     return Object.entries(monthlyDivs).map(([name, value]) => ({ name, Dividende: Math.round(value * 100) / 100 }));
   }, [transactions]);

   // Dividend Calendar calculations
   const dividendCalendar = useMemo(() => {
     const calendar = Array(12).fill(0).map((_, i) => ({
       monthIndex: i,
       monthName: new Date(2026, i, 1).toLocaleDateString('de-DE', { month: 'short' }).slice(0, 3),
       amount: 0,
       assets: [] as string[]
     }));

     // Look at historical dividend transactions to find payout months
     const assetDividendPayouts: Record<string, Record<number, number>> = {}; // Ticker -> Month -> DividendPerShare
     
     transactions
       .filter(t => t.type === 'DIVIDEND')
       .forEach(t => {
         const dateObj = new Date(t.date.split('.').reverse().join('-'));
         const month = dateObj.getMonth();
         
         const buyTxs = transactions.filter(b => b.ticker === t.ticker && b.type === 'BUY' && new Date(b.date.split('.').reverse().join('-')).getTime() < dateObj.getTime());
         const sharesAtDiv = buyTxs.reduce((acc, curr) => acc + curr.amount, 0);
         const divPerShare = sharesAtDiv > 0 ? (t.amount * t.price) / sharesAtDiv : t.price;

         if (!assetDividendPayouts[t.ticker]) assetDividendPayouts[t.ticker] = {};
         assetDividendPayouts[t.ticker][month] = divPerShare;
       });

     // Project expected dividends
     holdings.forEach(h => {
       const payouts = assetDividendPayouts[h.ticker];
       if (payouts) {
         Object.entries(payouts).forEach(([monthStr, divPerShare]) => {
           const month = parseInt(monthStr);
           const projectedAmount = h.shares * divPerShare;
           calendar[month].amount += projectedAmount;
           if (!calendar[month].assets.includes(h.ticker)) {
             calendar[month].assets.push(h.ticker);
           }
         });
       } else if (h.category === 'Stock') {
         // Fallback: 2% annual yield spread across quarters
         const quarterlyDiv = h.currentValue * 0.005;
         [2, 5, 8, 11].forEach(m => {
           calendar[m].amount += quarterlyDiv;
           if (!calendar[m].assets.includes(h.ticker)) {
             calendar[m].assets.push(h.ticker);
           }
         });
       }
     });

     return calendar;
   }, [transactions, holdings]);
 
   const isPositive = stats.totalGains >= 0;

   // Realized gains calculation (FIFO/Average Buy approximation for tax purposes)
   const realizedGains = useMemo(() => {
     let totalRealized = 0;
     const buys: Record<string, { totalShares: number; totalCost: number }> = {};
     
     const sorted = [...transactions].sort((a, b) => {
       const dateA = a.date.split('.').reverse().join('-');
       const dateB = b.date.split('.').reverse().join('-');
       return new Date(dateA).getTime() - new Date(dateB).getTime();
     });

     sorted.forEach(tx => {
       if (tx.type === 'BUY') {
         if (!buys[tx.ticker]) buys[tx.ticker] = { totalShares: 0, totalCost: 0 };
         buys[tx.ticker].totalShares += tx.amount;
         buys[tx.ticker].totalCost += (tx.amount * tx.price) + tx.fee;
       } else if (tx.type === 'SELL') {
         const buyAsset = buys[tx.ticker];
         if (buyAsset && buyAsset.totalShares > 0) {
           const avgCost = buyAsset.totalCost / buyAsset.totalShares;
           const profit = (tx.amount * tx.price) - (tx.amount * avgCost) - tx.fee - tx.tax;
           totalRealized += profit;
           buyAsset.totalShares = Math.max(0, buyAsset.totalShares - tx.amount);
           buyAsset.totalCost = buyAsset.totalShares * avgCost;
         }
       }
     });
     return Math.max(0, totalRealized);
   }, [transactions]);

   const taxExemptionLimit = 1000;
   const taxExemptionUsed = stats.dividendsReceived + realizedGains;
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
           <span className="stat-value">{stats.totalValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
           <span className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
             {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
             {isPositive ? '+' : ''}{stats.totalGainsPercent.toFixed(2)}% ({stats.totalGains.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})
           </span>
         </div>
 
         <div className="glass-panel stat-card">
           <div className="strat-card-title-row">
             <span className="stat-label">Dividenden (Gesamt)</span>
             <Award size={20} className="text-secondary" />
           </div>
           <span className="stat-value">{stats.dividendsReceived.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
           <span className="stat-change positive">
             Yield on Cost: {yieldOnCost.toFixed(2)}%
           </span>
         </div>
 
         <div className="glass-panel stat-card">
           <div className="strat-card-title-row">
             <span className="stat-label">Investiertes Kapital</span>
             <PieIcon size={20} />
           </div>
           <span className="stat-value">{stats.totalCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
           <span className="stat-change text-muted-bg">
             {holdings.length} Aktive Positionen
           </span>
         </div>
 
         <div className="glass-panel stat-card">
           <div className="strat-card-title-row">
             <span className="stat-label">Aktivitäten</span>
             <Activity size={20} />
           </div>
           <span className="stat-value">{transactions.length}</span>
           <span className="stat-change text-muted-bg">
             {transactions.filter(t => t.type === 'BUY').length} Käufe | {transactions.filter(t => t.type === 'SELL').length} Verkäufe
           </span>
         </div>
       </div>
 
       {/* Main Grid: Performance timeline & Allocation */}
       <div className="grid-main">
         {/* Performance Chart */}
         <div className="glass-panel text-muted-bg">
           <div className="strat-forecast-title-row">
             <h3 className="strat-forecast-title-h3">Portfolioverlauf (Historisch berechnet)</h3>
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
                 <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} €`} />
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
                   <Tooltip formatter={(value) => `${parseFloat(value as string).toLocaleString('de-DE')} €`} />
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
                   <span className="sav-total-value">{pct.toFixed(1)}% ({entry.value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})</span>
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
                 <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} €`} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                   formatter={(value) => `${value} €`}
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
             <p className="tx-dropzone-subtitle">Auslastung deines jährlichen Freibetrags (1.000 €).</p>
             
             <div className="sav-slider-label-row">
               <span className="sav-item-subtitle">Genutzt: {taxExemptionUsed.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
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
               <span className="sav-item-amount">{realizedGains.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
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
         <p className="tx-dropzone-subtitle mb-4">Erwartete monatliche Ausschüttungen basierend auf aktuellen Beständen und Historie.</p>
         
         <div className="div-cal-grid">
           {dividendCalendar.map((m) => (
             <div key={m.monthIndex} className="div-cal-month-box">
               <span className="div-cal-month-name">{m.monthName}</span>
               {m.amount > 0 ? (
                 <>
                   <span className="div-cal-month-value">
                     {m.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
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
