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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Deine Investments</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Aktuelle Übersicht aller Vermögenswerte und deren Performance.</p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={onTriggerPriceRefresh}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
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
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{holding.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{holding.ticker}</span>
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
                    <td style={{ fontWeight: 500 }}>
                      {holding.currentPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td>
                      {holding.totalCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {holding.currentValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td>
                      <span 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.2rem',
                          color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                          fontWeight: 600
                        }}
                      >
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isPositive ? '+' : ''}{holding.totalGainPercent.toFixed(2)}%
                        <span style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.8 }}>
                          ({holding.totalGain.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})
                        </span>
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {holding.portfolioWeight.toFixed(1)}%
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
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
