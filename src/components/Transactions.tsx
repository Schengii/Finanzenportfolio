import React, { useState, useRef } from 'react';
import type { Transaction, AssetCategory } from '../types';
import { parseBrokerPdf } from './PdfParser';
import { Upload, Plus, Trash2, Info } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction
}) => {
  // Manual transaction form state
  const [type, setType] = useState<'BUY' | 'SELL' | 'DIVIDEND'>('BUY');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [ticker, setTicker] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [fee, setFee] = useState<string>('0');
  const [tax, setTax] = useState<string>('0');
  const [category, setCategory] = useState<AssetCategory>('Stock');

  // Drag and drop state
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [parsingActive, setParsingActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !name || !amount || !price) {
      alert('Bitte fülle alle Pflichtfelder aus.');
      return;
    }

    onAddTransaction({
      type,
      date: date.split('-').reverse().join('.'), // Convert YYYY-MM-DD to DD.MM.YYYY
      ticker: ticker.toUpperCase(),
      name,
      amount: parseFloat(amount),
      price: parseFloat(price),
      fee: parseFloat(fee) || 0,
      tax: parseFloat(tax) || 0,
      category
    });

    // Reset fields except date and category
    setTicker('');
    setName('');
    setAmount('');
    setPrice('');
    setFee('0');
    setTax('0');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setPdfError("Nur PDF-Dateien werden unterstützt.");
      return;
    }
    setPdfError(null);
    setParsingActive(true);
    try {
      const parsed = await parseBrokerPdf(file);
      onAddTransaction(parsed);
      alert(`PDF erfolgreich eingelesen: ${parsed.type === 'BUY' ? 'Kauf' : parsed.type === 'SELL' ? 'Verkauf' : 'Dividende'} von ${parsed.name} (${parsed.amount} Stück für je ${parsed.price.toFixed(2)} €)`);
    } catch (err) {
      console.error(err);
      setPdfError("Fehler beim Verarbeiten des PDFs. Bitte stelle sicher, dass es sich um eine Originalabrechnung (z.B. Trade Republic) handelt.");
    } finally {
      setParsingActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  return (
    <div className="grid-main fade-in">
      {/* Left Column: Import / PDF Drop and Manual Entry Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* PDF Import Zone */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>PDF Import</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Ziehe eine Original-Abrechnung von <strong>Trade Republic</strong> oder <strong>Scalable Capital</strong> hierhin.
          </p>

          <div 
            className={`dropzone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".pdf" 
              onChange={handleFileInput}
            />
            <div className="dropzone-icon">
              <Upload size={24} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 600, display: 'block', fontSize: '0.95rem' }}>
                {parsingActive ? 'Lese PDF ein...' : 'Broker PDF auswählen oder reinziehen'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Unterstützt PDF-Abrechnungen
              </span>
            </div>
          </div>
          {pdfError && (
            <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginTop: '0.75rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              <Info size={14} /> {pdfError}
            </div>
          )}
        </div>

        {/* Manual Form */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Manuell hinzufügen</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Typ</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value as any)}>
                  <option value="BUY">Kauf</option>
                  <option value="SELL">Verkauf</option>
                  <option value="DIVIDEND">Dividende</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Kategorie</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value as AssetCategory)}>
                  <option value="Stock">Aktie</option>
                  <option value="ETF">ETF</option>
                  <option value="Crypto">Krypto</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Kürzel / Ticker / ISIN</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="z.B. AAPL oder US0378331002"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="z.B. Apple Inc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Anzahl / Anteile</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  placeholder="z.B. 10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kurs (€)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  placeholder="z.B. 175.50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Gebühren (€)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Steuern (€)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Datum</label>
              <input 
                type="date" 
                className="form-input" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Plus size={16} /> Hinzufügen
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Transaction List */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Aktivitäten-Protokoll</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Alle erfassten Käufe, Verkäufe und Dividenden.
        </p>

        <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '600px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {transactions.length > 0 ? (
            transactions.map((tx) => {
              const isBuy = tx.type === 'BUY';
              const isDiv = tx.type === 'DIVIDEND';
              const total = tx.amount * tx.price;
              
              return (
                <div 
                  key={tx.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.01)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span className={`badge badge-${tx.type.toLowerCase()}`}>
                      {tx.type === 'BUY' ? 'Kauf' : tx.type === 'SELL' ? 'Verkauf' : 'Div.'}
                    </span>
                    <div>
                      <span style={{ fontWeight: 600, display: 'block', fontSize: '0.9rem' }}>{tx.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {tx.date} • {tx.amount} Stk. @ {tx.price.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        fontWeight: 600, 
                        display: 'block', 
                        fontSize: '0.9rem',
                        color: isBuy ? '#60a5fa' : isDiv ? 'var(--accent-gold)' : 'var(--accent-rose)'
                      }}>
                        {isBuy ? '-' : '+'}{total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </span>
                      {tx.fee > 0 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          inkl. {tx.fee.toFixed(2)} € Gebühr
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => onDeleteTransaction(tx.id)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'var(--text-muted)', 
                        cursor: 'pointer',
                        padding: '0.25rem',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              Keine Transaktionen erfasst.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
