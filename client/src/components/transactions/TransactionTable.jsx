import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Eye, Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransactionTable = ({
  transactions = [],
  onView,
  onEdit,
  onDelete,
  currency = '₹'
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-3.5 px-4 font-semibold">Transaction</th>
            <th className="py-3.5 px-4 font-semibold">Category</th>
            <th className="py-3.5 px-4 font-semibold">Date</th>
            <th className="py-3.5 px-4 font-semibold">Payment Method</th>
            <th className="py-3.5 px-4 font-semibold text-right">Amount</th>
            <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {transactions.map((tx) => {
            const isExpense = tx.type === 'expense';
            const catMeta = CATEGORIES[tx.category] || CATEGORIES.Other;
            const CategoryIcon = catMeta.icon;

            return (
              <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors group">
                {/* Transaction Name & Icon */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${catMeta.bgColor} ${catMeta.textColor} shadow-2xs`}>
                      <CategoryIcon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 line-clamp-1">{tx.title}</p>
                      {tx.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">{tx.description}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category Badge */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge variant={catMeta.id.toLowerCase()}>
                    {catMeta.label}
                  </Badge>
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                  {formatDate(tx.date)}
                </td>

                {/* Payment Method */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                    {tx.paymentMethod}
                  </span>
                </td>

                {/* Amount */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className={`font-bold text-sm inline-flex items-center gap-1 ${isExpense ? 'text-slate-900' : 'text-emerald-600'}`}>
                    {isExpense ? (
                      <span className="text-rose-500 font-semibold">-</span>
                    ) : (
                      <span className="text-emerald-500 font-semibold">+</span>
                    )}
                    {formatCurrency(tx.amount, currency)}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onView(tx)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(tx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
