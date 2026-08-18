import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { CATEGORIES } from '../../data/categories';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Calendar, CreditCard, Tag, FileText, Edit2, Trash2, ExternalLink } from 'lucide-react';

const TransactionDetailModal = ({
  isOpen,
  onClose,
  transaction,
  onEdit,
  onDelete,
  currency = '₹'
}) => {
  if (!transaction) return null;

  const isExpense = transaction.type === 'expense';
  const catMeta = CATEGORIES[transaction.category] || CATEGORIES.Other;
  const CategoryIcon = catMeta.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" maxWidth="max-w-md">
      <div className="space-y-5">
        {/* Amount & Title Card */}
        <div className="flex flex-col items-center text-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${catMeta.bgColor} ${catMeta.textColor} shadow-xs mb-3`}>
            <CategoryIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{transaction.title}</h3>
          <p className={`text-2xl font-extrabold mt-1 ${isExpense ? 'text-slate-900' : 'text-emerald-600'}`}>
            {isExpense ? '-' : '+'}{formatCurrency(transaction.amount, currency)}
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <Badge variant={isExpense ? 'expense' : 'income'}>
              {isExpense ? 'Expense' : 'Income'}
            </Badge>
            <Badge variant={catMeta.id.toLowerCase()}>
              {catMeta.label}
            </Badge>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Date
            </span>
            <p className="font-semibold text-slate-800">{formatDate(transaction.date)}</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              Payment Method
            </span>
            <p className="font-semibold text-slate-800">{transaction.paymentMethod}</p>
          </div>
        </div>

        {/* Description & Notes */}
        {(transaction.description || transaction.notes) && (
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2 text-xs">
            {transaction.description && (
              <div>
                <span className="text-slate-400 font-medium block">Description</span>
                <p className="text-slate-800 font-medium mt-0.5">{transaction.description}</p>
              </div>
            )}
            {transaction.notes && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 font-medium block">Notes</span>
                <p className="text-slate-600 mt-0.5">{transaction.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Receipt Attachment if present */}
        {transaction.receipt && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <span className="text-slate-500 font-semibold block mb-2">Receipt Attachment</span>
            {transaction.receipt.startsWith('data:image') || transaction.receipt.startsWith('http') ? (
              <div className="relative group overflow-hidden rounded-lg border border-slate-200 bg-white">
                <img src={transaction.receipt} alt="Receipt" className="w-full h-40 object-cover" />
                <a
                  href={transaction.receipt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" /> View Full Image
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-slate-700">Receipt file attached</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => {
              onClose();
              onDelete(transaction);
            }}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Edit2}
              onClick={() => {
                onClose();
                onEdit(transaction);
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailModal;
