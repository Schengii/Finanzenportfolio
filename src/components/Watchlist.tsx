import React, { useState } from 'react';
import type { WatchlistItem, AssetCategory } from '../types';
import { Eye, Plus, Trash2, ShoppingCart, Notebook, TrendingDown, Bell } from 'lucide-react';

interface WatchlistProps {
  watchlist: WatchlistItem[];
  currentPrices: Record<string, number>;
  onAddWatchlist: (item: Omit<WatchlistItem, 'id' | 'addedAt'>) => void;
  onRemoveWatchlist: (id: string) => void;
  onQuickBuy: (ticker: string, name: string, category: AssetCategory, price: number) => void;
}

export const Watchlist: React.FC<WatchlistProps> = ({
  watchlist,
  currentPrices,
  onAddWatchlist,
  onRemoveWatchlist,
  onQuickBuy
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Stock');
  const [targetPrice, setTargetPrice] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !name || targetPrice === '') return;

    onAddWatchlist({
      ticker: ticker.toUpperCase(),
      name,
      category,
      targetPrice: Number(targetPrice),
      notes: notes.trim()
    });

    setTicker('');
    setName('');
    setCategory('Stock');
    setTargetPrice('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="fade-in" style={{ padding: '0 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Watchlist</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Beobachte interessante Assets und schlage beim richtigen Preis zu.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} /> {showAddForm ? 'Schließen' : 'Asset hinzufügen'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 600 }}>Neues Asset beobachten</h3>
          <form onSubmit={handleSubmit} className="transaction-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Ticker Symbol</label>
              <input 
                type="text" 
                value={ticker} 
                onChange={(e) => setTicker(e.target.value)} 
                placeholder="z.B. MSFT" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="z.B. Microsoft Corp." 
                required 
              />
            </div>
            <div className="form-group">
              <label>Kategorie</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as AssetCategory)}>
                <option value="Stock">Aktie</option>
                <option value="ETF">ETF</option>
                <option value="Crypto">Krypto</option>
              </select>
            </div>
            <div className="form-group">
              <label>Zielpreis (€)</label>
              <input 
                type="number" 
                step="0.01" 
                value={targetPrice} 
                onChange={(e) => setTargetPrice(e.target.value ? Number(e.target.value) : '')} 
                placeholder="z.B. 380.00" 
                required 
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Notizen</label>
              <input 
                type="text" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Warum beobachten wir dieses Asset? (z.B. Kauf nach Quartalszahlen)" 
              />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Abbrechen</button>
              <button type="submit" className="btn-primary">Hinzufügen</button>
            </div>
          </form>
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Eye size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1.1rem', margin: 0 }}>Deine Watchlist ist noch leer.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Füge Assets hinzu, die du beobachten möchtest.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {watchlist.map((item) => {
            const currentPrice = currentPrices[item.ticker] || item.targetPrice * 1.1; // Default fallback
            const isTargetReached = currentPrice <= item.targetPrice;
            const differencePercent = ((currentPrice - item.targetPrice) / item.targetPrice) * 100;

            return (
              <div 
                key={item.id} 
                className="glass-panel" 
                style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  border: isTargetReached ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                  boxShadow: isTargetReached ? '0 8px 32px 0 rgba(16, 185, 129, 0.05)' : 'none'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="ticker-badge" style={{ 
                        background: item.category === 'Stock' ? 'rgba(59, 130, 246, 0.15)' : item.category === 'ETF' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: item.category === 'Stock' ? 'var(--accent-blue)' : item.category === 'ETF' ? 'var(--accent-purple)' : 'var(--accent-gold)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {item.category}
                      </span>
                      <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem', fontWeight: 700 }}>{item.ticker}</h3>
                      <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.name}</p>
                    </div>
                    <button 
                      onClick={() => onRemoveWatchlist(item.id)} 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                      title="Aus Watchlist entfernen"
                    >
                      <Trash2 size={16} className="text-hover-rose" />
                    </button>
                  </div>

                  <div style={{ margin: '1.5rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zielpreis</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', fontWeight: 600 }}>{item.targetPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aktueller Kurs</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', fontWeight: 600, color: isTargetReached ? 'var(--status-positive)' : 'inherit' }}>
                        {currentPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                  </div>

                  {item.notes && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Notebook size={14} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.notes}</span>
                    </div>
                  )}
                </div>

                <div>
                  {isTargetReached ? (
                    <div className="status-badge positive" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center', marginBottom: '1rem', padding: '0.5rem', borderRadius: '6px' }}>
                      <Bell size={14} /> Zielpreis erreicht! (-{Math.abs(differencePercent).toFixed(1)}%)
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem', justifyContent: 'center' }}>
                      <TrendingDown size={14} /> Noch {differencePercent.toFixed(1)}% über Zielpreis
                    </div>
                  )}

                  <button 
                    className="btn-secondary" 
                    onClick={() => onQuickBuy(item.ticker, item.name, item.category, currentPrice)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: isTargetReached ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: isTargetReached ? 'var(--status-positive)' : 'inherit', border: isTargetReached ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)', borderRadius: '6px', padding: '0.5rem', cursor: 'pointer' }}
                  >
                    <ShoppingCart size={14} /> Transaktion erfassen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
