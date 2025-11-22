import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORIES } from '../constants/categories';

export function ReportsView({ expenses }) {
    // Calculate totals per category
    const data = CATEGORIES.map(cat => {
        let total = 0;
        Object.values(expenses).forEach(dayExpenses => {
            dayExpenses.forEach(item => {
                if (item.category === cat.id) {
                    total += item.amount;
                }
            });
        });
        return { name: cat.label, value: total, color: cat.color, icon: cat.icon };
    }).filter(item => item.value > 0);

    const totalExpenses = data.reduce((acc, item) => acc + item.value, 0);

    if (totalExpenses === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <p>Nenhum dado para exibir no gráfico.</p>
            </div>
        );
    }

    return (
        <div className="animate-slide-up">
            <div style={{ height: '300px', width: '100%', marginBottom: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => `R$ ${value.toFixed(2)}`}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="glass-panel" style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Detalhamento</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {data.sort((a, b) => b.value - a.value).map(item => (
                        <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    backgroundColor: `${item.color}20`,
                                    padding: '6px',
                                    borderRadius: '8px',
                                    color: item.color
                                }}>
                                    <item.icon size={16} />
                                </div>
                                <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 600 }}>R$ {item.value.toFixed(2).replace('.', ',')}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {((item.value / totalExpenses) * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
