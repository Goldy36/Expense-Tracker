import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  PieChart,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../ui/BrandLogo';

const Sidebar = () => {
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
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen fixed left-0 top-0 z-30 select-none shadow-xs">
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <BrandLogo className="w-10 h-10 rounded-xl shadow-md shadow-orange-200" />
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">FinPulse</h1>
          <span className="text-[11px] font-medium text-slate-400">Expense Tracker</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-6 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-indigo-500" />}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between gap-3 p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-9 h-9 rounded-lg object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Your name'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'you@example.com'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors flex-shrink-0"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
