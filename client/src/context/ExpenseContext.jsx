import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { transactionService } from '../services/transactionService';
import { budgetService } from '../services/budgetService';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

const EMPTY_SETTINGS = {
  currency: '₹',
  currencyCode: 'INR',
  defaultDateRange: '30 Days',
  defaultTransactionType: 'all',
  notifications: {
    budgetAlerts: false,
    weeklySummary: false,
    monthlyReport: false,
  },
};

const cacheKey = (user, kind) => `expenseflow_${kind}_${user?._id || user?.id || user?.email || 'default'}`;
const readCache = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
const readLegacyCache = (key, fallback) => readCache(key, fallback);

const normalizeSettingsFromProfile = (profile) => ({
  currency: profile?.currency || profile?.preferences?.currency || '₹',
  currencyCode: profile?.currencyCode || (profile?.currency === '$' ? 'USD' : 'INR'),
  defaultDateRange: profile?.preferences?.defaultDateRange || '30 Days',
  defaultTransactionType: profile?.preferences?.defaultTransactionType || 'all',
  notifications: {
    budgetAlerts: profile?.preferences?.notifications?.budgetAlerts ?? false,
    weeklySummary: profile?.preferences?.notifications?.weeklySummary ?? false,
    monthlyReport: profile?.preferences?.notifications?.monthlyReport ?? false,
  },
});

const mapTransaction = (tx) => {
  if (!tx) return tx;
  const id = (tx._id || tx.id || '').toString();
  return {
    ...tx,
    id,
    _id: id,
    receipt: tx.receiptUrl || tx.receipt || null,
  };
};

const mapBudget = (bgt) => {
  if (!bgt) return bgt;
  const id = (bgt._id || bgt.id || '').toString();
  return {
    ...bgt,
    id,
    _id: id,
  };
};

export const ExpenseProvider = ({ children }) => {
  const { isAuthenticated, user, logout, updateUserProfile } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const hydratedUserKey = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setTransactions([]);
      setBudgets([]);
      setSettings(EMPTY_SETTINGS);
      return;
    }
    const id = user?._id || user?.id || user?.email || 'default';
    setTransactions(readCache(cacheKey(user, 'transactions'), readLegacyCache('expense_tracker_transactions', [])));
    setBudgets(readCache(cacheKey(user, 'budgets'), readLegacyCache('expense_tracker_budgets', [])));
    setSettings({ ...EMPTY_SETTINGS, ...readCache(cacheKey(user, 'settings'), readLegacyCache('expense_tracker_settings', {})) });
    hydratedUserKey.current = id;
  }, [isAuthenticated, user?._id, user?.id, user?.email]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const id = user?._id || user?.id || user?.email || 'default';
    if (hydratedUserKey.current !== id) return;
    try {
      localStorage.setItem(cacheKey(user, 'transactions'), JSON.stringify(transactions));
      localStorage.setItem(cacheKey(user, 'budgets'), JSON.stringify(budgets));
      localStorage.setItem(cacheKey(user, 'settings'), JSON.stringify(settings));
    } catch (error) {
      console.warn('[ExpenseContext] Unable to save local data cache', error);
    }
  }, [isAuthenticated, user?._id, user?.id, user?.email, transactions, budgets, settings]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = async () => {
    if (!isAuthenticated) {
      setTransactions([]);
      setBudgets([]);
      setSettings(EMPTY_SETTINGS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [transactionsResponse, budgetsResponse, profileResponse] = await Promise.all([
        transactionService.getTransactions(),
        budgetService.getBudgets(),
        userService.getProfile(),
      ]);

      if (Array.isArray(transactionsResponse?.data?.data || transactionsResponse?.data)) {
        setTransactions((transactionsResponse.data.data || transactionsResponse.data).map(mapTransaction));
      }
      if (Array.isArray(budgetsResponse?.data?.data || budgetsResponse?.data)) {
        setBudgets((budgetsResponse.data.data || budgetsResponse.data).map(mapBudget));
      }
      if (profileResponse?.data) {
        setSettings(normalizeSettingsFromProfile(profileResponse.data.data || profileResponse.data));
      }
    } catch (error) {
      console.warn('[ExpenseContext] API refresh encountered error, preserving local state');
      if (error?.response?.status === 401) {
        await logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [isAuthenticated, user?._id]);

  const addTransaction = async (newTx) => {
    try {
      const response = await transactionService.createTransaction(newTx);
      const createdTx = mapTransaction(response.data?.data || response.data || newTx);
      setTransactions((prev) => [createdTx, ...prev]);
      addToast(`${newTx.type === 'income' ? 'Income' : 'Expense'} added successfully!`, 'success');
      return createdTx;
    } catch (error) {
      console.warn('[ExpenseContext] API createTransaction error, applying optimistic add');
      const fallbackTx = mapTransaction({
        ...newTx,
        id: `tx_${Date.now()}`,
        _id: `tx_${Date.now()}`,
        createdAt: new Date().toISOString()
      });
      setTransactions((prev) => [fallbackTx, ...prev]);
      addToast(`${newTx.type === 'income' ? 'Income' : 'Expense'} added successfully!`, 'success');
      return fallbackTx;
    }
  };

  const editTransaction = async (id, updatedFields) => {
    const targetId = typeof id === 'object' ? (id.id || id._id) : id;
    try {
      const response = await transactionService.updateTransaction(targetId, updatedFields);
      const updatedTx = mapTransaction(response.data?.data || response.data || updatedFields);
      setTransactions((prev) => prev.map((t) => (t.id === targetId || t._id === targetId ? updatedTx : t)));
      addToast('Transaction updated successfully!', 'success');
    } catch (error) {
      setTransactions((prev) => prev.map((t) => (t.id === targetId || t._id === targetId ? { ...t, ...updatedFields } : t)));
      addToast('Transaction updated!', 'success');
    }
  };

  const deleteTransaction = async (id) => {
    const targetId = typeof id === 'object' ? (id.id || id._id) : id;
    try {
      await transactionService.deleteTransaction(targetId);
      setTransactions((prev) => prev.filter((t) => t.id !== targetId && t._id !== targetId));
      addToast('Transaction deleted!', 'info');
    } catch (error) {
      setTransactions((prev) => prev.filter((t) => t.id !== targetId && t._id !== targetId));
      addToast('Transaction deleted!', 'info');
    }
  };

  const addBudget = async (newBgt) => {
    try {
      const response = await budgetService.createBudget(newBgt);
      const savedBudget = mapBudget(response.data?.data || response.data || newBgt);
      setBudgets((prev) => {
        const existingIndex = prev.findIndex((b) => (b.id === savedBudget.id || b.category === savedBudget.category));
        if (existingIndex >= 0) {
          return prev.map((b, idx) => (idx === existingIndex ? savedBudget : b));
        }
        return [...prev, savedBudget];
      });
      addToast(`Budget saved for ${savedBudget.category}!`, 'success');
      return savedBudget;
    } catch (error) {
      console.warn('[ExpenseContext] API createBudget error, applying optimistic add');
      const fallbackBudget = mapBudget({
        ...newBgt,
        id: `bgt_${Date.now()}`,
        _id: `bgt_${Date.now()}`
      });
      setBudgets((prev) => {
        const existingIndex = prev.findIndex((b) => (b.id === fallbackBudget.id || b.category === fallbackBudget.category));
        if (existingIndex >= 0) {
          return prev.map((b, idx) => (idx === existingIndex ? fallbackBudget : b));
        }
        return [...prev, fallbackBudget];
      });
      addToast(`Budget saved for ${fallbackBudget.category}!`, 'success');
      return fallbackBudget;
    }
  };

  const editBudget = async (id, updatedFields) => {
    const targetId = typeof id === 'object' ? (id.id || id._id) : id;
    try {
      const response = await budgetService.updateBudget(targetId, updatedFields);
      const updatedBudget = mapBudget(response.data?.data || response.data || updatedFields);
      setBudgets((prev) => prev.map((b) => (b.id === targetId || b._id === targetId ? updatedBudget : b)));
      addToast('Budget updated successfully!', 'success');
    } catch (error) {
      const targetId = typeof id === 'object' ? (id.id || id._id) : id;
      setBudgets((prev) => prev.map((b) => (b.id === targetId || b._id === targetId ? { ...b, ...updatedFields } : b)));
      addToast('Budget updated!', 'success');
    }
  };

  const deleteBudget = async (id) => {
    const targetId = typeof id === 'object' ? (id.id || id._id) : id;
    try {
      await budgetService.deleteBudget(targetId);
      setBudgets((prev) => prev.filter((b) => b.id !== targetId && b._id !== targetId));
      addToast('Budget removed!', 'info');
    } catch (error) {
      const targetId = typeof id === 'object' ? (id.id || id._id) : id;
      setBudgets((prev) => prev.filter((b) => b.id !== targetId && b._id !== targetId));
      addToast('Budget removed!', 'info');
    }
  };

  const updateSettings = async (newSettings) => {
    const payload = {
      currency: newSettings.currency,
      preferences: {
        defaultDateRange: newSettings.defaultDateRange,
        defaultTransactionType: newSettings.defaultTransactionType,
        notifications: newSettings.notifications,
      },
    };

    const response = await updateUserProfile(payload);
    setSettings(normalizeSettingsFromProfile(response));
    addToast('Preferences saved successfully!', 'success');
  };

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTxs = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthTxs = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });

    const totalIncome = currentMonthTxs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = currentMonthTxs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const prevIncome = prevMonthTxs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const prevExpenses = prevMonthTxs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalIncome - totalExpenses;
    const prevBalance = prevIncome - prevExpenses;
    const savings = balance > 0 ? balance : 0;
    const prevSavings = prevBalance > 0 ? prevBalance : 0;

    return {
      totalIncome,
      totalExpenses,
      balance,
      savings,
      prevIncome,
      prevExpenses,
      prevBalance,
      prevSavings,
      currentMonthTxs,
    };
  }, [transactions]);

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        budgets,
        settings,
        toasts,
        stats,
        isLoading,
        addTransaction,
        editTransaction,
        deleteTransaction,
        addBudget,
        editBudget,
        deleteBudget,
        updateSettings,
        addToast,
        removeToast,
        refreshData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
