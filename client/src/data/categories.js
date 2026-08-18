import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Wallet,
  Building,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote
} from 'lucide-react';

export const CATEGORIES = {
  Food: {
    id: 'Food',
    label: 'Food & Dining',
    icon: Utensils,
    color: '#F97316', // Orange
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  Transport: {
    id: 'Transport',
    label: 'Transportation',
    icon: Car,
    color: '#06B6D4', // Cyan
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    borderColor: 'border-cyan-200',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  },
  Shopping: {
    id: 'Shopping',
    label: 'Shopping',
    icon: ShoppingBag,
    color: '#EC4899', // Pink
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-200',
    badgeClass: 'bg-pink-100 text-pink-700 border-pink-200',
  },
  Entertainment: {
    id: 'Entertainment',
    label: 'Entertainment',
    icon: Film,
    color: '#8B5CF6', // Purple
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  Bills: {
    id: 'Bills',
    label: 'Bills & Utilities',
    icon: Receipt,
    color: '#EF4444', // Red
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
  },
  Health: {
    id: 'Health',
    label: 'Healthcare',
    icon: HeartPulse,
    color: '#10B981', // Emerald
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  Education: {
    id: 'Education',
    label: 'Education',
    icon: GraduationCap,
    color: '#3B82F6', // Blue
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  Other: {
    id: 'Other',
    label: 'Other / Misc',
    icon: MoreHorizontal,
    color: '#64748B', // Slate
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  Income: {
    id: 'Income',
    label: 'Income / Salary',
    icon: Wallet,
    color: '#10B981', // Emerald
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }
};

export const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', icon: Smartphone },
  { id: 'Credit Card', label: 'Credit Card', icon: CreditCard },
  { id: 'Debit Card', label: 'Debit Card', icon: CreditCard },
  { id: 'Bank Transfer', label: 'Bank Transfer', icon: Landmark },
  { id: 'Cash', label: 'Cash', icon: Banknote },
];

export const CATEGORY_OPTIONS = Object.keys(CATEGORIES).filter(key => key !== 'Income');
