import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Holding } from '../types';
import { ShieldCheck, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

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

  // 3. Investment Planner State
  const [extraInvestment, setExtraInvestment] = useState<number>(1000);

  // Auto-adjust target sliders to sum up to 100% when one changes
  const adjustSliders = (changed: 'stock' | 'etf' | 'crypto', val: number) => {
    if (changed === 'stock') {
      setTargetStock(val);
      const rem = 100 - val;
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
  }, [holdings, currentAllocation, monthlySavings, forecastData, years]);

  // Pro-rated rebalancing purchasing calculator (without selling)
  const rebalancePlanner = useMemo(() => {
    if (extraInvestment <= 0) return { Stock: 0, ETF: 0, Crypto: 0 };
    
    const newTotal = totalValue + extraInvestment;
    const stockCurrent = currentAllocation.Stock.val;
    const etfCurrent = currentAllocation.ETF.val;
    const cryptoCurrent = currentAllocation.Crypto.val;

    const stockTarget = newTotal * (targetStock / 100);
    const etfTarget = newTotal * (targetEtf / 100);
    const cryptoTarget = newTotal * (targetCrypto / 100);

    const diffStock = Math.max(0, stockTarget - stockCurrent);
    const diffEtf = Math.max(0, etfTarget - etfCurrent);
    const diffCrypto = Math.max(0, cryptoTarget - cryptoCurrent);

    const sumDiffs = diffStock + diffEtf + diffCrypto;

    if (sumDiffs > 0) {
      const factor = extraInvestment / sumDiffs;
      if (factor < 1) {
        return {
          Stock: Math.round(diffStock * factor),
          ETF: Math.round(diffEtf * factor),
          Crypto: Math.round(diffCrypto * factor)
        };
      } else {
        const excess = extraInvestment - sumDiffs;
        return {
          Stock: Math.round(diffStock + excess * (targetStock / 100)),
          ETF: Math.round(diffEtf + excess * (targetEtf / 100)),
          Crypto: Math.round(diffCrypto + excess * (targetCrypto / 100))
        };
      }
    } else {
      return {
        Stock: Math.round(extraInvestment * (targetStock / 100)),
        ETF: Math.round(extraInvestment * (targetEtf / 100)),
        Crypto: Math.round(extraInvestment * (targetCrypto / 100))
      };
    }
  }, [extraInvestment, totalValue, currentAllocation, targetStock, targetEtf, targetCrypto]);

  return (
    <div className="fade-in strat-container">
      <div className="sav-header">
        <div>
          <h2 className="sav-title-h2">Strategie & Allokation</h2>
          <p className="strat-title-p">Verwalte deine Asset-Allokation, simuliere Vermögenswerte und nutze den Rebalancing-Rechner.</p>
        </div>
      </div>

      <div className="sav-main-grid">
        {/* Left Column: Target Allocation & Rebalancing */}
        <div className="sav-col-flex">
          
          <div className="glass-panel">
            <h3 className="tx-manual-title">Soll-Allokation (Zielgewichtung)</h3>
            <p className="tx-dropzone-subtitle">Passe die Schieberegler an. Die Summe wird automatisch auf 100% gehalten.</p>
            
            <div className="strat-target-grid">
              <div className="strat-target-col">
                <div className="sav-slider-label-row">
                  <label htmlFor="slider-target-stock" className="strat-target-label">Aktien</label>
                  <span className="sav-slider-label-bold">{targetStock}%</span>
                </div>
                <input 
                  id="slider-target-stock"
                  type="range" 
                  min="0" 
                  max="100" 
                  value={targetStock} 
                  title="Zielgewichtung Aktien"
                  aria-label="Zielgewichtung Aktien"
                  onChange={(e) => adjustSliders('stock', parseInt(e.target.value))}
                  className="projection-range"
                />
              </div>
              <div className="strat-target-col">
                <div className="sav-slider-label-row">
                  <label htmlFor="slider-target-etf" className="strat-target-label">ETFs</label>
                  <span className="sav-slider-label-bold">{targetEtf}%</span>
                </div>
                <input 
                  id="slider-target-etf"
                  type="range" 
                  min="0" 
                  max="100" 
                  value={targetEtf} 
                  title="Zielgewichtung ETFs"
                  aria-label="Zielgewichtung ETFs"
                  onChange={(e) => adjustSliders('etf', parseInt(e.target.value))}
                  className="projection-range"
                />
              </div>
              <div className="strat-target-col">
                <div className="sav-slider-label-row">
                  <label htmlFor="slider-target-crypto" className="strat-target-label">Kryptos</label>
                  <span className="sav-slider-label-bold">{targetCrypto}%</span>
                </div>
                <input 
                  id="slider-target-crypto"
                  type="range" 
                  min="0" 
                  max="100" 
                  value={targetCrypto} 
                  title="Zielgewichtung Kryptowährungen"
                  aria-label="Zielgewichtung Kryptowährungen"
                  onChange={(e) => adjustSliders('crypto', parseInt(e.target.value))}
                  className="projection-range"
                />
              </div>
            </div>

            <div className="strat-table-container">
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
                        <td className="sav-item-title-active">{cat === 'Stock' ? 'Aktien' : cat === 'ETF' ? 'ETFs' : 'Kryptowährungen'}</td>
                        <td>{current.pct.toFixed(1)}%</td>
                        <td>{target}%</td>
                        <td style={{ color: Math.abs(diff) < 5 ? 'var(--text-secondary)' : isBuy ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 600 }}>
                          {diff > 0 ? '+' : ''}{diff.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        </td>
                        <td>
                          {Math.abs(diff) < 20 ? (
                            <span className="sav-list-empty" style={{ margin: 0 }}>Optimal balanciert</span>
                          ) : (
                            <span className={isBuy ? 'rebalance-badge-buy' : 'rebalance-badge-sell'}>
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

            {/* Interactive Investment Planner (Smart Rebalancing by Purchase) */}
            <div className="strat-investment-planner-box">
              <h4 className="strat-planner-title">Rebalancing-Investitions-Planer</h4>
              <p className="strat-planner-desc">
                Gib einen Betrag ein, den du investieren möchtest. Der Rechner verteilt ihn so, dass du deinen Soll-Allokationen am nächsten kommst.
              </p>
              
              <div className="strat-planner-input-row">
                <div className="strat-planner-input-group">
                  <label htmlFor="planner-extra-capital">Investmentbetrag (€)</label>
                  <input 
                    id="planner-extra-capital"
                    type="number" 
                    className="form-input" 
                    value={extraInvestment} 
                    placeholder="z.B. 1000"
                    onChange={(e) => setExtraInvestment(e.target.value ? Number(e.target.value) : 0)} 
                  />
                </div>
              </div>

              <div className="strat-planner-results">
                <h5 className="strat-planner-results-title">Empfohlene Verteilung der Einzahlung:</h5>
                <div className="rebalance-grid">
                  <div className="rebalance-item">
                    <span className="sav-item-subtitle">Aktien</span>
                    <span className="sav-item-amount">{rebalancePlanner.Stock.toLocaleString('de-DE')} €</span>
                    <span className={rebalancePlanner.Stock > 0 ? 'rebalance-badge-buy' : 'rebalance-badge-ok'}>
                      {rebalancePlanner.Stock > 0 ? 'Kaufen' : 'Halten'}
                    </span>
                  </div>
                  <div className="rebalance-item">
                    <span className="sav-item-subtitle">ETFs</span>
                    <span className="sav-item-amount">{rebalancePlanner.ETF.toLocaleString('de-DE')} €</span>
                    <span className={rebalancePlanner.ETF > 0 ? 'rebalance-badge-buy' : 'rebalance-badge-ok'}>
                      {rebalancePlanner.ETF > 0 ? 'Kaufen' : 'Halten'}
                    </span>
                  </div>
                  <div className="rebalance-item">
                    <span className="sav-item-subtitle">Kryptowährungen</span>
                    <span className="sav-item-amount">{rebalancePlanner.Crypto.toLocaleString('de-DE')} €</span>
                    <span className={rebalancePlanner.Crypto > 0 ? 'rebalance-badge-buy' : 'rebalance-badge-ok'}>
                      {rebalancePlanner.Crypto > 0 ? 'Kaufen' : 'Halten'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: AI Investment Coach Advice */}
        <div className="glass-panel">
          <h2 className="sav-sim-header">
            <Lightbulb size={20} className="portfolio-select-icon" /> Portfolio-Coach
          </h2>
          <p className="tx-dropzone-subtitle">
            Intelligente Analysen und Empfehlungen für deine Investmentstrategie.
          </p>

          <div className="sav-list-flex">
            {coachInsights.map((insight, idx) => (
              <div key={idx} className={`recom-card ${insight.type === 'success' ? 'success' : insight.type === 'warning' ? 'warning' : ''}`}>
                <div className="strat-recom-title-row">
                  <span className="sav-item-title-active">{insight.title}</span>
                </div>
                <p className="strat-recom-text">
                  {insight.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
