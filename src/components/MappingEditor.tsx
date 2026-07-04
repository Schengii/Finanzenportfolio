import React, { useState } from 'react';
import type { AssetMappingRule, AssetCategory } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface MappingEditorProps {
  rules: AssetMappingRule[];
  onAddRule: (rule: Omit<AssetMappingRule, 'id'>) => void;
  onRemoveRule: (id: string) => void;
}

export const MappingEditor: React.FC<MappingEditorProps> = ({
  rules,
  onAddRule,
  onRemoveRule
}) => {
  const [pattern, setPattern] = useState('');
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Stock');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pattern.trim() || !ticker.trim() || !name.trim()) {
      alert('Bitte fülle alle Pflichtfelder aus.');
      return;
    }
    onAddRule({
      pattern: pattern.trim(),
      ticker: ticker.trim().toUpperCase(),
      name: name.trim(),
      category
    });
    setPattern('');
    setTicker('');
    setName('');
  };

  return (
    <div className="glass-panel fade-in">
      <h2 className="wl-add-form-title m-0">Broker PDF Mapping-Regeln</h2>
      <p className="hl-subtitle mb-4">
        Definiere Regeln, um ISINs oder Textmuster aus PDF-Abrechnungen automatisch auf die richtigen Ticker und Kategorien in deinem Portfolio abzubilden.
      </p>

      <div className="grid-main">
        {/* Left Column: Form */}
        <div className="sav-col-flex">
          <form onSubmit={handleSubmit} className="glass-panel text-muted-bg p-4" style={{ border: 'none' }}>
            <h3 className="tx-manual-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Neue Mapping-Regel</h3>
            
            <div className="form-group mb-3">
              <label className="form-label">Suchmuster (z.B. ISIN oder Text)</label>
              <input
                type="text"
                className="form-input"
                placeholder="z.B. US0378331002 oder Apple"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Ticker (Kürzel)</label>
              <input
                type="text"
                className="form-input"
                placeholder="z.B. AAPL"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Name des Assets</label>
              <input
                type="text"
                className="form-input"
                placeholder="z.B. Apple Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Kategorie</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
              >
                <option value="Stock">Aktie</option>
                <option value="ETF">ETF</option>
                <option value="Crypto">Krypto</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Regel hinzufügen
            </button>
          </form>
        </div>

        {/* Right Column: Rule list */}
        <div className="glass-panel text-muted-bg p-0" style={{ border: 'none' }}>
          <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <table className="custom-table fs-sm">
              <thead>
                <tr>
                  <th>Muster</th>
                  <th>Ziel-Ticker</th>
                  <th>Asset-Name</th>
                  <th>Kategorie</th>
                  <th style={{ width: '50px' }}>Aktion</th>
                </tr>
              </thead>
              <tbody>
                {rules.length > 0 ? (
                  rules.map((rule) => (
                    <tr key={rule.id}>
                      <td className="fw-600">{rule.pattern}</td>
                      <td><span className="ticker-badge bg-cat-stock">{rule.ticker}</span></td>
                      <td>{rule.name}</td>
                      <td>
                        <span className={`badge badge-${rule.category.toLowerCase()}`}>
                          {rule.category === 'Stock' ? 'Aktie' : rule.category}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => onRemoveRule(rule.id)}
                          className="tx-item-trash-btn"
                          title="Regel löschen"
                          aria-label="Regel löschen"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="hl-empty-row" style={{ padding: '2rem' }}>
                      Keine benutzerdefinierten Regeln hinterlegt. Abrechnungen werden anhand Standard-Muster erkannt.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
