import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Eye, Edit2, Trash2 } from 'lucide-react';

const TransactionCard = ({ tx, onView, onEdit, onDelete, currency = '₹' }) => {
  const isExpense = tx.type === 'expense';
  const catMeta = CATEGORIES[tx.category] || CATEGORIES.Other;
  const CategoryIcon = catMeta.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${catMeta.bgColor} ${catMeta.textColor} shadow-2xs`}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">{tx.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{formatDate(tx.date)}</p>
          </div>
        </div>
        <div className={`font-bold text-sm text-right ${isExpense ? 'text-slate-900' : 'text-emerald-600'}`}>
          {isExpense ? '-' : '+'}{formatCurrency(tx.amount, currency)}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <Badge variant={catMeta.id.toLowerCase()} size="sm">
            {catMeta.label}
          </Badge>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
            {tx.paymentMethod}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(tx)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(tx)}
            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(tx)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
