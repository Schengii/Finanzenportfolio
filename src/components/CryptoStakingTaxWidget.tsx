import React, { useMemo } from 'react';
import type { Transaction } from '../types';
import { Coins, ShieldCheck, AlertTriangle } from 'lucide-react';
import { calculateCryptoStakingTaxSummary } from './performanceUtils';

interface CryptoStakingTaxWidgetProps {
  transactions: Transaction[];
  baseCurrency?: string;
}

export const CryptoStakingTaxWidget: React.FC<CryptoStakingTaxWidgetProps> = ({
  transactions,
  baseCurrency = 'EUR'
}) => {
  const summary = useMemo(() => {
    return calculateCryptoStakingTaxSummary(transactions);
  }, [transactions]);

  if (summary.stakingTransactionsCount === 0) return null;

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coins className="text-amber-500" size={18} /> Krypto-Staking & DeFi Steuer-Tracker (§ 22 Nr. 3 EStG)
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Einnahmen aus Staking, Lending & Airdrops mit automatischer Überwachung der 256 € Freigrenze.
          </p>
        </div>

        <span style={{
          padding: '0.25rem 0.6rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          background: summary.isTaxFree ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: summary.isTaxFree ? '#10b981' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          {summary.isTaxFree ? <ShieldCheck size={13} /> : <AlertTriangle size={13} />}
          {summary.isTaxFree ? 'Steuerfrei (< 256 € Freigrenze)' : 'Steuerpflichtig (> 256 € Freigrenze)'}
        </span>
      </div>

      {/* Progress Bar for 256 Euro Freigrenze */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Freigrenze ausgeschöpft: {summary.exemptionUsedPercent.toFixed(1)}%</span>
          <span style={{ fontWeight: 'bold' }}>
            {summary.totalStakingIncomeEur.toFixed(2)} € / {summary.exemptionLimitEur.toFixed(2)} €
          </span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${summary.exemptionUsedPercent}%`,
            height: '100%',
            background: summary.isTaxFree ? '#10b981' : '#ef4444',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Staking Einnahmen</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.2rem' }}>
            {summary.totalStakingIncomeEur.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{summary.stakingTransactionsCount} Ertragsbuchungen</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Geschätzte Einkommensteuer</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: summary.isTaxFree ? '#10b981' : '#ef4444', marginTop: '0.2rem' }}>
            {summary.estimatedIncomeTaxEur.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {summary.isTaxFree ? '0 € dank Freigrenze' : 'Zu versteuern mit persönl. Steuersatz'}
          </div>
        </div>
      </div>
    </div>
  );
};
