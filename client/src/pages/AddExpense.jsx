import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import ReceiptUploader from '../components/ui/ReceiptUploader';
import { CATEGORIES, PAYMENT_METHODS } from '../data/categories';
import { PlusCircle, ArrowLeft, Check, Sparkles } from 'lucide-react';

const formatDateForInput = (date) => (
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
);

const getInitialTransactionDate = (month) => {
  const today = new Date();
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return formatDateForInput(today);
  }

  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(year, monthNumber - 1, 1);
  const day = month === formatDateForInput(today).slice(0, 7) ? today.getDate() : 1;
  const lastDay = new Date(year, monthNumber, 0).getDate();
  date.setDate(Math.min(day, lastDay));

  return formatDateForInput(date);
};

const AddExpense = () => {
  const { addTransaction, settings } = useExpense();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedMonth = searchParams.get('month');

  const currency = settings.currency || '₹';

  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(() => getInitialTransactionDate(selectedMonth));
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title / Description is required';
    if (!amount || Number(amount) <= 0) newErrors.amount = 'Please enter a valid amount';
    if (!date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addTransaction({
      title: title.trim(),
      amount: Number(amount),
      type,
      category: type === 'income' ? 'Income' : category,
      date,
      paymentMethod,
      description: description.trim(),
      notes: notes.trim(),
      receipt
    });

    navigate('/transactions');
  };

  const categoryList = Object.keys(CATEGORIES).filter(c => c !== 'Income');

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl border border-slate-200/80 transition-colors shadow-2xs cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Add New Transaction</h2>
            <p className="text-xs text-slate-500 mt-0.5">Record an expense or income entry into your tracker</p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle Tabs (Expense vs Income) */}
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Income') setCategory('Food');
              }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                type === 'expense'
                  ? 'bg-white text-rose-600 shadow-md shadow-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Expense Entry
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Income');
              }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                type === 'income'
                  ? 'bg-white text-emerald-600 shadow-md shadow-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Income Entry
            </button>
          </div>

          {/* Amount Field (Large Input) */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Transaction Amount
            </label>
            <div className="relative flex items-center justify-center max-w-xs w-full">
              <span className="text-3xl font-extrabold text-slate-400 mr-1.5">{currency}</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors({ ...errors, amount: null });
                }}
                className="w-full text-3xl font-extrabold text-slate-900 bg-transparent text-center focus:outline-none placeholder-slate-300"
                autoFocus
              />
            </div>
            {errors.amount && <p className="text-xs text-rose-600 font-medium mt-2">{errors.amount}</p>}
          </div>

          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Transaction Name / Description"
              placeholder={type === 'expense' ? 'e.g. Whole Foods Grocery' : 'e.g. Client Freelance Payment'}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              error={errors.title}
              required
            />
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
              required
            />
          </div>

          {/* Category Dropdown (for Expense) */}
          {type === 'expense' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 tracking-wide block mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categoryList.map((catKey) => {
                  const cat = CATEGORIES[catKey];
                  const Icon = cat.icon;
                  const isSelected = category === catKey;

                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setCategory(catKey)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? `${cat.bgColor} ${cat.borderColor} ${cat.textColor} ring-2 ring-indigo-500/20 shadow-2xs font-bold`
                          : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs">{cat.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment Method Selector Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-700 tracking-wide block mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PAYMENT_METHODS.map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;

                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20 shadow-2xs'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 tracking-wide">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add any extra details or tags..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>

          {/* Receipt Drag & Drop Uploader */}
          <ReceiptUploader
            value={receipt}
            onChange={setReceipt}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/transactions')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={PlusCircle}
            >
              Save {type === 'expense' ? 'Expense' : 'Income'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddExpense;
