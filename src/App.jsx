import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useExpenses } from './hooks/useExpenses';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { DayCard } from './components/DayCard';
import { ExpenseModal } from './components/ExpenseModal';
import { ReportsView } from './components/ReportsView';

function App() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { expenses, allExpenses, addExpense, removeExpense, resetWeek, getTotal, DAYS_KEYS, dateRangeLabel, loading: expensesLoading } = useExpenses(user?.uid);

  const [modalState, setModalState] = useState({ isOpen: false, dayKey: null });
  const [currentView, setCurrentView] = useState('list');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [weeklyBudget, setWeeklyBudget] = useState(() => {
    const saved = localStorage.getItem('weeklyBudget');
    return saved ? parseFloat(saved) : 0;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('weeklyBudget', weeklyBudget.toString());
  }, [weeklyBudget]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleOpenModal = (dayKey) => {
    setModalState({ isOpen: true, dayKey });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, dayKey: null });
  };

  const handleSaveExpense = (amount, description, category) => {
    addExpense(amount, description, category, modalState.dayKey);
    handleCloseModal();
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: 'var(--text-muted)'
      }}>
        Carregando...
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen onSignIn={signInWithGoogle} />;
  }

  // Show loading while fetching expenses
  if (expensesLoading) {
    return (
      <>
        <Header
          total={0}
          onReset={resetWeek}
          currentView={currentView}
          onViewChange={setCurrentView}
          theme={theme}
          onToggleTheme={toggleTheme}
          budget={weeklyBudget}
          onBudgetChange={setWeeklyBudget}
        />
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-muted)'
        }}>
          Carregando despesas...
        </div>
      </>
    );
  }

  // Main app
  return (
    <>
      <Header
        total={getTotal()}
        onReset={resetWeek}
        currentView={currentView}
        onViewChange={setCurrentView}
        theme={theme}
        onToggleTheme={toggleTheme}
        budget={weeklyBudget}
        onBudgetChange={setWeeklyBudget}
      />

      <main style={{ paddingBottom: '2rem' }}>
        {currentView === 'list' ? (
          DAYS_KEYS.map(dayKey => (
            <DayCard
              key={dayKey}
              dayKey={dayKey}
              expenses={expenses[dayKey]}
              onAdd={handleOpenModal}
              onRemove={removeExpense}
            />
          ))
        ) : (
          <ReportsView expenses={expenses} />
        )}
      </main>

      <ExpenseModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveExpense}
        dayName={modalState.dayKey}
      />

      {/* Sign Out Button (floating) */}
      <button
        onClick={signOut}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
          zIndex: 1000
        }}
      >
        Sair
      </button>
    </>
  );
}

export default App;
