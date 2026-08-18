import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { CATEGORIES } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';

const CategoryPieChart = ({ transactions = [], currency = '₹' }) => {
  // Aggregate expenses by category
  const categoryTotals = {};
  let totalExpenseSum = 0;

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const amt = Number(t.amount) || 0;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
      totalExpenseSum += amt;
    });

  const chartData = Object.entries(categoryTotals).map(([catKey, amount]) => {
    const meta = CATEGORIES[catKey] || CATEGORIES.Other;
    return {
      name: meta.label,
      key: catKey,
      value: amount,
      color: meta.color,
      percentage: totalExpenseSum > 0 ? ((amount / totalExpenseSum) * 100).toFixed(1) : 0
    };
  }).sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-semibold text-slate-800">{item.name}</span>
          </div>
          <p className="font-bold text-slate-900 text-sm">{formatCurrency(item.value, currency)}</p>
          <p className="text-slate-500 font-medium">{item.percentage}% of total expenses</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">Expense Breakdown</h3>
        <p className="text-xs text-slate-400">Category-wise spending distribution</p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          No expenses recorded yet
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Donut Pie Chart */}
          <div className="h-60 w-full md:w-1/2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Summary Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Total</span>
              <span className="text-sm font-extrabold text-slate-900">
                {formatCurrency(totalExpenseSum, currency)}
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="w-full md:w-1/2 space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {chartData.map((item) => (
              <div key={item.key} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-700 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="font-bold text-slate-900">{formatCurrency(item.value, currency)}</span>
                  <span className="text-slate-400 font-medium w-10 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPieChart;
