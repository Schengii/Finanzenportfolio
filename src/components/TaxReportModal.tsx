import React, { useState } from 'react';
import type { Portfolio } from '../types';
import { calculateEnhancedGermanTax, calculateVorabpauschaleDetails } from './performanceUtils';
import { FileText, Printer, X } from 'lucide-react';

interface TaxReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio;
  taxExemptionLimit: number;
}

export const TaxReportModal: React.FC<TaxReportModalProps> = ({
  isOpen,
  onClose,
  portfolio,
  taxExemptionLimit
}) => {
  if (!isOpen) return null;

  const [personalTaxRate, setPersonalTaxRate] = useState<number>(18);
  const [enableGuenstiger, setEnableGuenstiger] = useState<boolean>(true);
  const [hasChurchTax, setHasChurchTax] = useState<boolean>(false);

  const currentYear = new Date().getFullYear();

  const enhancedTax = calculateEnhancedGermanTax(
    portfolio.transactions,
    taxExemptionLimit,
    portfolio.taxLossPools?.stockLossPool || 0,
    portfolio.taxLossPools?.generalLossPool || 0,
    enableGuenstiger ? personalTaxRate : undefined,
    hasChurchTax
  );

  const vorabpauschaleRes = calculateVorabpauschaleDetails(
    portfolio.transactions.map(t => ({
      ticker: t.ticker,
      name: t.name,
      category: t.category,
      shares: t.amount,
      averageBuyPrice: t.price,
      currentPrice: t.price,
      totalCost: t.amount * t.price,
      currentValue: t.amount * t.price,
      totalGain: 0,
      totalGainPercent: 0,
      portfolioWeight: 0,
      yieldOnCost: 0,
      teilfreistellungRate: 0.30
    })),
    0.0229
  );
  const vorabpauschale = vorabpauschaleRes.totalVorabpauschale;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--card-bg, #0f172a)', border: '1px solid var(--border-color)', borderRadius: '16px',
        maxWidth: '800px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px' }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Steuer- & Verlusttöpfe Report ({currentYear})</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Anlage KAP / KAP-INV (§ 20 Abs. 6 EStG Verlustverrechnung & Günstigerprüfung)</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-secondary" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Printer size={14} /> Drucken / PDF
            </button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Interactive Günstigerprüfung & KiSt config */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <input
                  type="checkbox"
                  checked={enableGuenstiger}
                  onChange={e => setEnableGuenstiger(e.target.checked)}
                />
                Günstigerprüfung anwenden
              </label>
              {enableGuenstiger && (
                <div style={{ marginTop: '0.3rem' }}>
                  <input
                    type="number"
                    value={personalTaxRate}
                    onChange={e => setPersonalTaxRate(Number(e.target.value))}
                    min="0"
                    max="45"
                    style={{ width: '80px', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>% persönlicher Steuersatz</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <input
                  type="checkbox"
                  checked={hasChurchTax}
                  onChange={e => setHasChurchTax(e.target.checked)}
                />
                Kirchensteuerpflichtig (8% / 9%)
              </label>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Autom. Berücksichtigung in Formel
              </div>
            </div>
          </div>

          {/* Loss Pools (§ 20 Abs. 6 EStG) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 'bold' }}>📉 Aktien-Verlusttopf (§ 20 Abs. 6 S. 4 EStG)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ef4444', marginTop: '0.25rem' }}>
                {enhancedTax.stockLossPoolRemainingEur.toFixed(2)} €
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Ausschließlich mit Gewinnen aus Aktienverkäufen verrechenbar.
              </div>
            </div>

            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 'bold' }}>📊 Sonstiger Verlusttopf (ETFs, Zinsen, Krypto)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3b82f6', marginTop: '0.25rem' }}>
                {enhancedTax.generalLossPoolRemainingEur.toFixed(2)} €
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Verrechenbar mit ETFs, Fonds, Dividenden und Zinsen.
              </div>
            </div>
          </div>

          {/* Detailed Tax Breakdown Table */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', fontWeight: 'bold', fontSize: '0.85rem' }}>
              Steuerberechnung & Freibeträge
            </div>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sparer-Pauschbetrag</span>
                <strong>{taxExemptionLimit.toFixed(2)} €</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Zu versteuernde Erträge (nach Teilfreistellung)</span>
                <strong style={{ color: '#10b981' }}>{enhancedTax.taxableGainsFinalEur.toFixed(2)} €</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                <span>Standard-Abgeltungsteuer (25% + Soli)</span>
                <strong>{enhancedTax.abgeltungsteuerStandardEur.toFixed(2)} €</strong>
              </div>
              {enhancedTax.guenstigerpruefungTaxEur !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 'bold' }}>
                  <span>Steuer nach Günstigerprüfung ({personalTaxRate}%)</span>
                  <span>{enhancedTax.guenstigerpruefungTaxEur.toFixed(2)} € (Ersparnis: {enhancedTax.taxSavingViaGuenstigerpruefungEur.toFixed(2)} €)</span>
                </div>
              )}
              {hasChurchTax && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a855f7' }}>
                  <span>Kirchensteuer (geschätzt)</span>
                  <span>{enhancedTax.churchTaxEstimateEur.toFixed(2)} €</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                <span>Geschätzte Vorabpauschale 2025/2026 (§ 18 InvStG)</span>
                <strong style={{ color: '#3b82f6' }}>{vorabpauschale.toFixed(2)} €</strong>
              </div>
            </div>
          </div>

          {/* Official Anlage KAP Tax Return Mapping Table */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(59, 130, 246, 0.08)', fontWeight: 'bold', fontSize: '0.85rem', color: '#3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📑 Offizielle Kennziffern für Anlage KAP (WISO / Taxfix / Steuerberater)</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Zeile 7 (Inländische Kapitalerträge):</span>
                <strong>{enhancedTax.taxableGainsFinalEur.toFixed(2)} €</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Zeile 8 (Gewinne aus Aktienverkäufen):</span>
                <strong>{enhancedTax.realizedStockGainsEur.toFixed(2)} €</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Zeile 14 (Verluste ohne Aktien):</span>
                <strong style={{ color: '#3b82f6' }}>{enhancedTax.realizedOtherLossesEur.toFixed(2)} €</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Zeile 15 (Verluste aus Aktienverkäufen):</span>
                <strong style={{ color: '#ef4444' }}>{enhancedTax.realizedStockLossesEur.toFixed(2)} €</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Zeile 16/17 (In Anspruch genommener Sparer-Pauschbetrag):</span>
                <strong>{Math.min(taxExemptionLimit, enhancedTax.taxableGainsFinalEur).toFixed(2)} €</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
