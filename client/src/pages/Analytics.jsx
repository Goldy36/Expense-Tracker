import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';
import IncomeExpenseChart from '../components/analytics/IncomeExpenseChart';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import MonthlyBarChart from '../components/analytics/MonthlyBarChart';
import InsightsCard from '../components/analytics/InsightsCard';
import Card from '../components/ui/Card';
import { CATEGORIES } from '../data/categories';
import { Award, TrendingUp, BarChart2 } from 'lucide-react';

const Analytics = () => {
  const { transactions, budgets, settings } = useExpense();
  const currency = settings.currency || '₹';

  // Calculate Category Rankings
  const categoryTotals = {};
  let totalExpensesSum = 0;

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const amt = Number(t.amount) || 0;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
      totalExpensesSum += amt;
    });

  const rankedCategories = Object.entries(categoryTotals)
    .map(([catKey, amount]) => {
      const meta = CATEGORIES[catKey] || CATEGORIES.Other;
      return {
        key: catKey,
        label: meta.label,
        amount,
        color: meta.color,
        percentage: totalExpensesSum > 0 ? Math.round((amount / totalExpensesSum) * 100) : 0
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Financial Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          In-depth financial reports, spending trends, and category intelligence
        </p>
      </div>

      {/* Row 1: Income vs Expense Area Chart */}
      <IncomeExpenseChart transactions={transactions} currency={currency} />

      {/* Row 2: Category Donut & Monthly Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart transactions={transactions} currency={currency} />
        <MonthlyBarChart transactions={transactions} currency={currency} />
      </div>

      {/* Row 3: Top Spending Categories & Financial Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spending Categories Ranking */}
        <Card
          title="Top Spending Categories"
          subtitle="Ranked by total expense volume"
          action={<Award className="w-5 h-5 text-indigo-600" />}
        >
          {rankedCategories.length === 0 ? (
            <p className="text-xs text-slate-400">No expense records found.</p>
          ) : (
            <div className="space-y-4">
              {rankedCategories.slice(0, 5).map((item, index) => (
                <div key={item.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 font-bold text-[10px] text-slate-600 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.amount, currency)}{' '}
                      <span className="text-[11px] font-normal text-slate-400">({item.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Automated Insights */}
        <InsightsCard transactions={transactions} budgets={budgets} />
      </div>
    </div>
  );
};

export default Analytics;
