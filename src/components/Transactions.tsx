import React, { useState, useRef, useEffect } from 'react';
import type { Transaction, AssetCategory } from '../types';
import { parseBrokerPdf, parseBrokerText, MOCK_PDF_TEXTS } from './PdfParser';
import { Upload, Plus, Trash2, Info } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  prefilledData?: { ticker: string; name: string; category: AssetCategory; price: number } | null;
  onClearPrefilledData?: () => void;
}

export const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  prefilledData,
  onClearPrefilledData
}) => {
  // Manual transaction form state
  const [type, setType] = useState<'BUY' | 'SELL' | 'DIVIDEND'>('BUY');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [ticker, setTicker] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleSimulateDemo = (brokerKey: keyof typeof MOCK_PDF_TEXTS) => {
    try {
      const mockText = MOCK_PDF_TEXTS[brokerKey];
      const parsed = parseBrokerText(mockText);
      onAddTransaction(parsed);
      alert(`Simulation erfolgreich für ${brokerKey}: ${parsed.type === 'BUY' ? 'Kauf' : parsed.type === 'SELL' ? 'Verkauf' : 'Dividende'} von ${parsed.name} (${parsed.amount} Stück für je ${parsed.price.toFixed(2)} €)`);
    } catch (err) {
      console.error(err);
      alert("Fehler bei der Abrechnungssimulation.");
    }
  };
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [fee, setFee] = useState<string>('0');
  const [tax, setTax] = useState<string>('0');
  const [category, setCategory] = useState<AssetCategory>('Stock');

  useEffect(() => {
    if (prefilledData) {
      setType('BUY');
      setTicker(prefilledData.ticker);
      setName(prefilledData.name);
      setCategory(prefilledData.category);
      setPrice(prefilledData.price.toString());
      if (onClearPrefilledData) {
        onClearPrefilledData();
      }
    }
  }, [prefilledData, onClearPrefilledData]);

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
      <div className="sav-col-flex">
        
        {/* PDF Import Zone */}
        <div className="glass-panel">
          <h2 className="tx-dropzone-title-h2">PDF Import</h2>
          <p className="tx-dropzone-subtitle">
            Ziehe eine Original-Abrechnung von <strong>Trade Republic</strong>, <strong>Scalable Capital</strong>, <strong>ING</strong>, <strong>comdirect</strong>, <strong>DKB</strong> oder <strong>Consorsbank</strong> hierhin.
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
              className="tx-dropzone-input-hidden"
              accept=".pdf" 
              title="Broker Abrechnungs-PDF auswählen"
              aria-label="Broker Abrechnungs-PDF auswählen"
              placeholder="PDF-Abrechnung hochladen"
              onChange={handleFileInput}
            />
            <div className="dropzone-icon">
              <Upload size={24} />
            </div>
            <div className="tx-dropzone-center-text">
              <span className="tx-dropzone-text-main">
                {parsingActive ? 'Lese PDF ein...' : 'Broker PDF auswählen oder reinziehen'}
              </span>
              <span className="tx-dropzone-text-sub">
                Unterstützt PDF-Abrechnungen
              </span>
            </div>
          </div>
          {pdfError && (
            <div className="tx-pdf-error-box">
              <Info size={14} /> {pdfError}
            </div>
          )}

          {/* Demo Simulation buttons */}
          <div className="demo-simulation-zone" style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-color)' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Abrechnung simulieren (Demo-Modus)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleSimulateDemo('TR'); }} className="btn-secondary" style={{ padding: '0.5rem', fontSize: '0.75rem' }}>Trade Republic (Kauf)</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleSimulateDemo('SCALABLE'); }} className="btn-secondary" style={{ padding: '0.5rem', fontSize: '0.75rem' }}>Scalable Capital (Verkauf)</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleSimulateDemo('ING'); }} className="btn-secondary" style={{ padding: '0.5rem', fontSize: '0.75rem' }}>ING Sparplan (Kauf)</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleSimulateDemo('COMDIRECT'); }} className="btn-secondary" style={{ padding: '0.5rem', fontSize: '0.75rem' }}>comdirect (Kauf)</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleSimulateDemo('DKB'); }} className="btn-secondary" style={{ padding: '0.5rem', fontSize: '0.75rem' }}>DKB (Kauf)</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleSimulateDemo('CONSORS'); }} className="btn-secondary" style={{ padding: '0.5rem', fontSize: '0.75rem' }}>Consorsbank (Dividende)</button>
            </div>
          </div>
        </div>

        {/* Manual Form */}
        <div className="glass-panel">
          <h2 className="tx-manual-title">Manuell hinzufügen</h2>
          <form onSubmit={handleSubmit}>
            <div className="tx-form-row-2">
              <div className="form-group">
                <label htmlFor="tx-type" className="form-label">Typ</label>
                <select 
                  id="tx-type"
                  className="form-select" 
                  value={type} 
                  title="Transaktionstyp"
                  aria-label="Transaktionstyp"
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="BUY">Kauf</option>
                  <option value="SELL">Verkauf</option>
                  <option value="DIVIDEND">Dividende</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tx-category" className="form-label">Kategorie</label>
                <select 
                  id="tx-category"
                  className="form-select" 
                  value={category} 
                  title="Asset-Kategorie"
                  aria-label="Asset-Kategorie"
                  onChange={(e) => setCategory(e.target.value as AssetCategory)}
                >
                  <option value="Stock">Aktie</option>
                  <option value="ETF">ETF</option>
                  <option value="Crypto">Krypto</option>
                </select>
              </div>
            </div>

            <div className="tx-form-row-2">
              <div className="form-group">
                <label htmlFor="tx-ticker" className="form-label">Kürzel / Ticker / ISIN</label>
                <input 
                  id="tx-ticker"
                  type="text" 
                  className="form-input" 
                  placeholder="z.B. AAPL oder US0378331002"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tx-name" className="form-label">Name</label>
                <input 
                  id="tx-name"
                  type="text" 
                  className="form-input" 
                  placeholder="z.B. Apple Inc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="tx-form-row-2">
              <div className="form-group">
                <label htmlFor="tx-amount" className="form-label">Anzahl / Anteile</label>
                <input 
                  id="tx-amount"
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
                <label htmlFor="tx-price" className="form-label">Kurs (€)</label>
                <input 
                  id="tx-price"
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

            <div className="tx-form-row-2">
              <div className="form-group">
                <label htmlFor="tx-fee" className="form-label">Gebühren (€)</label>
                <input 
                  id="tx-fee"
                  type="number" 
                  step="any"
                  className="form-input" 
                  placeholder="Gebühren eingeben"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tx-tax" className="form-label">Steuern (€)</label>
                <input 
                  id="tx-tax"
                  type="number" 
                  step="any"
                  className="form-input" 
                  placeholder="Steuern eingeben"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tx-date" className="form-label">Datum</label>
              <input 
                id="tx-date"
                type="date" 
                className="form-input" 
                placeholder="Datum auswählen"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn tx-form-submit-btn-full">
              <Plus size={16} /> Hinzufügen
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Transaction List */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 className="tx-list-title-h2">Aktivitäten-Protokoll</h2>
        <p className="tx-list-subtitle">
          Alle erfassten Käufe, Verkäufe und Dividenden.
        </p>

        <div className="tx-list-scrollable">
          {transactions.length > 0 ? (
            transactions.map((tx) => {
              const isBuy = tx.type === 'BUY';
              const isDiv = tx.type === 'DIVIDEND';
              const total = tx.amount * tx.price;
              
              return (
                <div key={tx.id} className="tx-item-box">
                  <div className="tx-item-left">
                    <span className={`badge badge-${tx.type.toLowerCase()}`}>
                      {tx.type === 'BUY' ? 'Kauf' : tx.type === 'SELL' ? 'Verkauf' : 'Div.'}
                    </span>
                    <div>
                      <span className="tx-item-name-bold">{tx.name}</span>
                      <span className="tx-item-meta">
                        {tx.date} • {tx.amount} Stk. @ {tx.price.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <div className="tx-item-right-wrap">
                    <div className="tx-item-right-text">
                      <span className="tx-item-total-value" style={{ color: isBuy ? '#60a5fa' : isDiv ? 'var(--accent-gold)' : 'var(--accent-rose)' }}>
                        {isBuy ? '-' : '+'}{total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </span>
                      {tx.fee > 0 && (
                        <span className="tx-item-fee-text">
                          inkl. {tx.fee.toFixed(2)} € Gebühr
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="tx-item-trash-btn"
                      title="Transaktion löschen"
                      aria-label="Transaktion löschen"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="tx-list-empty">
              Keine Transaktionen erfasst.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
