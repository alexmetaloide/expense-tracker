import React from 'react';
import { Plus } from 'lucide-react';
import { ExpenseItem } from './ExpenseItem';

const DAY_NAMES = {
    mon: 'Segunda-feira',
    tue: 'Terça-feira',
    wed: 'Quarta-feira',
    thu: 'Quinta-feira',
    fri: 'Sexta-feira',
    sat: 'Sábado',
    sun: 'Domingo'
};

export function DayCard({ dayKey, expenses, onAdd, onRemove }) {
    const dayTotal = expenses.reduce((acc, item) => acc + item.amount, 0);
    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase() === dayKey.slice(0, 3);

    return (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', border: isToday ? '1px solid var(--primary)' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>{DAY_NAMES[dayKey]}</h2>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Total: R$ {dayTotal.toFixed(2).replace('.', ',')}
                    </div>
                </div>

                <button onClick={() => onAdd(dayKey)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <Plus size={16} />
                    Adicionar
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {expenses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        Nenhum gasto registrado
                    </div>
                ) : (
                    expenses.map(item => (
                        <ExpenseItem key={item.id} item={item} onRemove={onRemove} />
                    ))
                )}
            </div>
        </div>
    );
}
