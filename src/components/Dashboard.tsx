import React, { useMemo, useRef } from 'react';
import { 
   AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
   PieChart, Pie, Cell, BarChart, Bar
 } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart as PieIcon, Award, Download, Upload, Database } from 'lucide-react';
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
 
   // Generate historical data points based on transactions
   const performanceData = useMemo(() => {
     // Generate a beautiful, smooth curve for mockup purposes based on portfolio holdings
     const data = [];
     const baseValue = stats.totalCost || 10000;
     const currentValue = stats.totalValue || 12450;
     const points = 30;
     
     for (let i = 0; i < points; i++) {
       const progress = i / (points - 1);
       // Add realistic market fluctuations
       const fluctuation = Math.sin(progress * Math.PI * 2.5) * 400 + Math.cos(progress * Math.PI * 4) * 150;
       const interpolatedValue = baseValue + (currentValue - baseValue) * progress + fluctuation;
       
       const date = new Date();
       date.setDate(date.getDate() - (points - 1 - i));
       
       data.push({
         date: date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }),
         Wert: Math.round(interpolatedValue),
         Investiert: Math.round(baseValue + (currentValue - baseValue) * progress * 0.8)
       });
     }
     return data;
   }, [stats]);
 
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
         const dateObj = new Date(t.date.split('.').reverse().join('-')); // Format converter
         const monthName = dateObj.toLocaleDateString('de-DE', { month: 'short' });
         // Handle short names matching our keys
         const key = monthName.slice(0, 3);
         if (monthlyDivs[key] !== undefined) {
           monthlyDivs[key] += t.amount * t.price;
         } else {
           // Fallback map
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
 
   const isPositive = stats.totalGains >= 0;

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
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span className="stat-label">Gesamtwert</span>
             <DollarSign size={20} className="text-secondary" style={{ color: 'var(--accent-blue)' }} />
           </div>
           <span className="stat-value">{stats.totalValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
           <span className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
             {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
             {isPositive ? '+' : ''}{stats.totalGainsPercent.toFixed(2)}% ({stats.totalGains.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})
           </span>
         </div>
 
         <div className="glass-panel stat-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span className="stat-label">Dividenden (Gesamt)</span>
             <Award size={20} className="text-secondary" style={{ color: 'var(--accent-gold)' }} />
           </div>
           <span className="stat-value">{stats.dividendsReceived.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
           <span className="stat-change positive">
             Laufende Rendite: {stats.totalValue > 0 ? ((stats.dividendsReceived / stats.totalValue) * 100).toFixed(2) : '0.00'}%
           </span>
         </div>
 
         <div className="glass-panel stat-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span className="stat-label">Investiertes Kapital</span>
             <PieIcon size={20} style={{ color: 'var(--accent-purple)' }} />
           </div>
           <span className="stat-value">{stats.totalCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
           <span className="stat-change" style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)' }}>
             {holdings.length} Aktive Positionen
           </span>
         </div>
 
         <div className="glass-panel stat-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span className="stat-label">Aktivitäten</span>
             <Activity size={20} style={{ color: 'var(--accent-rose)' }} />
           </div>
           <span className="stat-value">{transactions.length}</span>
           <span className="stat-change" style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)' }}>
             {transactions.filter(t => t.type === 'BUY').length} Käufe | {transactions.filter(t => t.type === 'SELL').length} Verkäufe
           </span>
         </div>
       </div>
 
       {/* Main Grid: Performance timeline & Allocation */}
       <div className="grid-main">
         {/* Performance Chart */}
         <div className="glass-panel" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Portfolioverlauf (Simuliert)</h3>
             <div className="navigation-tabs" style={{ fontSize: '0.8rem', padding: '0.15rem' }}>
               <button className="nav-tab active" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>All</button>
               <button className="nav-tab" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>1Y</button>
               <button className="nav-tab" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>1M</button>
             </div>
           </div>
           <div style={{ flexGrow: 1, width: '100%', height: '300px' }}>
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
         <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Asset-Allokation</h3>
           <div style={{ width: '100%', height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
               <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Keine Daten vorhanden</span>
             )}
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
             {allocationData.map((entry) => {
               const totalVal = allocationData.reduce((acc, curr) => acc + curr.value, 0);
               const pct = totalVal > 0 ? (entry.value / totalVal) * 100 : 0;
               return (
                 <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <span style={{ 
                       width: '10px', 
                       height: '10px', 
                       borderRadius: '50%', 
                       backgroundColor: COLORS[entry.name as keyof typeof COLORS] 
                     }} />
                     <span style={{ fontWeight: 500 }}>{entry.name === 'Stock' ? 'Aktien' : entry.name}</span>
                   </div>
                   <span style={{ color: 'var(--text-secondary)' }}>{pct.toFixed(1)}% ({entry.value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})</span>
                 </div>
               );
             })}
           </div>
         </div>
       </div>
 
       {/* Secondary row: Dividends calendar breakdown & Backup Manager */}
       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
         <div className="glass-panel" style={{ margin: 0 }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Dividendenübersicht (Monatlich)</h3>
           <div style={{ width: '100%', height: '240px' }}>
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

         <div className="glass-panel" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
           <div>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Database size={18} style={{ color: 'var(--accent-blue)' }} /> Datenverwaltung
             </h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1.5rem 0', lineHeight: 1.4 }}>
               Sichere dein gesamtes Portfolio inklusive aller angelegten Unterportfolios und der Watchlist auf deiner Festplatte.
             </p>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <button 
               className="btn-secondary" 
               onClick={onExportAll} 
               style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem' }}
             >
               <Download size={16} /> Backup exportieren (JSON)
             </button>
             
             <button 
               className="btn-secondary" 
               onClick={() => fileInputRef.current?.click()} 
               style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem' }}
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
               style={{ display: 'none' }} 
             />
           </div>
         </div>
       </div>
     </div>
   );

