import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Plus, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

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
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('August 2026');

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

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <div className="hidden sm:flex items-center gap-2 bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            aria-label="Select month"
            className="bg-transparent border-none outline-none font-medium text-slate-700 cursor-pointer pr-1"
          >
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
          </select>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 className="text-sm font-semibold text-slate-900">Notifications</h4>
              </div>
              <p className="text-xs text-slate-500">No new notifications.</p>
            </div>
          )}
        </div>

        {location.pathname !== '/add-expense' && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate('/add-expense')}
          >
            Add Expense
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
