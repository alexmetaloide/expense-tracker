import React from 'react';
import { Trash2 } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

export function ExpenseItem({ item, onRemove }) {
    if (!item) return null;

    return (
        <div className="animate-slide-up" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {(() => {
                    const categoryDef = item.category ? CATEGORIES.find(c => c.id === item.category) : null;
                    const CategoryIcon = categoryDef ? categoryDef.icon : null;
                    const categoryColor = categoryDef ? categoryDef.color : '#666';

                    return CategoryIcon ? (
                        <div style={{
                            backgroundColor: `${categoryColor}20`,
                            padding: '8px',
                            borderRadius: '10px',
                            color: categoryColor
                        }}>
                            <CategoryIcon size={18} />
                        </div>
                    ) : (
                        <div style={{ width: 34, height: 34 }} /> // Spacer
                    );
                })()}

                <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{item.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                    R$ {item.amount ? item.amount.toFixed(2).replace('.', ',') : '0,00'}
                </span>
                <button
                    onClick={() => onRemove(item.id)}
                    className="btn-icon"
                    style={{ color: 'var(--danger)', padding: '4px' }}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
