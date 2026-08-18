import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { User, Bell, Globe, LogOut } from 'lucide-react';

const Settings = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { settings, updateSettings } = useExpense();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState(settings?.currency || user?.currency || '₹');
  const [defaultDateRange, setDefaultDateRange] = useState(settings?.defaultDateRange || '30 Days');
  const [defaultTransactionType, setDefaultTransactionType] = useState(settings?.defaultTransactionType || 'all');
  const [notifications, setNotifications] = useState(settings?.notifications || {
    budgetAlerts: false,
    weeklySummary: false,
    monthlyReport: false,
  });

  React.useEffect(() => {
    if (settings?.currency) {
      setCurrency(settings.currency);
    } else if (user?.currency) {
      setCurrency(user.currency);
    }
  }, [settings?.currency, user?.currency]);

  React.useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user?.name, user?.email]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile({ name, email });
  };

  const handlePreferencesSave = (e) => {
    e.preventDefault();
    updateSettings({
      currency,
      defaultDateRange,
      defaultTransactionType,
      notifications,
    });
  };

  const handleToggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    updateSettings({ notifications: updated });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Account & App Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal profile, currency preferences, notifications, and security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card className="text-center p-6 space-y-3">
            <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 font-bold text-2xl flex items-center justify-center mx-auto border-2 border-indigo-200">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{user?.name || 'Your name'}</h3>
              <p className="text-xs text-slate-400">{user?.email || 'you@example.com'}</p>
            </div>
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-full">
              Personal Account
            </span>
          </Card>

          <Card title="Quick Actions">
            <div className="space-y-2">
              <Button
                variant="danger"
                size="sm"
                fullWidth
                icon={LogOut}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card
            title="User Profile"
            subtitle="Update your personal details"
            action={<User className="w-5 h-5 text-indigo-600" />}
          >
            <form onSubmit={handleProfileSave} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" type="submit">
                  Save Profile
                </Button>
              </div>
            </form>
          </Card>

          <Card
            title="App Preferences"
            subtitle="Currency and view settings"
            action={<Globe className="w-5 h-5 text-indigo-600" />}
          >
            <form onSubmit={handlePreferencesSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Currency Symbol"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  options={[
                    { value: '$', label: '$ (USD - US Dollar)' },
                    { value: '₹', label: '₹ (INR - Indian Rupee)' },
                    { value: '€', label: '€ (EUR - Euro)' },
                    { value: '£', label: '£ (GBP - British Pound)' },
                  ]}
                />
                <Select
                  label="Default Date Range"
                  value={defaultDateRange}
                  onChange={(e) => setDefaultDateRange(e.target.value)}
                  options={[
                    { value: '30 Days', label: '30 Days' },
                    { value: '7 Days', label: '7 Days' },
                    { value: 'This Month', label: 'This Month' },
                  ]}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" type="submit">
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>

          <Card
            title="Notification Alerts"
            subtitle="Configure automated alert triggers"
            action={<Bell className="w-5 h-5 text-indigo-600" />}
          >
            <div className="space-y-3 divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Budget Limit Alerts</h4>
                  <p className="text-xs text-slate-400">Receive warnings when spending reaches 80% of budget</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.budgetAlerts}
                  onChange={() => handleToggleNotification('budgetAlerts')}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Weekly Spending Summary</h4>
                  <p className="text-xs text-slate-400">Get weekly digest notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weeklySummary}
                  onChange={() => handleToggleNotification('weeklySummary')}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Monthly Expense Report</h4>
                  <p className="text-xs text-slate-400">Automated end-of-month breakdown</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.monthlyReport}
                  onChange={() => handleToggleNotification('monthlyReport')}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
