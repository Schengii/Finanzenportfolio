import React, { useState } from 'react';
import { X, Lock, ShieldCheck, RefreshCw, Sun, Moon, History, RotateCcw, Trash2, ShieldAlert, Send } from 'lucide-react';
import { encryptData } from '../services/cryptoStorage';
import { usePortfolio } from '../context/PortfolioContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseCurrency: 'EUR' | 'USD' | 'CHF' | 'GBP';
  onBaseCurrencyChange: (cur: 'EUR' | 'USD' | 'CHF' | 'GBP') => void;
  isDarkMode: boolean;
  onToggleDarkMode: (dark: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  baseCurrency,
  onBaseCurrencyChange,
  isDarkMode,
  onToggleDarkMode
}) => {
  const { 
    snapshots, 
    restoreSnapshot, 
    deleteSnapshot, 
    createSnapshot, 
    autoLockMinutes, 
    setAutoLockMinutes, 
    lockVault 
  } = usePortfolio();

  const [pinPassword, setPinPassword] = useState('');
  const [encryptionStatus, setEncryptionStatus] = useState<string | null>(null);
  const [autoRefreshMin, setAutoRefreshMin] = useState<number>(5);
  const [snapshotSuccess, setSnapshotSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEnableEncryption = async () => {
    if (!pinPassword || pinPassword.length < 4) {
      alert('Bitte wähle eine Master-PIN oder ein Passwort mit mindestens 4 Zeichen.');
      return;
    }

    try {
      const rawData = localStorage.getItem('finanz_portfolios') || '[]';
      const cipher = await encryptData(rawData, pinPassword);
      localStorage.setItem('finanz_encrypted_vault', cipher);
      setEncryptionStatus('Passwortschutz & AES-GCM 256-Bit Verschlüsselung erfolgreich aktiviert!');
      setPinPassword('');
    } catch {
      alert('Fehler beim Verschlüsseln der Daten.');
    }
  };

  const handleManualSnapshot = () => {
    createSnapshot('Manuell angelegter Snapshot');
    setSnapshotSuccess('Wiederherstellungspunkt erfolgreich gesichert!');
    setTimeout(() => setSnapshotSuccess(null), 3000);
  };

  const handleRestore = (id: string, desc: string) => {
    if (confirm(`Möchtest du das Portfolio wirklich auf den Stand von "${desc}" zurücksetzen?`)) {
      restoreSnapshot(id);
      setSnapshotSuccess(`Erfolgreich auf Stand "${desc}" zurückgesetzt!`);
      setTimeout(() => setSnapshotSuccess(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Einstellungen, Tresor & Snapshots</h3>
              <p className="text-xs text-slate-400">Passwortschutz, Rolling Backups, Auto-Lock & Währung</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs overflow-y-auto flex-1">
          
          {/* Security / Encryption Section */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Web Crypto Master-PIN Tresor (AES-GCM 256)
              </div>
              <button
                onClick={() => { lockVault(); onClose(); }}
                className="px-2.5 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded border border-amber-500/30 font-semibold"
              >
                Tresor jetzt sperren
              </button>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Sichere deine Depotdaten lokal mit einem Master-Passwort. Nur mit korrekter PIN lassen sich die Daten entschlüsseln.
            </p>

            <div className="flex gap-2">
              <input
                type="password"
                value={pinPassword}
                onChange={(e) => setPinPassword(e.target.value)}
                placeholder="Master PIN oder Passwort..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleEnableEncryption}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 font-semibold text-white rounded-lg transition-colors"
              >
                Aktivieren
              </button>
            </div>

            {encryptionStatus && (
              <p className="text-emerald-400 font-semibold text-[11px]">{encryptionStatus}</p>
            )}
          </div>

          {/* Auto-Lock Inactivity Timer */}
          <div className="flex justify-between items-center p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
            <div>
              <span className="font-bold text-slate-200 block flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Tresor Auto-Lock (Inaktivitäts-Timer)
              </span>
              <span className="text-slate-400 block">Sperrt den Tresor nach Inaktivität automatisch ab</span>
            </div>
            <select
              value={autoLockMinutes}
              onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 font-semibold text-slate-200 focus:outline-none"
            >
              <option value={0}>Deaktiviert (Nie)</option>
              <option value={5}>Nach 5 Minuten</option>
              <option value={15}>Nach 15 Minuten</option>
              <option value={30}>Nach 30 Minuten</option>
              <option value={60}>Nach 60 Minuten</option>
            </select>
          </div>

          {/* Rolling Snapshots & Rollback Studio */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <History className="w-4 h-4 text-blue-400" /> Versionierte Snapshots & 1-Klick Rollback
              </div>
              <button
                onClick={handleManualSnapshot}
                className="px-3 py-1 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded border border-blue-500/30 font-semibold"
              >
                + Snapshot anlegen
              </button>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Vor jedem CSV- oder PDF-Import wird automatisch ein Snapshot gesichert (bis zu 5 Stände). Bei fehlerhaften Buchungen kannst du mit 1 Klick zurückspringen.
            </p>

            {snapshotSuccess && (
              <p className="text-emerald-400 font-semibold text-[11px]">{snapshotSuccess}</p>
            )}

            {snapshots.length === 0 ? (
              <div className="p-3 text-center text-slate-500 bg-slate-900/50 rounded-lg">
                Noch keine Snapshots angelegt. Vor dem nächsten Import wird automatisch einer erstellt.
              </div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {snapshots.map(snap => (
                  <div key={snap.id} className="flex items-center justify-between p-2.5 bg-slate-900/70 border border-slate-800 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-200">{snap.description}</div>
                      <div className="text-[10px] text-slate-400">
                        {snap.timestamp} • {snap.transactionCount} Transaktionen • {snap.totalValueEur.toLocaleString('de-DE')} €
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRestore(snap.id, snap.description)}
                        className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded border border-emerald-500/30 flex items-center gap-1 text-[11px] font-semibold"
                        title="Diesen Stand wiederherstellen"
                      >
                        <RotateCcw className="w-3 h-3" /> Rollback
                      </button>
                      <button
                        onClick={() => deleteSnapshot(snap.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded"
                        title="Snapshot löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Automated Webhook Push-Trigger */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-400" /> Automatisierter Webhook Push-Backup
              </span>
              <button
                onClick={async () => {
                  const url = localStorage.getItem('finanz_webhook_url');
                  if (!url) {
                    alert('Bitte trage zuerst eine Webhook URL ein!');
                    return;
                  }
                  try {
                    const payload = {
                      event: 'PORTFOLIO_BACKUP_DISPATCH',
                      timestamp: new Date().toISOString(),
                      portfolioCount: 1,
                      encryptedVault: localStorage.getItem('finanz_portfolios_vault') || 'local_unencrypted'
                    };
                    await fetch(url, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                    });
                    alert('✅ Webhook erfolgreich ausgelöst!');
                  } catch (err: any) {
                    alert('⚠️ Fehler beim Senden: ' + (err?.message || 'Netzwerkfehler'));
                  }
                }}
                className="px-3 py-1 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 rounded border border-emerald-500/30 font-semibold"
              >
                Test-Push senden
              </button>
            </div>
            <p className="text-slate-400">
              Sende deinen AES-256 verschlüsselten Tresor automatisch an Home Assistant, n8n oder ein privates REST-Backup-Ziel.
            </p>
            <input
              type="text"
              defaultValue={typeof localStorage !== 'undefined' ? localStorage.getItem('finanz_webhook_url') || '' : ''}
              onChange={(e) => {
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem('finanz_webhook_url', e.target.value);
                }
              }}
              placeholder="https://n8n.meinedomain.de/webhook/portfolio-backup"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-slate-200 text-xs"
            />
          </div>

          {/* Currency Selection */}
          <div className="flex justify-between items-center p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
            <div>
              <span className="font-bold text-slate-200 block">Haupt-Währung</span>
              <span className="text-slate-400 block">Alle Depotwerte werden in dieser Währung dargestellt</span>
            </div>
            <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
              {(['EUR', 'USD', 'CHF', 'GBP'] as const).map((cur) => (
                <button
                  key={cur}
                  onClick={() => onBaseCurrencyChange(cur)}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${baseCurrency === cur ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Refresh */}
          <div className="flex justify-between items-center p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
            <div>
              <span className="font-bold text-slate-200 block flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" /> Auto-Refresh Intervall
              </span>
              <span className="text-slate-400 block">Echtzeit-Kurse im Hintergrund aktualisieren</span>
            </div>
            <select
              value={autoRefreshMin}
              onChange={(e) => setAutoRefreshMin(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 font-semibold text-slate-200 focus:outline-none"
            >
              <option value={0}>Aus (Manuell)</option>
              <option value={1}>Alle 1 Minute</option>
              <option value={5}>Alle 5 Minuten</option>
              <option value={15}>Alle 15 Minuten</option>
            </select>
          </div>

          {/* Theme */}
          <div className="flex justify-between items-center p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
            <div>
              <span className="font-bold text-slate-200 block">Erscheinungsbild</span>
              <span className="text-slate-400 block">Dunkelmodus vs. Hellmodus</span>
            </div>
            <button
              onClick={() => onToggleDarkMode(!isDarkMode)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg font-semibold text-slate-200 hover:bg-slate-800"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              {isDarkMode ? 'Dunkel' : 'Hell'}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-all">
            Speichern & Schließen
          </button>
        </div>

      </div>
    </div>
  );
};

