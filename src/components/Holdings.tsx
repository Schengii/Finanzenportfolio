import React from 'react';
import type { Holding } from '../types';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface HoldingsProps {
  holdings: Holding[];
  onTriggerPriceRefresh: () => void;
}

export const Holdings: React.FC<HoldingsProps> = ({ holdings, onTriggerPriceRefresh }) => {
  return (
    <div className="glass-panel fade-in">
      <div className="hl-header-row">
        <div>
          <h2 className="hl-title-h2">Deine Investments</h2>
          <p className="hl-subtitle">Aktuelle Übersicht aller Vermögenswerte und deren Performance.</p>
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
                  <tr key={holding.ticker}>
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
    </div>
  );
};
