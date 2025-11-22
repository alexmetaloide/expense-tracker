import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const LEGACY_KEY = 'expense_tracker_v2';

export function useExpenses(userId) {
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate] = useState(new Date());

  // Migrate localStorage data to Firestore on first login
  useEffect(() => {
    if (!userId) return;

    const migrateData = async () => {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        try {
          const localExpenses = JSON.parse(legacy);
          console.log('Migrando', localExpenses.length, '  despesas para Firestore...');

          for (const expense of localExpenses) {
            await addDoc(collection(db, 'expenses'), {
              ...expense,
              userId,
              createdAt: new Date()
            });
          }

          // Clear localStorage after successful migration
          localStorage.removeItem(LEGACY_KEY);
          console.log('Migração concluída!');
        } catch (error) {
          console.error('Erro na migração:', error);
        }
      }
    };

    migrateData();
  }, [userId]);

  // Real-time listener for Firestore
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllExpenses(expenses);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar despesas:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start, end });

  const currentWeekExpenses = allExpenses.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= start && itemDate <= end;
  });

  const addExpense = async (amount, description, category, dayKey) => {
    if (!userId) return;

    let expenseDate = new Date();
    if (dayKey) {
      const dayIndex = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].indexOf(dayKey);
      if (dayIndex !== -1) {
        expenseDate = daysInWeek[dayIndex];
      }
    }

    try {
      await addDoc(collection(db, 'expenses'), {
        amount: parseFloat(amount),
        description,
        category,
        date: expenseDate.toISOString(),
        timestamp: expenseDate.toISOString(),
        userId,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      alert('Erro ao salvar despesa. Tente novamente.');
    }
  };

  const removeExpense = async (id) => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
      console.error('Erro ao remover despesa:', error);
      alert('Erro ao remover despesa. Tente novamente.');
    }
  };

  const resetCurrentWeek = async () => {
    if (!confirm('Tem certeza que deseja apagar os gastos desta semana?')) return;

    try {
      const deletePromises = currentWeekExpenses.map(expense =>
        deleteDoc(doc(db, 'expenses', expense.id))
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Erro ao resetar semana:', error);
      alert('Erro ao resetar semana. Tente novamente.');
    }
  };

  const getTotal = () => {
    return currentWeekExpenses.reduce((acc, item) => acc + item.amount, 0);
  };

  // Group by day for the UI
  const expensesByDay = {};
  daysInWeek.forEach(day => {
    const dayIndex = (day.getDay() + 6) % 7;
    const keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const key = keys[dayIndex];
    expensesByDay[key] = currentWeekExpenses.filter(item => isSameDay(new Date(item.date), day));
  });

  const dateRangeLabel = `${format(start, 'dd MMM', { locale: ptBR })} - ${format(end, 'dd MMM', { locale: ptBR })}`;

  return {
    expenses: expensesByDay,
    allExpenses: currentWeekExpenses,
    addExpense,
    removeExpense,
    resetWeek: resetCurrentWeek,
    getTotal,
    dateRangeLabel,
    DAYS_KEYS: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    currentDate,
    loading
  };
}
