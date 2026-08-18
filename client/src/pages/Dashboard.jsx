import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, calculatePercentageChange } from '../utils/formatters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import IncomeExpenseChart from '../components/analytics/IncomeExpenseChart';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionDetailModal from '../components/transactions/TransactionDetailModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { CATEGORIES } from '../data/categories';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Plus,
  PieChart
} from 'lucide-react';

const Dashboard = () => {
  const { transactions, budgets, stats, settings, deleteTransaction } = useExpense();
  const navigate = useNavigate();

  const [selectedTx, setSelectedTx] = useState(null);
  const [txToDelete, setTxToDelete] = useState(null);

  const currency = settings.currency || '₹';

  // Percentage calculations
  const incomeChange = calculatePercentageChange(stats.totalIncome, stats.prevIncome);
  const expenseChange = calculatePercentageChange(stats.totalExpenses, stats.prevExpenses);
  const balanceChange = calculatePercentageChange(stats.balance, stats.prevBalance);
  const savingsChange = calculatePercentageChange(stats.savings, stats.prevSavings);

  // Recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  const handleDeleteConfirm = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Balance */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Balance</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(stats.balance, currency)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className={`font-bold flex items-center gap-0.5 ${balanceChange.isIncrease ? 'text-emerald-600' : 'text-rose-600'}`}>
                {balanceChange.isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {balanceChange.formatted}
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </Card>

        {/* 2. Total Income */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Income</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(stats.totalIncome, currency)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className={`font-bold flex items-center gap-0.5 ${incomeChange.isIncrease ? 'text-emerald-600' : 'text-rose-600'}`}>
                {incomeChange.isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {incomeChange.formatted}
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </Card>

        {/* 3. Total Expenses */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(stats.totalExpenses, currency)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className={`font-bold flex items-center gap-0.5 ${!expenseChange.isIncrease ? 'text-emerald-600' : 'text-rose-600'}`}>
                {expenseChange.isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {expenseChange.formatted}
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </Card>

        {/* 4. Savings */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Savings</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(stats.savings, currency)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className={`font-bold flex items-center gap-0.5 ${savingsChange.isIncrease ? 'text-emerald-600' : 'text-rose-600'}`}>
                {savingsChange.isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {savingsChange.formatted}
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart transactions={transactions} currency={currency} />
        </div>
        <div className="lg:col-span-1">
          <CategoryPieChart transactions={transactions} currency={currency} />
        </div>
      </div>

      {/* Budget & Recent Transactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Overview Card */}
        <Card
          title="Budget Overview"
          subtitle="Monthly category limits progress"
          action={
            <Link to="/budgets" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5">
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
          className="lg:col-span-1"
        >
          {budgets.length === 0 ? (
            <EmptyState
              title="No budgets yet"
              description="Create your first budget to see spending progress here."
              actionLabel="Create Budget"
              onAction={() => navigate('/budgets')}
            />
          ) : (
            <div className="space-y-4">
              {budgets.slice(0, 4).map((bgt) => {
                const spent = stats.currentMonthTxs
                  .filter(t => t.type === 'expense' && t.category === bgt.category)
                  .reduce((sum, t) => sum + Number(t.amount), 0);

                const limit = Number(bgt.limit) || 1;
                const percentage = Math.round((spent / limit) * 100);
                const catMeta = CATEGORIES[bgt.category] || CATEGORIES.Other;

                return (
                  <div key={bgt.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: catMeta.color }}></span>
                        {catMeta.label}
                      </span>
                      <span className="text-slate-600 font-medium">
                        {formatCurrency(spent, currency)} / <strong className="text-slate-900">{formatCurrency(limit, currency)}</strong>
                      </span>
                    </div>
                    <ProgressBar value={spent} max={limit} height="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent Transactions Section */}
        <Card
          title="Recent Transactions"
          subtitle="Latest financial activity"
          action={
            <Link to="/transactions" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
          className="lg:col-span-2"
        >
          {recentTransactions.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              description="Add your first income or expense to populate this feed."
              actionLabel="Add Transaction"
              onAction={() => navigate('/add-expense')}
            />
          ) : (
            <TransactionTable
              transactions={recentTransactions}
              onView={(tx) => setSelectedTx(tx)}
              onEdit={(tx) => navigate(`/transactions?edit=${tx.id}`)}
              onDelete={(tx) => setTxToDelete(tx)}
              currency={currency}
            />
          )}
        </Card>
      </div>

      {/* Detail Modal */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
        onEdit={(tx) => navigate(`/transactions?edit=${tx.id}`)}
        onDelete={(tx) => setTxToDelete(tx)}
        currency={currency}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${txToDelete?.title}"?`}
      />
    </div>
  );
};

export default Dashboard;
