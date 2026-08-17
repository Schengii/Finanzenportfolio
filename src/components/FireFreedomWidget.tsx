import React, { useState, useMemo } from 'react';
import { Flame, AlertTriangle, CheckCircle } from 'lucide-react';
import { simulateFireWithdrawal } from './performanceUtils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface FireFreedomWidgetProps {
  totalValue: number;
  monthlyDividends?: number;
  baseCurrency?: string;
}

export const FireFreedomWidget: React.FC<FireFreedomWidgetProps> = ({
  totalValue,
  baseCurrency = 'EUR'
}) => {
  const [monthlyExpenses, setMonthlyExpenses] = useState(2500);
  const [healthInsurance, setHealthInsurance] = useState(350);
  const [inflation] = useState(2.0);
  const [expectedReturn] = useState(7.0);
  const [years, setYears] = useState(30);
  const [strategy, setStrategy] = useState<'CONSTANT_INFLATION_ADJUSTED' | 'VARIABLE_GUARDRAILS' | 'VPW' | 'FIXED_4_PERCENT'>('VARIABLE_GUARDRAILS');
  const [includeTax] = useState(true);

  // Target FIRE Capital based on 4% Rule (25x annual expenses)
  const targetCapital = useMemo(() => {
    return (monthlyExpenses + healthInsurance) * 12 * 25;
  }, [monthlyExpenses, healthInsurance]);

  const fireProgress = useMemo(() => {
    return targetCapital > 0 ? Math.min(100, (totalValue / targetCapital) * 100) : 0;
  }, [totalValue, targetCapital]);

  // Simulation run
  const simResult = useMemo(() => {
    return simulateFireWithdrawal({
      initialPortfolioValue: totalValue,
      monthlyExpensesEur: monthlyExpenses,
      annualInflationPercent: inflation,
      expectedAnnualReturnPercent: expectedReturn,
      expectedAnnualYieldPercent: 3.5,
      retirementYears: years,
      withdrawalStrategy: strategy,
      includeCapitalGainsTax: includeTax,
      effectiveTaxRatePercent: 18.5, // Teilfreistellungs-bereinigt
      monthlyHealthInsuranceEur: healthInsurance
    });
  }, [totalValue, monthlyExpenses, inflation, expectedReturn, years, strategy, includeTax, healthInsurance]);

  const chartData = useMemo(() => {
    return simResult.yearlyBreakdown.map(y => ({
      name: `J${y.year}`,
      Depotwert: Math.round(y.endingValue),
      Entnahme: Math.round(y.annualWithdrawal)
    }));
  }, [simResult]);

  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame className="text-orange-500" size={20} /> FIRE & Entnahmeplaner (Financial Independence)
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Simuliere Entnahmestrategien (Trinity Study, Guyton-Klinger Guardrails, VPW) mit Steuern & Krankenversicherung.
          </p>
        </div>
        <span style={{
          padding: '0.3rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          background: simResult.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          color: simResult.success ? '#10b981' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          {simResult.success ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
          {simResult.success ? 'Kapitalerhalt gesichert' : `Depot erschöpft nach ${simResult.ruinYear} Jahren`}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>FIRE Fortschritt: {fireProgress.toFixed(1)}%</span>
          <span style={{ fontWeight: '600' }}>
            {totalValue.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })} / {targetCapital.toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })}
          </span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${fireProgress}%`, height: '100%', background: 'linear-gradient(90deg, #f97316, #10b981)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Settings Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monatl. Lebenskosten (€)</label>
          <input
            type="number"
            value={monthlyExpenses}
            onChange={e => setMonthlyExpenses(Number(e.target.value))}
            style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', marginTop: '0.2rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Krankenversicherung / Mo. (€)</label>
          <input
            type="number"
            value={healthInsurance}
            onChange={e => setHealthInsurance(Number(e.target.value))}
            style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', marginTop: '0.2rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Entnahmestrategie</label>
          <select
            value={strategy}
            onChange={e => setStrategy(e.target.value as any)}
            style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', marginTop: '0.2rem' }}
          >
            <option value="VARIABLE_GUARDRAILS">Guyton-Klinger Guardrails (Dynamisch)</option>
            <option value="CONSTANT_INFLATION_ADJUSTED">4% Trinity (Inflationsbereinigt)</option>
            <option value="VPW">VPW (Variable Percentage Withdrawal)</option>
            <option value="FIXED_4_PERCENT">Fix 4% des Jahresdepotwerts</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Entnahme-Dauer: {years} Jahre</label>
          <input
            type="range"
            min="10"
            max="50"
            value={years}
            onChange={e => setYears(Number(e.target.value))}
            style={{ width: '100%', marginTop: '0.4rem' }}
          />
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '220px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
            <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: any) => [Number(value).toLocaleString('de-DE', { style: 'currency', currency: baseCurrency })]}
              contentStyle={{ background: '#1e293b', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            />
            <Line type="monotone" dataKey="Depotwert" stroke="#10b981" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
