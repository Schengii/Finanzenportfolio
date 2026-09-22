import React, { useState } from 'react';
import { Bell, Plus, Trash2, ArrowUp, ArrowDown, BellRing, X, ToggleRight } from 'lucide-react';
import type { PriceAlert, Holding } from '../types';
import { requestNotificationPermission } from '../utils/alertUtils';

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  holdings: Holding[];
  alerts: PriceAlert[];
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => void;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  baseCurrency?: string;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  holdings,
  alerts,
  onAddAlert,
  onToggleAlert,
  onDeleteAlert,
  baseCurrency = 'EUR'
}) => {
  const [selectedTicker, setSelectedTicker] = useState<string>(holdings[0]?.ticker || '');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW' | 'DAILY_DROP_PCT'>('ABOVE');
  const [targetValue, setTargetValue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });

  if (!isOpen) return null;

  const currentHolding = holdings.find(h => h.ticker.toUpperCase() === selectedTicker.toUpperCase());

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setPermissionStatus(perm);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetValue);
    if (isNaN(val) || val <= 0) return;

    const holdingName = currentHolding?.name || selectedTicker;

    onAddAlert({
      ticker: selectedTicker.toUpperCase(),
      name: holdingName,
      condition,
      targetValue: val,
      currentValue: currentHolding?.currentPrice,
      notes: notes.trim() || undefined
    });

    setTargetValue('');
    setNotes('');
  };

  const activeAlerts = alerts.filter(a => a.isActive);
  const triggeredAlerts = alerts.filter(a => !a.isActive && a.triggeredAt);

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--card-bg, #0f172a)', border: '1px solid var(--border-color)', borderRadius: '16px',
        maxWidth: '780px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderRadius: '12px' }}>
              <BellRing size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Kursalarme & Push-Benachrichtigungen
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Erhalte Benachrichtigungen bei Erreichen von Kursmarken, Stop-Loss oder extremen Tagesverlusten
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Notification Permission Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1.25rem',
            background: permissionStatus === 'granted' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
            border: `1px solid ${permissionStatus === 'granted' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Bell size={18} color={permissionStatus === 'granted' ? '#10b981' : '#f59e0b'} />
              <div style={{ fontSize: '0.82rem' }}>
                <strong>Browser-Push:</strong> {permissionStatus === 'granted' ? 'Aktiviert (Benachrichtigungen werden angezeigt)' : 'Noch nicht erlaubt oder blockiert'}
              </div>
            </div>
            {permissionStatus !== 'granted' && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleRequestPermission}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}
              >
                Erlaubnis anfordern
              </button>
            )}
          </div>

          {/* New Alert Form */}
          <form onSubmit={handleCreateAlert} style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} color="#3b82f6" /> Neuen Kursalarm anlegen
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
              
              {/* Asset Select */}
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Wertpapier / Asset</label>
                <select
                  className="form-select"
                  value={selectedTicker}
                  onChange={(e) => setSelectedTicker(e.target.value)}
                  required
                >
                  {holdings.map(h => (
                    <option key={h.ticker} value={h.ticker}>
                      {h.name} ({h.ticker}) - {h.currentPrice?.toFixed(2)} €
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Bedingung</label>
                <select
                  className="form-select"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                >
                  <option value="ABOVE">Kurs steigt über (&gt;= Zielkurs)</option>
                  <option value="BELOW">Kurs fällt unter (&lt;= Stop-Loss)</option>
                  <option value="DAILY_DROP_PCT">Tagesverlust übertrifft (&gt;= X%)</option>
                </select>
              </div>

              {/* Target Price */}
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  {condition === 'DAILY_DROP_PCT' ? 'Schwelle in Prozent (%)' : `Zielkurs in ${baseCurrency}`}
                </label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder={condition === 'DAILY_DROP_PCT' ? 'z. B. 5' : currentHolding?.currentPrice ? (currentHolding.currentPrice * 1.1).toFixed(2) : '100.00'}
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Notiz (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="z. B. Teilgewinnmitnahme / Nachkauf"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem' }}
              >
                <Bell size={15} /> Alarm scharfschalten
              </button>
            </div>
          </form>

          {/* Active Alerts List */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Aktive Kursalarme ({activeAlerts.length})
            </div>

            {activeAlerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Keine aktiven Kursalarme eingerichtet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activeAlerts.map(alert => (
                  <div
                    key={alert.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{alert.name} ({alert.ticker})</span>
                        {alert.condition === 'ABOVE' && <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}><ArrowUp size={12} /> &gt;= {alert.targetValue} {baseCurrency}</span>}
                        {alert.condition === 'BELOW' && <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}><ArrowDown size={12} /> &lt;= {alert.targetValue} {baseCurrency}</span>}
                        {alert.condition === 'DAILY_DROP_PCT' && <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>Absturz &gt;= {alert.targetValue}%</span>}
                      </div>
                      {alert.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {alert.notes}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => onToggleAlert(alert.id)}
                        style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', padding: 0 }}
                        title="Pausieren"
                      >
                        <ToggleRight size={22} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteAlert(alert.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                        title="Löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Triggered Alerts History */}
          {triggeredAlerts.length > 0 && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Ausgelöste Alarme ({triggeredAlerts.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {triggeredAlerts.map(alert => (
                  <div
                    key={alert.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: 'rgba(245, 158, 11, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '10px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#f59e0b' }}>
                        🔔 Ausgelöst am {alert.triggeredAt}: {alert.name} ({alert.ticker})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Zielkurs: {alert.targetValue} {baseCurrency} • Letzter Kurs: {alert.currentValue?.toFixed(2)} {baseCurrency}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteAlert(alert.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      title="Aus Verlauf löschen"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
};
