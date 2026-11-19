import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Plus, TrendingUp, Calendar, Sparkles, RefreshCw, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useExpense } from '../../context/ExpenseContext';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { getMonthValue, useSelectedMonth } from '../../context/MonthContext';

const MOTIVATIONAL_QUOTES = [
  "A budget is telling your money where to go instead of wondering where it went.",
  "Do not save what is left after spending, but spend what is left after saving.",
  "Beware of little expenses; a small leak will sink a great ship.",
  "Financial freedom is peace of mind, not just wealth.",
  "Small daily savings build compounding future freedom.",
  "The art is not in making money, but in keeping it.",
  "Control your money, or the lack of it will control you.",
  "An investment in knowledge pays the best interest.",
  "Every rupee saved today is a step toward financial independence tomorrow.",
  "Plan your spending, track your progress, build your legacy.",
  "Consistency in tracking is the secret to mastering personal finance.",
  "It's not how much money you make, but how much money you keep.",
  "Wealth is built by spending less than you earn, consistently over time.",
  "Your financial habits today shape your freedom tomorrow."
];

const Header = () => {
  const { user } = useAuth();
  const { transactions, budgets, settings } = useExpense();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const { selectedMonth, setSelectedMonth } = useSelectedMonth();
  const budgetAlertsEnabled = settings.notifications?.budgetAlerts ?? false;
  const notificationStorageKey = `finpulse-seen-budget-alerts:${user?._id || user?.email || 'account'}`;
  const [seenBudgetAlertIds, setSeenBudgetAlertIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(notificationStorageKey) || '[]');
    } catch {
      return [];
    }
  });
  const budgetAlerts = useMemo(() => {
    if (!budgetAlertsEnabled) return [];

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return budgets
      .filter((budget) => Number(budget.month) === month && Number(budget.year) === year)
      .map((budget) => {
        const spent = transactions
          .filter((transaction) => transaction.type === 'expense'
            && transaction.category === budget.category
            && String(transaction.date).slice(0, 7) === `${year}-${String(month + 1).padStart(2, '0')}`)
          .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
        const limit = Number(budget.limit) || 0;
        const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
        return {
          ...budget,
          spent,
          limit,
          percentage,
          remaining: limit - spent,
          alertKey: `${budget.id || budget._id || budget.category}:${percentage >= 100 ? 'over' : 'near'}`,
        };
      })
      .filter((budget) => budget.percentage >= 80)
      .sort((a, b) => b.percentage - a.percentage);
  }, [budgetAlertsEnabled, budgets, transactions]);
  const unreadBudgetAlerts = budgetAlerts.filter((alert) => !seenBudgetAlertIds.includes(alert.alertKey));

  const toggleNotifications = () => {
    const opening = !showNotifications;
    if (opening && unreadBudgetAlerts.length > 0) {
      const seenIds = Array.from(new Set([
        ...seenBudgetAlertIds,
        ...unreadBudgetAlerts.map((alert) => alert.alertKey),
      ]));
      setSeenBudgetAlertIds(seenIds);
      try {
        localStorage.setItem(notificationStorageKey, JSON.stringify(seenIds));
      } catch {
        // Keep the read state for this session when browser storage is unavailable.
      }
    }
    setShowNotifications(opening);
  };

  // Random motivational quote initialized on load
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));

  // Current date & time tracking
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const shuffleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  // Exact time-of-day greeting calculator:
  // 12:00 AM - 11:59 AM: Good morning
  // 12:00 PM - 3:59 PM: Good afternoon
  // 4:00 PM - 11:59 PM: Good evening
  const getGreetingDetails = () => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      return { text: 'Good morning', emoji: '☀️' };
    }
    if (hour >= 12 && hour < 16) {
      return { text: 'Good afternoon', emoji: '🌤️' };
    }
    return { text: 'Good evening', emoji: '🌆' };
  };

  const { text: greetingText, emoji: greetingEmoji } = getGreetingDetails();
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(currentTime.getFullYear(), currentTime.getMonth() - index, 1);
    return {
      value: getMonthValue(date),
      label: date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    };
  });

  return (
    <header className="app-header bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Time-Based Greeting Header & Motivational Quote */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>{greetingText}, {firstName}</span>
          <span className="text-lg">{greetingEmoji}</span>
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="text-xs font-medium text-indigo-700 bg-indigo-50/80 border border-indigo-100/80 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="italic">"{MOTIVATIONAL_QUOTES[quoteIndex]}"</span>
          </div>
          <button
            type="button"
            onClick={shuffleQuote}
            className="text-slate-400 hover:text-indigo-600 p-1 rounded-md transition-colors cursor-pointer"
            title="Next motivational quote"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="hidden sm:flex items-center gap-2 bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            aria-label="Select month"
            className="bg-transparent border-none outline-none font-medium text-slate-700 cursor-pointer pr-1"
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
            title={budgetAlerts.length ? `${budgetAlerts.length} budget alert${budgetAlerts.length === 1 ? '' : 's'}` : 'Notifications'}
            aria-label={budgetAlerts.length ? `Notifications, ${budgetAlerts.length} budget alert${budgetAlerts.length === 1 ? '' : 's'}` : 'Notifications'}
            aria-expanded={showNotifications}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadBudgetAlerts.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unreadBudgetAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[min(70vh,440px)] overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 className="text-sm font-semibold text-slate-900">Notifications</h4>
                {budgetAlerts.length > 0 && (
                  <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700">
                    Budget alerts
                  </span>
                )}
              </div>
              {budgetAlerts.length > 0 ? (
                <div className="space-y-2">
                  {budgetAlerts.map((alert) => {
                    const isOverBudget = alert.remaining < 0;
                    const Icon = AlertTriangle;
                    return (
                      <button
                        key={alert.id || `${alert.category}-${alert.month}-${alert.year}`}
                        type="button"
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/budgets');
                        }}
                        className="notification-alert flex w-full items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/70 p-3 text-left transition-colors hover:bg-orange-50"
                      >
                        <span className="mt-0.5 rounded-lg bg-white p-2 text-orange-600 shadow-sm">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-slate-900">
                            {alert.category} budget {isOverBudget ? 'exceeded' : 'near limit'}
                          </span>
                          <span className="mt-1 block text-[11px] leading-relaxed text-slate-600">
                            Spent {settings.currency || '₹'}{alert.spent.toLocaleString()} of {settings.currency || '₹'}{alert.limit.toLocaleString()} ({alert.percentage}%).
                            {isOverBudget
                              ? ` Over by ${settings.currency || '₹'}${Math.abs(alert.remaining).toLocaleString()}.`
                              : ` ${settings.currency || '₹'}${alert.remaining.toLocaleString()} remaining.`}
                          </span>
                        </span>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-2">
                  <p className="text-xs text-slate-500">
                    {budgetAlertsEnabled
                      ? 'You’re all caught up. Budget alerts appear when spending reaches 80%.'
                      : 'Budget alerts are turned off.'}
                  </p>
                  {!budgetAlertsEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/settings');
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:text-orange-800"
                    >
                      Enable alerts in Settings <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {location.pathname !== '/add-expense' && (
          <div className="flex items-center gap-2">
            <Button
              variant="success"
              size="md"
              icon={TrendingUp}
              onClick={() => navigate(`/add-expense?type=income&month=${selectedMonth}`)}
            >
              Add Income
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => navigate(`/add-expense?month=${selectedMonth}`)}
            >
              Add Expense
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
