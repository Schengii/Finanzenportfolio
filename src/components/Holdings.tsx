import React, { useState, useMemo } from 'react';
import type { Holding, Transaction } from '../types';
import { TrendingUp, TrendingDown, RefreshCw, X, ShoppingCart, Award } from 'lucide-react';

interface HoldingsProps {
  holdings: Holding[];
  transactions: Transaction[];
  onTriggerPriceRefresh: () => void;
}

export const Holdings: React.FC<HoldingsProps> = ({ holdings, transactions, onTriggerPriceRefresh }) => {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);

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
        <button 
          className="btn btn-secondary hl-sim-btn" 
          onClick={onTriggerPriceRefresh}
        >
          <RefreshCw size={14} /> Live Kurse simulieren
        </button>
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
              <th>Gewichtung</th>
            </tr>
          </thead>
          <tbody>
            {holdings.length > 0 ? (
              holdings.map((holding) => {
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
                      {holding.averageBuyPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td className="hl-medium-weight">
                      {holding.currentPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td>
                      {holding.totalCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td className="hl-bold-weight">
                      {holding.currentValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td>
                      <span 
                        className="hl-gain-loss-container"
                        style={{ color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}
                      >
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isPositive ? '+' : ''}{holding.totalGainPercent.toFixed(2)}%
                        <span className="hl-gain-loss-subtext">
                          ({holding.totalGain.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})
                        </span>
                      </span>
                    </td>
                    <td className="hl-weight-col">
                      {holding.portfolioWeight.toFixed(1)}%
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="hl-empty-row">
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
              <div className="sav-sim-stats-grid mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div>
                  <span className="sav-sim-stat-label">Gesamtwert</span>
                  <p className="sav-sim-stat-value fs-md">
                    {selectedHolding.currentValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
                <div>
                  <span className="sav-sim-stat-label">Investiert</span>
                  <p className="sav-sim-stat-value fs-md">
                    {selectedHolding.totalCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
                <div>
                  <span className="sav-sim-stat-label">Gewinn / Verlust</span>
                  <p 
                    className={`sav-sim-stat-value fs-md ${selectedHolding.totalGain >= 0 ? 'text-positive' : 'text-negative'}`}
                  >
                    {selectedHolding.totalGain >= 0 ? '+' : ''}
                    {selectedHolding.totalGain.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
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
                          const total = tx.amount * tx.price;
                          return (
                            <tr key={tx.id}>
                              <td>{tx.date}</td>
                              <td>
                                <span className={`badge badge-${tx.type.toLowerCase()}`}>
                                  {tx.type === 'BUY' ? 'Kauf' : 'Verkauf'}
                                </span>
                              </td>
                              <td>{tx.amount}</td>
                              <td>{tx.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                              <td>{tx.fee.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                              <td className="fw-600">
                                {total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
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
                          const netPayout = (tx.amount * tx.price) - tx.tax;
                          return (
                            <tr key={tx.id}>
                              <td>{tx.date}</td>
                              <td>{tx.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                              <td>{tx.tax.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                              <td className="fw-600 text-positive">
                                {netPayout.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
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
