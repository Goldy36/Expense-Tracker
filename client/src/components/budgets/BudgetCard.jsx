import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';
import ProgressBar from '../ui/ProgressBar';
import Badge from '../ui/Badge';
import { Edit2, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const BudgetCard = ({ budget, spent = 0, onEdit, onDelete, currency = '₹' }) => {
  const catMeta = CATEGORIES[budget.category] || CATEGORIES.Other;
  const CategoryIcon = catMeta.icon;

  const limit = Number(budget.limit) || 0;
  const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const remaining = limit - spent;

  let statusState = { label: 'Normal', variant: 'indigo', icon: CheckCircle2 };
  if (percentage >= 100) {
    statusState = { label: 'Over Budget', variant: 'danger', icon: AlertTriangle };
  } else if (percentage >= 80) {
    statusState = { label: 'Near Limit', variant: 'warning', icon: AlertTriangle };
  }

  const StatusIcon = statusState.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${catMeta.bgColor} ${catMeta.textColor} shadow-2xs`}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">{catMeta.label}</h4>
            <p className="text-xs text-slate-400">Monthly Budget</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Budget"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(budget)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Budget"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Amounts */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xl font-bold text-slate-900">
            {formatCurrency(spent, currency)}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            of {formatCurrency(limit, currency)}
          </span>
        </div>
        <ProgressBar value={spent} max={limit} height="h-2.5" />
      </div>

      {/* Remaining & Status Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <span className="text-slate-500 font-medium">
          {remaining < 0 ? (
            <span className="text-rose-600 font-semibold">Exceeded by {formatCurrency(Math.abs(remaining), currency)}</span>
          ) : (
            <span>Remaining: <strong className="text-slate-800">{formatCurrency(remaining, currency)}</strong></span>
          )}
        </span>

        <Badge variant={statusState.variant} icon={StatusIcon} size="sm">
          {statusState.label}
        </Badge>
      </div>
    </div>
  );
};

export default BudgetCard;
