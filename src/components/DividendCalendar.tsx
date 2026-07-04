import React, { useState, useMemo } from 'react';
import type { Transaction } from '../types';
import { ArrowLeft, ArrowRight, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { convertCurrency } from './performanceUtils';

interface DividendCalendarProps {
  transactions: Transaction[];
  baseCurrency: 'EUR' | 'USD' | 'CHF';
}

export const DividendCalendar: React.FC<DividendCalendarProps> = ({
  transactions,
  baseCurrency
}) => {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-indexed

  const monthsList = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  // Format helper
  const formatVal = (valInEur: number) => {
    const converted = convertCurrency(valInEur, 'EUR', baseCurrency);
    return converted.toLocaleString('de-DE', {
      style: 'currency',
      currency: baseCurrency
    });
  };

  // Filter dividend transactions for selected month and year
  const monthlyDividends = useMemo(() => {
    return transactions
      .filter(tx => {
        if (tx.type !== 'DIVIDEND') return false;
        const dateObj = new Date(tx.date.split('.').reverse().join('-'));
        return dateObj.getFullYear() === selectedYear && dateObj.getMonth() === selectedMonth;
      })
      .map(tx => {
        const rate = tx.exchangeRate || 1.0;
        const netPayoutEur = (tx.amount * tx.price - tx.tax) / rate;
        const grossPayoutEur = (tx.amount * tx.price) / rate;
        const taxEur = tx.tax / rate;

        return {
          ...tx,
          netPayoutEur,
          grossPayoutEur,
          taxEur
        };
      })
      .sort((a, b) => {
        const dayA = parseInt(a.date.split('.')[0]);
        const dayB = parseInt(b.date.split('.')[0]);
        return dayA - dayB;
      });
  }, [transactions, selectedYear, selectedMonth]);

  // Summaries
  const totalNet = useMemo(() => {
    return monthlyDividends.reduce((acc, curr) => acc + curr.netPayoutEur, 0);
  }, [monthlyDividends]);

  const totalTax = useMemo(() => {
    return monthlyDividends.reduce((acc, curr) => acc + curr.taxEur, 0);
  }, [monthlyDividends]);

  const topPayer = useMemo(() => {
    if (monthlyDividends.length === 0) return null;
    const totals: Record<string, { name: string; total: number }> = {};
    monthlyDividends.forEach(tx => {
      if (!totals[tx.ticker]) totals[tx.ticker] = { name: tx.name, total: 0 };
      totals[tx.ticker].total += tx.netPayoutEur;
    });
    return Object.entries(totals)
      .map(([ticker, val]) => ({ ticker, ...val }))
      .sort((a, b) => b.total - a.total)[0];
  }, [monthlyDividends]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  return (
    <div className="glass-panel fade-in">
      <div className="hl-header-row mb-5">
        <div>
          <h2 className="hl-title-h2">Auszahlungskalender (Dividenden)</h2>
          <p className="hl-subtitle">Detaillierte Übersicht deiner erhaltenen und prognostizierten Ausschüttungstage.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={handlePrevMonth} className="btn-secondary p-2" title="Vorheriger Monat">
            <ArrowLeft size={16} />
          </button>
          <span className="fw-600 px-3 fs-md text-white" style={{ minWidth: '150px', textAlign: 'center' }}>
            {monthsList[selectedMonth]} {selectedYear}
          </span>
          <button onClick={handleNextMonth} className="btn-secondary p-2" title="Nächster Monat">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI summaries for selected month */}
      <div className="sav-sim-stats-grid mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="glass-panel text-muted-bg p-4">
          <div className="strat-card-title-row">
            <span className="sav-sim-stat-label">Netto-Auszahlung ({baseCurrency})</span>
            <DollarSign size={18} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <p className="sav-sim-stat-value text-gold" style={{ color: 'var(--accent-gold)' }}>
            {formatVal(totalNet)}
          </p>
        </div>

        <div className="glass-panel text-muted-bg p-4">
          <div className="strat-card-title-row">
            <span className="sav-sim-stat-label">Abgeführte Steuern</span>
            <Clock size={18} style={{ color: 'var(--accent-rose)' }} />
          </div>
          <p className="sav-sim-stat-value text-negative" style={{ color: 'var(--accent-rose)' }}>
            {formatVal(totalTax)}
          </p>
        </div>

        <div className="glass-panel text-muted-bg p-4">
          <div className="strat-card-title-row">
            <span className="sav-sim-stat-label">Top Ausschütter</span>
            <TrendingUp size={18} style={{ color: 'var(--accent-blue)' }} />
          </div>
          <p className="sav-sim-stat-value text-purple" style={{ color: 'var(--accent-blue)', fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {topPayer ? `${topPayer.name} (${formatVal(topPayer.total)})` : 'Keine Dividenden'}
          </p>
        </div>
      </div>

      {/* Dividend Transactions List */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tag / Datum</th>
              <th>Wertpapier (Ticker)</th>
              <th>Stückzahl (Anteile)</th>
              <th>Brutto pro Stück</th>
              <th>Einbehaltene Steuern</th>
              <th>Auszahlungsbetrag (Netto)</th>
            </tr>
          </thead>
          <tbody>
            {monthlyDividends.length > 0 ? (
              monthlyDividends.map((div) => {
                const txCurrency = div.currency || 'EUR';
                const divPriceConverted = convertCurrency(div.price, txCurrency, baseCurrency);
                const divTaxConverted = convertCurrency(div.tax, txCurrency, baseCurrency);
                const netPayoutConverted = convertCurrency(div.netPayoutEur, 'EUR', baseCurrency);

                return (
                  <tr key={div.id}>
                    <td className="fw-600">{div.date}</td>
                    <td>
                      <div className="hl-flex-col-name">
                        <span className="hl-name-span">{div.name}</span>
                        <span className="hl-ticker-span">{div.ticker}</span>
                      </div>
                    </td>
                    <td>{div.amount.toLocaleString('de-DE', { maximumFractionDigits: 4 })}</td>
                    <td>{divPriceConverted.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}</td>
                    <td style={{ color: 'var(--accent-rose)' }}>
                      {divTaxConverted > 0 ? `-${divTaxConverted.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}` : '—'}
                    </td>
                    <td style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      +{netPayoutConverted.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="hl-empty-row" style={{ padding: '3rem' }}>
                  Keine Ausschüttungen für diesen Monat erfasst.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
