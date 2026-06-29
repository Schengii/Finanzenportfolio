import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Holding } from '../types';
import { ShieldCheck, AlertTriangle, Lightbulb, TrendingUp, Sliders } from 'lucide-react';

interface StrategyProps {
  holdings: Holding[];
  totalValue: number;
}

export const Strategy: React.FC<StrategyProps> = ({ holdings, totalValue }) => {
  // 1. Compound Interest Forecast State
  const [years, setYears] = useState<number>(15);
  const [monthlySavings, setMonthlySavings] = useState<number>(300);
  const [expectedYield, setExpectedYield] = useState<number>(7);

  // 2. Target Allocation State (Percentages)
  const [targetStock, setTargetStock] = useState<number>(40);
  const [targetEtf, setTargetEtf] = useState<number>(50);
  const [targetCrypto, setTargetCrypto] = useState<number>(10);

  // Auto-adjust target sliders to sum up to 100% when one changes
  const adjustSliders = (changed: 'stock' | 'etf' | 'crypto', val: number) => {
    if (changed === 'stock') {
      setTargetStock(val);
      const rem = 100 - val;
      // split remainder proportionally or 50/50
      setTargetEtf(Math.round(rem * 0.8));
      setTargetCrypto(Math.round(rem * 0.2));
    } else if (changed === 'etf') {
      setTargetEtf(val);
      const rem = 100 - val;
      setTargetStock(Math.round(rem * 0.8));
      setTargetCrypto(Math.round(rem * 0.2));
    } else {
      setTargetCrypto(val);
      const rem = 100 - val;
      setTargetStock(Math.round(rem * 0.45));
      setTargetEtf(Math.round(rem * 0.55));
    }
  };

  // Compound growth calculation
  const forecastData = useMemo(() => {
    const data = [];
    let balance = totalValue;
    const rate = expectedYield / 100;
    
    // Initial year
    data.push({
      year: 0,
      Wert: Math.round(balance),
      Einzahlungen: Math.round(balance)
    });

    let totalInvested = balance;

    for (let i = 1; i <= years; i++) {
      // Compounded monthly
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + rate / 12) + monthlySavings;
        totalInvested += monthlySavings;
      }
      
      data.push({
        year: i,
        Wert: Math.round(balance),
        Einzahlungen: Math.round(totalInvested)
      });
    }

    return data;
  }, [totalValue, years, monthlySavings, expectedYield]);

  // Current allocation calculations
  const currentAllocation = useMemo(() => {
    const alloc = { Stock: 0, ETF: 0, Crypto: 0 };
    holdings.forEach(h => {
      alloc[h.category] += h.currentValue;
    });

    const stockPercent = totalValue > 0 ? (alloc.Stock / totalValue) * 100 : 0;
    const etfPercent = totalValue > 0 ? (alloc.ETF / totalValue) * 100 : 0;
    const cryptoPercent = totalValue > 0 ? (alloc.Crypto / totalValue) * 100 : 0;

    return {
      Stock: { val: alloc.Stock, pct: stockPercent },
      ETF: { val: alloc.ETF, pct: etfPercent },
      Crypto: { val: alloc.Crypto, pct: cryptoPercent }
    };
  }, [holdings, totalValue]);



  // AI-like Insights Generator
  const coachInsights = useMemo(() => {
    const insights = [];

    // Diversification check
    if (holdings.length === 0) {
      insights.push({
        type: 'warning',
        title: 'Keine Anlagen vorhanden',
        desc: 'Füge dein erstes Investment hinzu, um personalisierte Empfehlungen zu erhalten.'
      });
    } else if (holdings.length < 5) {
      insights.push({
        type: 'warning',
        title: 'Geringe Diversifikation',
        desc: 'Dein Portfolio besteht aus nur wenigen Werten. Überlege, breiter gestreute ETFs aufzunehmen, um das Risiko zu reduzieren.'
      });
    } else {
      insights.push({
        type: 'success',
        title: 'Gute Diversifikation',
        desc: `Mit ${holdings.length} verschiedenen Werten bist du gut aufgestellt.`
      });
    }

    // Crypto Exposure check
    if (currentAllocation.Crypto.pct > 20) {
      insights.push({
        type: 'warning',
        title: 'Hohe Krypto-Gewichtung',
        desc: `Deine Kryptowährungen machen ${currentAllocation.Crypto.pct.toFixed(1)}% deines Portfolios aus. Kryptoanlagen sind sehr volatil. Wir empfehlen maximal 5-10% als Beimischung.`
      });
    }

    // Heavy concentration checks (e.g. single stock > 20% of portfolio)
    const heavyConcentration = holdings.find(h => h.portfolioWeight > 20 && h.category === 'Stock');
    if (heavyConcentration) {
      insights.push({
        type: 'warning',
        title: `Klumpenrisiko: ${heavyConcentration.name}`,
        desc: `Die Position ${heavyConcentration.name} macht mehr als 20% deines Portfolios aus. Kursstürze dieses Einzelwertes beeinflussen dein Gesamtportfolio massiv.`
      });
    }

    // Compound Growth tip
    if (monthlySavings > 0) {
      const finalAmount = forecastData[forecastData.length - 1].Wert;
      const totalSaved = forecastData[forecastData.length - 1].Einzahlungen;
      const profit = finalAmount - totalSaved;
      insights.push({
        type: 'success',
        title: 'Zinseszinseffekt aktiv',
        desc: `Durch deine Sparrate von ${monthlySavings} € baust du in ${years} Jahren ${finalAmount.toLocaleString('de-DE')} € auf. Davon sind ${profit.toLocaleString('de-DE')} € reiner Gewinn durch Zinsen!`
      });
    }

    return insights;
  }, [holdings, currentAllocation, monthlySavings, years, forecastData]);

  return (
    <div className="grid-main fade-in">
      {/* Left Column: Forecast & sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Forecast Graph & Config */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} className="text-secondary" style={{ color: 'var(--accent-purple)' }} />
            Zukunftsprognose (Zinseszins)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Simuliere das Wachstum deines Kapitals basierend auf deiner monatlichen Sparrate.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Zeitraum: {years} Jahre</span>
              <input 
                type="range" 
                min="5" 
                max="40" 
                value={years} 
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="projection-range"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sparrate: {monthlySavings} €/Monat</span>
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="50"
                value={monthlySavings} 
                onChange={(e) => setMonthlySavings(parseInt(e.target.value))}
                className="projection-range"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Renditeerwartung: {expectedYield} % p.a.</span>
              <input 
                type="range" 
                min="1" 
                max="15" 
                value={expectedYield} 
                onChange={(e) => setExpectedYield(parseInt(e.target.value))}
                className="projection-range"
              />
            </div>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={11} tickLine={false} tickFormatter={(y) => `Jahr ${y}`} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k €`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  formatter={(value) => value !== undefined && value !== null ? `${Number(value).toLocaleString('de-DE')} €` : ''}
                />
                <Area type="monotone" dataKey="Wert" stroke="var(--accent-purple)" strokeWidth={2} fillOpacity={1} fill="url(#colorForecast)" name="Endwert" />
                <Area type="monotone" dataKey="Einzahlungen" stroke="var(--text-muted)" strokeWidth={1} strokeDasharray="3 3" fill="none" name="Eigenkapital" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Target Allocation Strategy */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} className="text-secondary" style={{ color: 'var(--accent-blue)' }} />
            Investmentstrategie & Rebalancing
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Definiere deine Soll-Allokation. Wir berechnen, wie viel du kaufen/verkaufen musst, um sie zu erreichen.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Aktien: {targetStock}%</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={targetStock} 
                onChange={(e) => adjustSliders('stock', parseInt(e.target.value))}
                className="projection-range"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ETFs: {targetEtf}%</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={targetEtf} 
                onChange={(e) => adjustSliders('etf', parseInt(e.target.value))}
                className="projection-range"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Kryptos: {targetCrypto}%</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={targetCrypto} 
                onChange={(e) => adjustSliders('crypto', parseInt(e.target.value))}
                className="projection-range"
              />
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Anlageklasse</th>
                  <th>Ist-Anteil</th>
                  <th>Soll-Anteil</th>
                  <th>Differenz (EUR)</th>
                  <th>Empfohlene Aktion</th>
                </tr>
              </thead>
              <tbody>
                {['Stock', 'ETF', 'Crypto'].map((cat) => {
                  const current = currentAllocation[cat as keyof typeof currentAllocation];
                  const target = cat === 'Stock' ? targetStock : cat === 'ETF' ? targetEtf : targetCrypto;
                  const diff = (totalValue * (target / 100)) - current.val;
                  const isBuy = diff > 0;
                  
                  return (
                    <tr key={cat}>
                      <td style={{ fontWeight: 600 }}>{cat === 'Stock' ? 'Aktien' : cat === 'ETF' ? 'ETFs' : 'Kryptowährungen'}</td>
                      <td>{current.pct.toFixed(1)}%</td>
                      <td>{target}%</td>
                      <td style={{ color: Math.abs(diff) < 5 ? 'var(--text-secondary)' : isBuy ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 600 }}>
                        {diff > 0 ? '+' : ''}{diff.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td>
                        {Math.abs(diff) < 20 ? (
                          <span style={{ color: 'var(--text-muted)' }}>Optimal balanciert</span>
                        ) : (
                          <span className={`badge ${isBuy ? 'badge-buy' : 'badge-sell'}`}>
                            {isBuy ? 'Kaufen' : 'Verkaufen'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: AI Investment Coach Advice */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb size={20} className="text-secondary" style={{ color: 'var(--accent-gold)' }} />
          Portfolio-Coach
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Intelligente Analysen und Empfehlungen für deine Investmentstrategie.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {coachInsights.map((insight, idx) => (
            <div key={idx} className={`recom-card ${insight.type === 'success' ? 'success' : insight.type === 'warning' ? 'warning' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {insight.type === 'success' ? (
                  <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)' }} />
                ) : (
                  <AlertTriangle size={18} style={{ color: 'var(--accent-gold)' }} />
                )}
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{insight.title}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {insight.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
