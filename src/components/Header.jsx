import React, { useState } from 'react';
import { Wallet, RefreshCw, PieChart, List, Sun, Moon, Target } from 'lucide-react';

export function Header({ total, onReset, currentView, onViewChange, theme, onToggleTheme, budget, onBudgetChange }) {
    const [showBudgetInput, setShowBudgetInput] = useState(false);
    const [budgetInput, setBudgetInput] = useState(budget || '');

    const handleBudgetSave = () => {
        const value = parseFloat(budgetInput);
        if (!isNaN(value) && value >= 0) {
            onBudgetChange(value);
            setShowBudgetInput(false);
        }
    };

    const percentage = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
    const isOverBudget = total > budget && budget > 0;
    const isNearLimit = percentage >= 80 && !isOverBudget;

    return (
        <header className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Wallet size={20} className="text-primary" style={{ color: 'var(--primary)' }} />
                        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Controle Semanal</h1>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, color: isOverBudget ? 'var(--danger)' : 'var(--text-primary)' }}>
                        R$ {total.toFixed(2).replace('.', ',')}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={onToggleTheme}
                        className="btn-icon"
                        title={theme === 'dark' ? "Modo Claro" : "Modo Escuro"}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        onClick={() => onViewChange(currentView === 'list' ? 'reports' : 'list')}
                        className="btn-icon"
                        title={currentView === 'list' ? "Ver Relatórios" : "Ver Lista"}
                    >
                        {currentView === 'list' ? <PieChart size={20} /> : <List size={20} />}
                    </button>

                    <button onClick={onReset} className="btn-icon" title="Reiniciar Semana">
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Budget Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={16} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {budget > 0 ? `Meta: R$ ${budget.toFixed(2).replace('.', ',')}` : 'Sem meta definida'}
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            setShowBudgetInput(!showBudgetInput);
                            setBudgetInput(budget || '');
                        }}
                        style={{
                            fontSize: '0.75rem',
                            padding: '4px 8px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        {budget > 0 ? 'Editar' : 'Definir Meta'}
                    </button>
                </div>

                {showBudgetInput && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            type="number"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            placeholder="Ex: 500"
                            className="input-field"
                            style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                        />
                        <button onClick={handleBudgetSave} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                            Salvar
                        </button>
                        <button onClick={() => setShowBudgetInput(false)} className="btn-icon">
                            ✕
                        </button>
                    </div>
                )}

                {budget > 0 && (
                    <>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${percentage}%`,
                                height: '100%',
                                background: isOverBudget ? 'var(--danger)' : isNearLimit ? '#f59e0b' : 'var(--success)',
                                transition: 'width 0.3s ease, background 0.3s ease'
                            }} />
                        </div>
                        {isOverBudget && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 500 }}>
                                ⚠️ Você ultrapassou a meta em R$ {(total - budget).toFixed(2).replace('.', ',')}
                            </div>
                        )}
                        {isNearLimit && !isOverBudget && (
                            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 500 }}>
                                ⚡ Você já gastou {percentage.toFixed(0)}% da sua meta!
                            </div>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}
