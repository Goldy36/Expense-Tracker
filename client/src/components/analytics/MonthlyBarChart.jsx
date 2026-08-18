import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const MonthlyBarChart = ({ transactions = [], currency = '₹' }) => {
  // Aggregate monthly expense data
  const now = new Date();
  const monthsData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

    const totalExpense = transactions
      .filter(t => {
        const td = new Date(t.date);
        return t.type === 'expense' && td.getMonth() === m && td.getFullYear() === y;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    monthsData.push({
      name: label,
      amount: totalExpense,
      isCurrent: i === 0
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg text-xs space-y-1">
          <p className="font-semibold text-slate-800">{label}</p>
          <p className="font-extrabold text-indigo-600 text-sm">
            {formatCurrency(payload[0].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">Monthly Spending Trend</h3>
        <p className="text-xs text-slate-400">Total monthly expenses over the last 6 months</p>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              tickFormatter={(v) => `${currency}${v >= 1000 ? `${v / 1000}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {monthsData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isCurrent ? '#6366F1' : '#CBD5E1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
