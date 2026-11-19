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

const IncomeExpenseChart = ({ transactions = [], currency = '₹', selectedMonth }) => {
  const [timeframe, setTimeframe] = useState('30 Days');

  // Generate chart data based on transactions and timeframe
  const generateChartData = () => {
    const monthValue = selectedMonth || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const [selectedYear, selectedMonthNumber] = monthValue.split('-').map(Number);
    const selectedStart = new Date(selectedYear, selectedMonthNumber - 1, 1);
    const selectedEnd = new Date(selectedYear, selectedMonthNumber, 0);
    const now = new Date();
    const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonthNumber - 1 === now.getMonth();
    const periodEnd = isCurrentMonth && now < selectedEnd ? now : selectedEnd;
    const dateOnly = (value) => {
      const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
      return new Date(year, month - 1, day);
    };
    const sumFor = (items, type) => items
      .filter((transaction) => transaction.type === type)
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    if (timeframe === '7 Days') {
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(periodEnd);
        date.setDate(date.getDate() - (6 - index));
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayTransactions = date >= selectedStart && date <= periodEnd
          ? transactions.filter((transaction) => String(transaction.date).slice(0, 10) === dateKey)
          : [];
        return {
          name: date.toLocaleDateString('en-IN', { weekday: 'short' }),
          income: sumFor(dayTransactions, 'income'),
          expense: sumFor(dayTransactions, 'expense'),
        };
      });
    }

    if (timeframe === '6 Months' || timeframe === '1 Year') {
      const monthCount = timeframe === '6 Months' ? 6 : 12;
      return Array.from({ length: monthCount }, (_, index) => {
        const date = new Date(selectedYear, selectedMonthNumber - monthCount + index, 1);
        const monthTransactions = transactions.filter((transaction) => {
          const transactionDate = dateOnly(transaction.date);
          return transactionDate.getMonth() === date.getMonth() && transactionDate.getFullYear() === date.getFullYear();
        });
        return {
          name: date.toLocaleDateString('en-IN', { month: 'short' }),
          income: sumFor(monthTransactions, 'income'),
          expense: sumFor(monthTransactions, 'expense'),
        };
      });
    }

    const buckets = [
      { name: 'Week 1', income: 0, expense: 0 },
      { name: 'Week 2', income: 0, expense: 0 },
      { name: 'Week 3', income: 0, expense: 0 },
      { name: 'Week 4', income: 0, expense: 0 },
    ];
    transactions.forEach((transaction) => {
      const date = dateOnly(transaction.date);
      if (Number.isNaN(date.getTime()) || date < selectedStart || date > periodEnd) return;
      const index = Math.min(Math.floor((date.getDate() - 1) / 7), 3);
      if (transaction.type === 'income') buckets[index].income += Number(transaction.amount || 0);
      if (transaction.type === 'expense') buckets[index].expense += Number(transaction.amount || 0);
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
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
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
              stroke="#F97316"
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
