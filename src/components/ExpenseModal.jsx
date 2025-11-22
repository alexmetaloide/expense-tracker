import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

export function ExpenseModal({ isOpen, onClose, onSave, dayName }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        onSave(amount, description, selectedCategory);
        setAmount('');
        setDescription('');
        setSelectedCategory(CATEGORIES[0].id);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }} onClick={onClose}>
            <div
                className="glass-panel animate-slide-up"
                style={{ width: '100%', maxWidth: '400px', padding: '1.5rem', background: '#18181b' }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Novo Gasto</h3>
                    <button onClick={onClose} className="btn-icon"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Valor (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            inputMode="decimal"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="input-field"
                            placeholder="0,00"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Descrição
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="input-field"
                            placeholder="Ex: Almoço, Uber..."
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Categoria
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat.id)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '8px',
                                        background: selectedCategory === cat.id ? `${cat.color}20` : 'var(--bg-card)',
                                        border: `1px solid ${selectedCategory === cat.id ? cat.color : 'var(--border)'}`,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <cat.icon size={20} color={selectedCategory === cat.id ? cat.color : 'var(--text-muted)'} />
                                    <span style={{ fontSize: '0.7rem', color: selectedCategory === cat.id ? 'white' : 'var(--text-muted)' }}>
                                        {cat.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '12px' }}>
                        <Check size={18} />
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
}
