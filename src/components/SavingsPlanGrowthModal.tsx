import React, { useState, useMemo } from 'react';
import { TrendingUp, X } from 'lucide-react';
import { calculateSavingsGrowthComparison } from '../utils/savingsGrowthUtils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SavingsPlanGrowthModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioValue: number;
  baseCurrency?: string;
}

export const SavingsPlanGrowthModal: React.FC<SavingsPlanGrowthModalProps> = ({
  isOpen,
  onClose,
  portfolioValue,
  baseCurrency = 'EUR'
}) => {
  const [initialCapital, setInitialCapital] = useState<number>(Math.round(portfolioValue || 10000));
  const [monthlyContribution, setMonthlyContribution] = useState<number>(300);
  const [annualReturn, setAnnualReturn] = useState<number>(7.0);
  const [dynamizationPercent, setDynamizationPercent] = useState<number>(2.5);
  const [stepUpAmount, setStepUpAmount] = useState<number>(50);

  const comparison = useMemo(() => {
    return calculateSavingsGrowthComparison({
      initialCapitalEur: initialCapital,
      monthlyContributionEur: monthlyContribution,
      annualReturnPercent: annualReturn,
      annualDynamizationPercent: dynamizationPercent,
      stepUpMonthlyEur: stepUpAmount,
      horizonYears: 35
    });
  }, [initialCapital, monthlyContribution, annualReturn, dynamizationPercent, stepUpAmount]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--card-bg, #0f172a)', border: '1px solid var(--border-color)', borderRadius: '16px',
        maxWidth: '920px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold' }}>Sparplan-Dynamisierungs- & Zinseszins-Rechner</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Auswirkung von jährlichen Gehaltserhöhungs-Dynamisierungen & Step-Ups auf das Endvermögen
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Konstante Sparrate (30J)</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.2rem' }}>
                {comparison.thirtyYearValueFixed.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ohne Dynamisierung</span>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>Mit Dynamisierung (30J)</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.2rem' }}>
                {comparison.thirtyYearValueDynamized.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#10b981' }}>+{dynamizationPercent}% pro Jahr Erhöhung</span>
            </div>

            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.75rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>Zusätzliches Vermögen</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6', marginTop: '0.2rem' }}>
                +{comparison.extraWealthFromDynamization30Y.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#3b82f6' }}>Reiner Dynamisierungs-Effekt</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Startkapital (€):</span>
              <input
                type="number"
                value={initialCapital}
                onChange={e => setInitialCapital(Number(e.target.value) || 0)}
                style={{ width: '100%', padding: '0.35rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Monatliche Sparrate (€):</span>
              <input
                type="number"
                value={monthlyContribution}
                onChange={e => setMonthlyContribution(Number(e.target.value) || 0)}
                style={{ width: '100%', padding: '0.35rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Jährl. Dynamisierung (%):</span>
              <input
                type="number"
                step="0.5"
                value={dynamizationPercent}
                onChange={e => setDynamizationPercent(Number(e.target.value) || 0)}
                style={{ width: '100%', padding: '0.35rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Erwartete Rendite (% p.a.):</span>
              <input
                type="number"
                step="0.5"
                value={annualReturn}
                onChange={e => setAnnualReturn(Number(e.target.value) || 0)}
                style={{ width: '100%', padding: '0.35rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Jährl. Step-Up (+€/Monat):</span>
              <input
                type="number"
                step="10"
                value={stepUpAmount}
                onChange={e => setStepUpAmount(Number(e.target.value) || 0)}
                style={{ width: '100%', padding: '0.35rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
            </div>
          </div>

          {/* Chart */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Vermögenszuwachs & Zinseszins über 35 Jahre</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dynamisiert vs. Konstant vs. Einzahlungen</span>
            </div>
            <div style={{ height: '240px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={comparison.yearlyTrajectory} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={11} tickFormatter={v => `J.${v}`} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={v => `${(v / 1000).toFixed(0)}k €`} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '0.75rem' }}
                    formatter={(val: any, name: any) => [
                      Number(val).toLocaleString('de-DE', { style: 'currency', currency: baseCurrency }),
                      name === 'dynamizedTotalEur' ? 'Dynamisierter Sparplan' : name === 'fixedTotalEur' ? 'Konstanter Sparplan' : 'Eigene Einzahlungen'
                    ]}
                  />
                  <Legend
                    formatter={val => val === 'dynamizedTotalEur' ? 'Dynamisiert (+2.5%/J)' : val === 'fixedTotalEur' ? 'Ohne Dynamisierung' : 'Eigene Einzahlungen'}
                  />
                  <Area type="monotone" dataKey="dynamizedTotalEur" stroke="#10b981" fill="rgba(16, 185, 129, 0.25)" strokeWidth={2} />
                  <Area type="monotone" dataKey="fixedTotalEur" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.15)" strokeWidth={2} />
                  <Area type="monotone" dataKey="fixedContributionsEur" stroke="var(--text-muted)" fill="rgba(255, 255, 255, 0.04)" strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Milestones Table */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>Vermögens-Meilenstein</th>
                  <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>Ohne Dynamisierung</th>
                  <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>Mit Dynamisierung</th>
                  <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>Zeitersparnis</th>
                </tr>
              </thead>
              <tbody>
                {comparison.milestones.map(m => {
                  const fixedY = (m.fixedScenarioMonth / 12).toFixed(1);
                  const dynY = (m.dynamizedScenarioMonth / 12).toFixed(1);
                  const savedY = (m.monthsSaved / 12).toFixed(1);

                  return (
                    <tr key={m.targetAmountEur} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.6rem 0.8rem', fontWeight: 'bold' }}>
                        🎯 {m.label}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                        {m.fixedScenarioMonth > 0 ? `nach ${fixedY} Jahren (${m.fixedScenarioMonth} M.)` : '—'}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', textAlign: 'right', fontWeight: 'bold', color: '#10b981' }}>
                        {m.dynamizedScenarioMonth > 0 ? `nach ${dynY} Jahren (${m.dynamizedScenarioMonth} M.)` : '—'}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', textAlign: 'right', fontWeight: 'bold', color: m.monthsSaved > 0 ? '#3b82f6' : 'var(--text-muted)' }}>
                        {m.monthsSaved > 0 ? `⚡ ${savedY} Jahre früher!` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
