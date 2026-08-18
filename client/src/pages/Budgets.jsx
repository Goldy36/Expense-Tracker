import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import BudgetCard from '../components/budgets/BudgetCard';
import CreateBudgetModal from '../components/budgets/CreateBudgetModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import { Plus, PieChart, AlertCircle, CheckCircle2 } from 'lucide-react';

const Budgets = () => {
  const { budgets, stats, settings, addBudget, deleteBudget } = useExpense();
  const currency = settings.currency || '₹';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  // Compute total monthly budget and total spent across all budget categories
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + Number(b.limit), 0);
  
  const totalSpentInBudgets = budgets.reduce((sum, b) => {
    const spent = stats.currentMonthTxs
      .filter(t => t.type === 'expense' && t.category === b.category)
      .reduce((s, t) => s + Number(t.amount), 0);
    return sum + spent;
  }, 0);

  const totalRemaining = totalBudgetLimit - totalSpentInBudgets;
  const overallPercentage = totalBudgetLimit > 0 ? Math.round((totalSpentInBudgets / totalBudgetLimit) * 100) : 0;

  const handleSaveBudget = (budgetData) => {
    addBudget(budgetData);
  };

  const handleDeleteConfirm = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete.id);
      setBudgetToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Category Budgets</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Set and track monthly spending targets to prevent overspending
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setBudgetToEdit(null);
            setIsModalOpen(true);
          }}
        >
          Create Budget
        </Button>
      </div>

      {/* Summary Card Bar */}
      <Card className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white border-none shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left w-full md:w-auto">
            <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
              Total Monthly Budget Limit
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight">
              {formatCurrency(totalSpentInBudgets, currency)}{' '}
              <span className="text-lg font-normal text-indigo-300">
                / {formatCurrency(totalBudgetLimit, currency)}
              </span>
            </h3>
            <p className="text-xs text-indigo-200 mt-1">
              {totalRemaining >= 0 ? (
                <span>Remaining to spend: <strong className="text-white">{formatCurrency(totalRemaining, currency)}</strong></span>
              ) : (
                <span className="text-rose-300 font-bold">Total Over Budget by {formatCurrency(Math.abs(totalRemaining), currency)}</span>
              )}
            </p>
          </div>

          <div className="w-full md:w-72 bg-indigo-950/40 p-4 rounded-2xl border border-indigo-700/50 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-indigo-200">Overall Budget Usage</span>
              <span className={overallPercentage > 100 ? 'text-rose-300' : 'text-emerald-300'}>
                {overallPercentage}%
              </span>
            </div>
            <div className="w-full bg-indigo-950 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overallPercentage > 100 ? 'bg-rose-500' : overallPercentage > 80 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Category Budget Grid */}
      {budgets.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title="No Budgets Created"
          description="Create category budgets to set spending boundaries and receive over-limit alerts."
          actionLabel="Create Budget"
          onAction={() => {
            setBudgetToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((bgt) => {
            const spent = stats.currentMonthTxs
              .filter(t => t.type === 'expense' && t.category === bgt.category)
              .reduce((sum, t) => sum + Number(t.amount), 0);

            return (
              <BudgetCard
                key={bgt.id}
                budget={bgt}
                spent={spent}
                currency={currency}
                onEdit={(b) => {
                  setBudgetToEdit(b);
                  setIsModalOpen(true);
                }}
                onDelete={(b) => setBudgetToDelete(b)}
              />
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <CreateBudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setBudgetToEdit(null);
        }}
        onSubmit={handleSaveBudget}
        budgetToEdit={budgetToEdit}
        currency={currency}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(budgetToDelete)}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Category Budget"
        message={`Are you sure you want to remove the budget for ${budgetToDelete?.category}?`}
      />
    </div>
  );
};

export default Budgets;
