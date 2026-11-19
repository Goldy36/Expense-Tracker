import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  PieChart,
  BarChart3,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import BrandLogo from '../ui/BrandLogo';
import ThemeToggle from '../ui/ThemeToggle';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: ReceiptText },
    { label: 'Add Expense', path: '/add-expense', icon: PlusCircle },
    { label: 'Budgets', path: '/budgets', icon: PieChart },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5">
        <BrandLogo className="w-8 h-8 rounded-lg" />
        <span className="font-bold text-slate-900 text-base">FinPulse</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/add-expense')}
        >
          Add
        </Button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-0 top-[57px] z-50 bg-slate-900/40 backdrop-blur-xs flex">
          <div className="bg-white w-72 h-full p-5 flex flex-col justify-between shadow-2xl animate-fade-in">
            <div className="space-y-1">
              <p className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Navigation
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900">{user?.name || 'Your name'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || 'you@example.com'}</p>
                </div>
              </div>
              <Button variant="outline" fullWidth icon={LogOut} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default MobileNav;
