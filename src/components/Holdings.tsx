import React, { useState, useMemo } from 'react';
import type { Holding, Transaction } from '../types';
import { TrendingUp, TrendingDown, RefreshCw, X, ShoppingCart, Award } from 'lucide-react';
import { convertCurrency } from './performanceUtils';

interface HoldingsProps {
  holdings: Holding[];
  transactions: Transaction[];
  onTriggerPriceRefresh: () => void;
  baseCurrency: 'EUR' | 'USD' | 'CHF';
  onBaseCurrencyChange: (currency: 'EUR' | 'USD' | 'CHF') => void;
}

export const Holdings: React.FC<HoldingsProps> = ({ 
  holdings, 
  transactions, 
  onTriggerPriceRefresh,
  baseCurrency,
  onBaseCurrencyChange
}) => {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);

  // Currency Formatter
  const formatVal = (value: number) => {
    return value.toLocaleString('de-DE', {
      style: 'currency',
      currency: baseCurrency
    });
  };

  // Convert values on the fly to baseCurrency for display
  const convertedHoldings = useMemo(() => {
    return holdings.map(h => {
      // Let's assume h values are in EUR
      const currentPriceConverted = convertCurrency(h.currentPrice, 'EUR', baseCurrency);
      const averageBuyPriceConverted = convertCurrency(h.averageBuyPrice, 'EUR', baseCurrency);
      const totalCostConverted = convertCurrency(h.totalCost, 'EUR', baseCurrency);
      const currentValueConverted = convertCurrency(h.currentValue, 'EUR', baseCurrency);
      const totalGainConverted = currentValueConverted - totalCostConverted;

      return {
        ...h,
        currentPrice: currentPriceConverted,
        averageBuyPrice: averageBuyPriceConverted,
        totalCost: totalCostConverted,
        currentValue: currentValueConverted,
        totalGain: totalGainConverted
      };
    });
  }, [holdings, baseCurrency]);

  // Filter transactions and dividends for the selected holding
  const assetHistory = useMemo(() => {
    if (!selectedHolding) return { buySells: [], dividends: [] };

    const ticker = selectedHolding.ticker;
    const related = transactions.filter(t => t.ticker === ticker);

    const buySells = related
      .filter(t => t.type === 'BUY' || t.type === 'SELL')
      .sort((a, b) => {
        const dateA = a.date.split('.').reverse().join('-');
        const dateB = b.date.split('.').reverse().join('-');
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

    const dividends = related
      .filter(t => t.type === 'DIVIDEND')
      .sort((a, b) => {
        const dateA = a.date.split('.').reverse().join('-');
        const dateB = b.date.split('.').reverse().join('-');
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

    return { buySells, dividends };
  }, [selectedHolding, transactions]);

  return (
    <div className="glass-panel fade-in">
      <div className="hl-header-row">
        <div>
          <h2 className="hl-title-h2">Deine Investments</h2>
          <p className="hl-subtitle">Aktuelle Übersicht aller Vermögenswerte. Klicke auf ein Asset, um Details und Historie anzuzeigen.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="form-group m-0" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label className="form-label m-0" style={{ fontSize: '0.85rem' }}>Anzeigewährung:</label>
            <select
              className="form-select"
              style={{ width: '80px', padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
              value={baseCurrency}
              onChange={(e) => onBaseCurrencyChange(e.target.value as any)}
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="CHF">CHF (Fr.)</option>
            </select>
          </div>
          <button 
            className="btn btn-secondary hl-sim-btn" 
            onClick={onTriggerPriceRefresh}
          >
            <RefreshCw size={14} /> Live Kurse simulieren
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name / Kürzel</th>
              <th>Typ</th>
              <th>Anteile</th>
              <th>Kaufkurs (Ø)</th>
              <th>Aktueller Kurs</th>
              <th>Investiert</th>
              <th>Gesamtwert</th>
              <th>Gewinn / Verlust</th>
              <th>Yield on Cost</th>
              <th>Gewichtung</th>
            </tr>
          </thead>
          <tbody>
            {convertedHoldings.length > 0 ? (
              convertedHoldings.map((holding) => {
                const isPositive = holding.totalGain >= 0;
                return (
                  <tr 
                    key={holding.ticker} 
                    className="clickable-row" 
                    onClick={() => setSelectedHolding(holding)}
                    title={`${holding.name} Details anzeigen`}
                  >
                    <td>
                      <div className="hl-flex-col-name">
                        <span className="hl-name-span">{holding.name}</span>
                        <span className="hl-ticker-span">{holding.ticker}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${holding.category.toLowerCase()}`}>
                        {holding.category === 'Stock' ? 'Aktie' : holding.category}
                      </span>
                    </td>
                    <td>
                      {holding.shares.toLocaleString('de-DE', { maximumFractionDigits: 4 })}
                    </td>
                    <td>
                      {formatVal(holding.averageBuyPrice)}
                    </td>
                    <td className="hl-medium-weight">
                      {formatVal(holding.currentPrice)}
                    </td>
                    <td>
                      {formatVal(holding.totalCost)}
                    </td>
                    <td className="hl-bold-weight">
                      {formatVal(holding.currentValue)}
                    </td>
                    <td>
                      <span 
                        className="hl-gain-loss-container"
                        style={{ color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}
                      >
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isPositive ? '+' : ''}{holding.totalGainPercent.toFixed(2)}%
                        <span className="hl-gain-loss-subtext">
                          ({formatVal(holding.totalGain)})
                        </span>
                      </span>
                    </td>
                    <td style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                      {holding.yieldOnCost > 0 ? `${holding.yieldOnCost.toFixed(2)}%` : '-'}
                    </td>
                    <td className="hl-weight-col">
                      {holding.portfolioWeight.toFixed(1)}%
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="hl-empty-row">
                  Noch keine Investments vorhanden. Füge eine Transaktion hinzu oder lade ein Broker-PDF hoch.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Asset Details Modal */}
      {selectedHolding && (
        <div className="modal-overlay" onClick={() => setSelectedHolding(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="wl-add-form-title m-0">
                  {selectedHolding.name} ({selectedHolding.ticker})
                </h3>
                <span className={`badge badge-${selectedHolding.category.toLowerCase()} mt-1 d-inline-block`}>
                  {selectedHolding.category === 'Stock' ? 'Aktie' : selectedHolding.category}
                </span>
              </div>
              <button 
                onClick={() => setSelectedHolding(null)} 
                className="modal-close-btn"
                title="Schließen"
                aria-label="Schließen"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* KPIs Row */}
              <div className="sav-sim-stats-grid mb-5" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                <div>
                  <span className="sav-sim-stat-label">Gesamtwert</span>
                  <p className="sav-sim-stat-value fs-md">
                    {formatVal(selectedHolding.currentValue)}
                  </p>
                </div>
                <div>
                  <span className="sav-sim-stat-label">Investiert</span>
                  <p className="sav-sim-stat-value fs-md">
                    {formatVal(selectedHolding.totalCost)}
                  </p>
                </div>
                <div>
                  <span className="sav-sim-stat-label">Gewinn / Verlust</span>
                  <p 
                    className={`sav-sim-stat-value fs-md ${selectedHolding.totalGain >= 0 ? 'text-positive' : 'text-negative'}`}
                  >
                    {selectedHolding.totalGain >= 0 ? '+' : ''}
                    {formatVal(selectedHolding.totalGain)}
                  </p>
                </div>
                <div>
                  <span className="sav-sim-stat-label">Yield on Cost</span>
                  <p className="sav-sim-stat-value fs-md text-gold" style={{ color: 'var(--accent-gold)' }}>
                    {selectedHolding.yieldOnCost > 0 ? `${selectedHolding.yieldOnCost.toFixed(2)}%` : '-'}
                  </p>
                </div>
                <div>
                  <span className="sav-sim-stat-label">Gewichtung</span>
                  <p className="sav-sim-stat-value fs-md text-purple">
                    {selectedHolding.portfolioWeight.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Transactions List */}
              <div className="mb-5">
                <h4 className="sav-panel-title mb-3">
                  <ShoppingCart size={16} className="portfolio-select-icon" /> Transaktions-Historie
                </h4>
                
                {assetHistory.buySells.length > 0 ? (
                  <div className="table-container table-max-height-200">
                    <table className="custom-table fs-sm">
                      <thead>
                        <tr>
                          <th>Datum</th>
                          <th>Typ</th>
                          <th>Anteile</th>
                          <th>Kurs</th>
                          <th>Gebühr</th>
                          <th>Gesamt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetHistory.buySells.map((tx) => {
                          const txCurrency = tx.currency || 'EUR';
                          const txPriceConverted = convertCurrency(tx.price, txCurrency, baseCurrency);
                          const txFeeConverted = convertCurrency(tx.fee, txCurrency, baseCurrency);
                          const total = convertCurrency((tx.amount * tx.price), txCurrency, baseCurrency);
                          return (
                            <tr key={tx.id}>
                              <td>{tx.date}</td>
                              <td>
                                <span className={`badge badge-${tx.type.toLowerCase()}`}>
                                  {tx.type === 'BUY' ? 'Kauf' : 'Verkauf'}
                                </span>
                              </td>
                              <td>{tx.amount}</td>
                              <td>{formatVal(txPriceConverted)}</td>
                              <td>{formatVal(txFeeConverted)}</td>
                              <td className="fw-600">
                                {formatVal(total)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="sav-list-empty my-4">Keine Käufe oder Verkäufe gefunden.</p>
                )}
              </div>

              {/* Dividends List */}
              <div>
                <h4 className="sav-panel-title mb-3">
                  <Award size={16} className="portfolio-select-icon" style={{ color: 'var(--accent-gold)' }} /> Erhaltene Dividenden
                </h4>
                
                {assetHistory.dividends.length > 0 ? (
                  <div className="table-container table-max-height-200">
                    <table className="custom-table fs-sm">
                      <thead>
                        <tr>
                          <th>Datum</th>
                          <th>Ausschüttung / Stk.</th>
                          <th>Quellensteuer / Tax</th>
                          <th>Auszahlung (Netto)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetHistory.dividends.map((tx) => {
                          const txCurrency = tx.currency || 'EUR';
                          const divPriceConverted = convertCurrency(tx.price, txCurrency, baseCurrency);
                          const divTaxConverted = convertCurrency(tx.tax, txCurrency, baseCurrency);
                          const netPayout = convertCurrency((tx.amount * tx.price) - tx.tax, txCurrency, baseCurrency);
                          return (
                            <tr key={tx.id}>
                              <td>{tx.date}</td>
                              <td>{formatVal(divPriceConverted)}</td>
                              <td>{formatVal(divTaxConverted)}</td>
                              <td className="fw-600 text-positive">
                                {formatVal(netPayout)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="sav-list-empty my-4">Keine Dividendenzahlungen für dieses Asset erfasst.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
