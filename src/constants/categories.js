import { Utensils, Car, ShoppingBag, Home, Gamepad2, Zap, HeartPulse, MoreHorizontal } from 'lucide-react';

export const CATEGORIES = [
    { id: 'food', label: 'Alimentação', icon: Utensils, color: '#ef4444' }, // Red
    { id: 'transport', label: 'Transporte', icon: Car, color: '#3b82f6' }, // Blue
    { id: 'shopping', label: 'Compras', icon: ShoppingBag, color: '#ec4899' }, // Pink
    { id: 'home', label: 'Casa', icon: Home, color: '#10b981' }, // Emerald
    { id: 'entertainment', label: 'Lazer', icon: Gamepad2, color: '#8b5cf6' }, // Violet
    { id: 'bills', label: 'Contas', icon: Zap, color: '#eab308' }, // Yellow
    { id: 'health', label: 'Saúde', icon: HeartPulse, color: '#f43f5e' }, // Rose
    { id: 'others', label: 'Outros', icon: MoreHorizontal, color: '#64748b' }, // Slate
];
