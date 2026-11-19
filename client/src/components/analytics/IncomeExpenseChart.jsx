import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const IncomeExpenseChart = ({ transactions = [], currency = '₹' }) => {
  const [timeframe, setTimeframe] = useState('30 Days');

  // Generate chart data based on transactions and timeframe
  const generateChartData = () => {
    if (timeframe === '7 Days') {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });

        const income = transactions
          .filter(t => t.type === 'income' && t.date === dateStr)
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const expense = transactions
          .filter(t => t.type === 'expense' && t.date === dateStr)
          .reduce((sum, t) => sum + Number(t.amount), 0);

        days.push({ name: dayLabel, income, expense });
      }
      return days;
    }

    if (timeframe === '6 Months' || timeframe === '1 Year') {
      const monthCount = timeframe === '6 Months' ? 6 : 12;
      const months = [];
      const now = new Date();
      for (let i = monthCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const m = d.getMonth();
        const y = d.getFullYear();
        const label = d.toLocaleDateString('en-IN', { month: 'short' });

        const income = transactions
          .filter(t => {
            const td = new Date(t.date);
            return t.type === 'income' && td.getMonth() === m && td.getFullYear() === y;
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const expense = transactions
          .filter(t => {
            const td = new Date(t.date);
            return t.type === 'expense' && td.getMonth() === m && td.getFullYear() === y;
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);

        months.push({ name: label, income, expense });
      }
      return months;
    }

    // Default: 30 Days (grouped by week/periods or 4 7-day buckets)
    const buckets = [
      { name: 'Week 1', income: 0, expense: 0 },
      { name: 'Week 2', income: 0, expense: 0 },
      { name: 'Week 3', income: 0, expense: 0 },
      { name: 'Week 4', income: 0, expense: 0 },
    ];

    transactions.forEach(t => {
      const d = new Date(t.date);
      const dayOfMonth = d.getDate();
      let idx = 0;
      if (dayOfMonth > 21) idx = 3;
      else if (dayOfMonth > 14) idx = 2;
      else if (dayOfMonth > 7) idx = 1;

      if (t.type === 'income') buckets[idx].income += Number(t.amount);
      else if (t.type === 'expense') buckets[idx].expense += Number(t.amount);
    });

    return buckets;
  };

  const data = generateChartData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg text-xs space-y-1.5">
          <p className="font-semibold text-slate-800 border-b border-slate-100 pb-1">{label}</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Income:
            </span>
            <span className="font-bold text-slate-800">{formatCurrency(payload[0]?.value || 0, currency)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-indigo-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Expense:
            </span>
            <span className="font-bold text-slate-800">{formatCurrency(payload[1]?.value || 0, currency)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
      {/* Header with Timeframe Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Spending & Income Overview</h3>
          <p className="text-xs text-slate-400">Compare your earnings versus expenses</p>
        </div>

        <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 self-start sm:self-auto">
          {['7 Days', '30 Days', '6 Months', '1 Year'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--chart-label)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--chart-label)', fontSize: 12 }}
              tickFormatter={(v) => `${currency}${v >= 1000 ? `${v / 1000}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGrad)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#6366F1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
