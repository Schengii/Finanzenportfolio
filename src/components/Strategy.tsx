import React, { useState, useMemo } from 'react';
import type { Holding } from '../types';
import { Lightbulb, Sliders, Activity, Info, Calendar } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface StrategyProps {
  holdings: Holding[];
  totalValue: number;
}

export const Strategy: React.FC<StrategyProps> = ({ holdings, totalValue }) => {
  // Tab control: 'rebalance' | 'backtest'
  const [subTab, setSubTab] = useState<'rebalance' | 'backtest'>('rebalance');

  // 1. Target Allocation State (Percentages)
  const [targetStock, setTargetStock] = useState<number>(40);
  const [targetEtf, setTargetEtf] = useState<number>(50);
  const [targetCrypto, setTargetCrypto] = useState<number>(10);

  // 2. Investment Planner State
  const [extraInvestment, setExtraInvestment] = useState<number>(1000);

  // 3. Sparplan-Optimierer State
  const [monthlyBudget, setMonthlyBudget] = useState<number>(300);
  const [optimizationMonths, setOptimizationMonths] = useState<number>(6);

  // 4. Backtest Sandbox State
  const [backtestCapital, setBacktestCapital] = useState<number>(10000);
  const [backtestStock, setBacktestStock] = useState<number>(30);
  const [backtestEtf, setBacktestEtf] = useState<number>(60);
  const [backtestCrypto, setBacktestCrypto] = useState<number>(10);

  // Auto-adjust sliders to sum up to 100%
  const adjustSliders = (changed: 'stock' | 'etf' | 'crypto', val: number, isBacktest = false) => {
    const setStock = isBacktest ? setBacktestStock : setTargetStock;
    const setEtf = isBacktest ? setBacktestEtf : setTargetEtf;
    const setCrypto = isBacktest ? setBacktestCrypto : setTargetCrypto;
    
    if (changed === 'stock') {
      setStock(val);
      const rem = 100 - val;
      setEtf(Math.round(rem * 0.8));
      setCrypto(Math.round(rem * 0.2));
    } else if (changed === 'etf') {
      setEtf(val);
      const rem = 100 - val;
      setStock(Math.round(rem * 0.8));
      setCrypto(Math.round(rem * 0.2));
    } else {
      setCrypto(val);
      const rem = 100 - val;
      setStock(Math.round(rem * 0.45));
      setEtf(Math.round(rem * 0.55));
    }
  };

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

  // Sparplan-Optimierer Calculation
  const savingsPlanOptimizer = useMemo(() => {
    if (monthlyBudget <= 0) return { Stock: 0, ETF: 0, Crypto: 0 };
    
    const targetStockVal = (totalValue + (monthlyBudget * optimizationMonths)) * (targetStock / 100);
    const targetEtfVal = (totalValue + (monthlyBudget * optimizationMonths)) * (targetEtf / 100);
    const targetCryptoVal = (totalValue + (monthlyBudget * optimizationMonths)) * (targetCrypto / 100);

    const neededStock = Math.max(0, targetStockVal - currentAllocation.Stock.val);
    const neededEtf = Math.max(0, targetEtfVal - currentAllocation.ETF.val);
    const neededCrypto = Math.max(0, targetCryptoVal - currentAllocation.Crypto.val);

    const sumNeeded = neededStock + neededEtf + neededCrypto;
    if (sumNeeded === 0) {
      return {
        Stock: Math.round(monthlyBudget * (targetStock / 100)),
        ETF: Math.round(monthlyBudget * (targetEtf / 100)),
        Crypto: Math.round(monthlyBudget * (targetCrypto / 100))
      };
    }

    // Allocate monthly savings proportional to target shortfall
    return {
      Stock: Math.round(monthlyBudget * (neededStock / sumNeeded)),
      ETF: Math.round(monthlyBudget * (neededEtf / sumNeeded)),
      Crypto: Math.round(monthlyBudget * (neededCrypto / sumNeeded))
    };
  }, [currentAllocation, totalValue, monthlyBudget, optimizationMonths, targetStock, targetEtf, targetCrypto]);

  // AI Insights Generator
  const coachInsights = useMemo(() => {
    const insights = [];

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

    if (currentAllocation.Crypto.pct > 20) {
      insights.push({
        type: 'warning',
        title: 'Hohe Krypto-Gewichtung',
        desc: `Deine Kryptowährungen machen ${currentAllocation.Crypto.pct.toFixed(1)}% deines Portfolios aus. Kryptoanlagen sind sehr volatil. Wir empfehlen maximal 5-10% als Beimischung.`
      });
    }

    const heavyConcentration = holdings.find(h => h.portfolioWeight > 20 && h.category === 'Stock');
    if (heavyConcentration) {
      insights.push({
        type: 'warning',
        title: `Klumpenrisiko: ${heavyConcentration.name}`,
        desc: `Die Position ${heavyConcentration.name} macht mehr als 20% deines Portfolios aus. Kursstürze dieses Einzelwertes beeinflussen dein Gesamtportfolio massiv.`
      });
    }

    return insights;
  }, [holdings, currentAllocation]);

  // Rebalancing Purchase calculator
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

  // Simulated Historical Backtesting Sandbox data
  const backtestData = useMemo(() => {
    const data = [];
    const years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
    
    // Benchmark factors (cumulative growth)
    const stockGrowths = [1.0, 1.15, 1.10, 1.35, 1.50, 1.75, 1.40, 1.70, 1.95, 2.10, 2.30]; // S&P 500
    const etfGrowths   = [1.0, 1.08, 1.02, 1.25, 1.32, 1.55, 1.30, 1.52, 1.72, 1.85, 2.02]; // MSCI World
    const cryptoGrowths = [1.0, 13.0, 3.5, 6.2, 18.0, 32.0, 10.0, 24.0, 42.0, 38.0, 48.0]; // BTC

    for (let i = 0; i < years.length; i++) {
      const stockPart = backtestCapital * (backtestStock / 100) * stockGrowths[i];
      const etfPart = backtestCapital * (backtestEtf / 100) * etfGrowths[i];
      const cryptoPart = backtestCapital * (backtestCrypto / 100) * cryptoGrowths[i];
      
      const portfolioVal = Math.round(stockPart + etfPart + cryptoPart);
      const benchmarkVal = Math.round(backtestCapital * etfGrowths[i]); // 100% ETF Benchmark

      data.push({
        year: years[i],
        Portfolio: portfolioVal,
        Benchmark: benchmarkVal
      });
    }

    return data;
  }, [backtestCapital, backtestStock, backtestEtf, backtestCrypto]);

  const backtestStats = useMemo(() => {
    const finalRow = backtestData[backtestData.length - 1];
    const initialVal = backtestCapital;
    
    const portGain = ((finalRow.Portfolio - initialVal) / initialVal) * 100;
    const benchGain = ((finalRow.Benchmark - initialVal) / initialVal) * 100;
    
    // Volatility approximation based on growths
    const portVol = (backtestStock * 0.16 + backtestEtf * 0.12 + backtestCrypto * 0.65) / 100 * 100;
    const benchVol = 12.0;

    return {
      portGain,
      benchGain,
      portVol,
      benchVol,
      portFinal: finalRow.Portfolio,
      benchFinal: finalRow.Benchmark
    };
  }, [backtestData, backtestCapital, backtestStock, backtestEtf, backtestCrypto]);

  return (
    <div className="fade-in strat-container">
      <div className="sav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="sav-title-h2">Strategie & Allokation</h2>
          <p className="strat-title-p">Verwalte deine Asset-Allokation, simuliere Vermögenswerte und nutze den Rebalancing-Rechner.</p>
        </div>
        
        {/* Sub-Tab Navigation */}
        <div className="navigation-tabs" style={{ margin: 0 }}>
          <button 
            className={`nav-tab ${subTab === 'rebalance' ? 'active' : ''}`}
            onClick={() => setSubTab('rebalance')}
          >
            <Sliders size={14} /> Soll-Allokation & Sparpläne
          </button>
          <button 
            className={`nav-tab ${subTab === 'backtest' ? 'active' : ''}`}
            onClick={() => setSubTab('backtest')}
          >
            <Activity size={14} /> Backtest Simulator
          </button>
        </div>
      </div>

      {subTab === 'rebalance' ? (
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

              {/* Sparplan-Optimierer */}
              <div className="strat-investment-planner-box" style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h4 className="strat-planner-title">
                  <Calendar size={16} className="portfolio-select-icon" style={{ color: 'var(--accent-blue)' }} /> Sparplan-Optimierer
                </h4>
                <p className="strat-planner-desc">
                  Verteile deine monatliche Sparrate dynamisch, um dein Portfolio über die nächsten Monate wieder ins Gleichgewicht zu bringen.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Monatliche Sparrate (€)</label>
                    <input 
                      type="number"
                      className="form-input"
                      value={monthlyBudget}
                      onChange={(e) => setMonthlyBudget(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Optimierungszeitraum</label>
                    <select
                      className="form-select"
                      value={optimizationMonths}
                      onChange={(e) => setOptimizationMonths(parseInt(e.target.value))}
                    >
                      <option value={3}>3 Monate</option>
                      <option value={6}>6 Monate</option>
                      <option value={12}>12 Monate</option>
                    </select>
                  </div>
                </div>

                <div className="strat-planner-results">
                  <h5 className="strat-planner-results-title">Empfohlene monatliche Sparraten:</h5>
                  <div className="rebalance-grid">
                    <div className="rebalance-item">
                      <span className="sav-item-subtitle">Aktien Sparrate</span>
                      <span className="sav-item-amount">{savingsPlanOptimizer.Stock.toLocaleString('de-DE')} €</span>
                    </div>
                    <div className="rebalance-item">
                      <span className="sav-item-subtitle">ETF Sparrate</span>
                      <span className="sav-item-amount">{savingsPlanOptimizer.ETF.toLocaleString('de-DE')} €</span>
                    </div>
                    <div className="rebalance-item">
                      <span className="sav-item-subtitle">Krypto Sparrate</span>
                      <span className="sav-item-amount">{savingsPlanOptimizer.Crypto.toLocaleString('de-DE')} €</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Investment Planner (Smart Rebalancing by Purchase) */}
              <div className="strat-investment-planner-box" style={{ marginTop: '2rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.5rem' }}>
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
      ) : (
        /* Backtesting Sandbox view */
        <div className="sav-main-grid">
          <div className="glass-panel sav-col-flex" style={{ flex: 2 }}>
            <h3 className="tx-manual-title">Historische Wertentwicklung (2016 - 2026)</h3>
            <p className="tx-dropzone-subtitle">Vergleicht deine eingestellte Wunsch-Allokation gegen ein reines MSCI World Benchmark-Portfolio.</p>
            
            <div style={{ height: '300px', width: '100%', margin: '1rem 0' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={backtestData}>
                  <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v.toLocaleString('de-DE')} €`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Portfolio" name="Wunsch-Allokation" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Benchmark" name="MSCI World Benchmark" stroke="var(--accent-purple)" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Backtest Statistics Comparison */}
            <div className="sav-sim-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <span className="sav-sim-stat-label">Endwert Portfolio</span>
                <p className="sav-sim-stat-value fs-md" style={{ color: 'var(--accent-blue)' }}>{backtestStats.portFinal.toLocaleString('de-DE')} €</p>
              </div>
              <div>
                <span className="sav-sim-stat-label">Gesamtrendite</span>
                <p className="sav-sim-stat-value fs-md text-positive">{backtestStats.portGain.toFixed(1)}%</p>
              </div>
              <div>
                <span className="sav-sim-stat-label">Volatilität (Est.)</span>
                <p className="sav-sim-stat-value fs-md text-purple">{backtestStats.portVol.toFixed(1)}%</p>
              </div>
              <div>
                <span className="sav-sim-stat-label">Benchmark Endwert</span>
                <p className="sav-sim-stat-value fs-md text-white">{backtestStats.benchFinal.toLocaleString('de-DE')} € ({backtestStats.benchGain.toFixed(1)}%)</p>
              </div>
            </div>
          </div>

          {/* Backtest control settings panel */}
          <div className="glass-panel" style={{ flex: 1 }}>
            <h3 className="tx-manual-title">Backtest Parameter</h3>
            <p className="tx-dropzone-subtitle">Konfiguriere das Startkapital und die historische Ziel-Allokation.</p>
            
            <div className="form-group mb-4">
              <label className="form-label">Startkapital (€)</label>
              <input 
                type="number"
                className="form-input"
                value={backtestCapital}
                onChange={(e) => setBacktestCapital(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>

            <div className="strat-target-col mb-4">
              <div className="sav-slider-label-row">
                <label className="strat-target-label">Aktien (S&P 500)</label>
                <span className="sav-slider-label-bold">{backtestStock}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={backtestStock} 
                onChange={(e) => adjustSliders('stock', parseInt(e.target.value), true)}
                className="projection-range"
              />
            </div>

            <div className="strat-target-col mb-4">
              <div className="sav-slider-label-row">
                <label className="strat-target-label">ETFs (MSCI World)</label>
                <span className="sav-slider-label-bold">{backtestEtf}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={backtestEtf} 
                onChange={(e) => adjustSliders('etf', parseInt(e.target.value), true)}
                className="projection-range"
              />
            </div>

            <div className="strat-target-col mb-4">
              <div className="sav-slider-label-row">
                <label className="strat-target-label">Krypto (Bitcoin)</label>
                <span className="sav-slider-label-bold">{backtestCrypto}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={backtestCrypto} 
                onChange={(e) => adjustSliders('crypto', parseInt(e.target.value), true)}
                className="projection-range"
              />
            </div>

            <div className="tx-pdf-error-box" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
              <Info size={14} /> <strong>Erklärung:</strong> Dieser Backtest simuliert die Wertentwicklung einer Einmalanlage seit 2016 basierend auf historischen Jahres-Renditen der zugrundeliegenden Anlageklassen.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
