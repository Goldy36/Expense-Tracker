// Format numbers with currency symbol (e.g. ₹24,580)
export const formatCurrency = (amount, currencySymbol = '₹') => {
  const num = Number(amount) || 0;
  return `${currencySymbol}${num.toLocaleString('en-IN')}`;
};

// Format dates nicely (e.g. 14 Aug 2026, Today, Yesterday)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Calculate percentage change between current and previous values
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) {
    return { value: 0, isIncrease: true, formatted: '0%' };
  }
  const diff = current - previous;
  const percentage = (diff / previous) * 100;
  const isIncrease = percentage >= 0;
  
  return {
    value: Math.abs(percentage).toFixed(1),
    isIncrease,
    formatted: `${isIncrease ? '↑' : '↓'} ${Math.abs(percentage).toFixed(1)}%`
  };
};

// Generate dynamic financial insights based on transaction & budget data
export const generateInsights = (transactions = [], budgets = []) => {
  const insights = [];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Current Month Transactions
  const currentMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Last Month Transactions
  const lastMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1) &&
           d.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
  });

  const currExpenses = currentMonthTxs
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const prevExpenses = lastMonthTxs
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currIncome = currentMonthTxs
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currSavings = currIncome - currExpenses;

  // 1. Overall Expense Trend Insight
  if (prevExpenses > 0) {
    const pctChange = ((currExpenses - prevExpenses) / prevExpenses) * 100;
    if (pctChange < 0) {
      insights.push({
        id: 'ins_exp_down',
        type: 'positive',
        title: 'Great Expense Control!',
        message: `Your total monthly spending is down by ${Math.abs(pctChange).toFixed(1)}% compared to last month.`
      });
    } else if (pctChange > 0) {
      insights.push({
        id: 'ins_exp_up',
        type: 'warning',
        title: 'Increased Monthly Spending',
        message: `Your expenses increased by ${pctChange.toFixed(1)}% this month. Keep an eye on non-essential purchases.`
      });
    }
  }

  // 2. Highest Spending Category
  const categoryMap = {};
  currentMonthTxs.filter(t => t.type === 'expense').forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });

  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0) {
    const [topCat, topAmount] = sortedCategories[0];
    const topPct = currExpenses > 0 ? ((topAmount / currExpenses) * 100).toFixed(0) : 0;
    insights.push({
      id: 'ins_top_cat',
      type: 'info',
      title: 'Top Category Insight',
      message: `${topCat} is your highest spending category this month at ₹${topAmount.toLocaleString('en-IN')} (${topPct}% of expenses).`
    });
  }

  // 3. Savings Rate Insight
  if (currIncome > 0) {
    const savingsRate = ((currSavings / currIncome) * 100).toFixed(1);
    if (savingsRate > 20) {
      insights.push({
        id: 'ins_savings_high',
        type: 'positive',
        title: 'Strong Savings Goal',
        message: `You are saving ${savingsRate}% of your income this month. Excellent financial health!`
      });
    }
  }

  // 4. Budget Over-limit warning
  budgets.forEach(bgt => {
    const spent = currentMonthTxs
      .filter(t => t.type === 'expense' && t.category === bgt.category)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    if (spent > bgt.limit) {
      insights.push({
        id: `ins_bgt_over_${bgt.category}`,
        type: 'danger',
        title: `Budget Exceeded for ${bgt.category}`,
        message: `You spent ₹${spent.toLocaleString('en-IN')}, exceeding your ₹${bgt.limit.toLocaleString('en-IN')} budget by ₹${(spent - bgt.limit).toLocaleString('en-IN')}.`
      });
    } else if (spent > bgt.limit * 0.85) {
      insights.push({
        id: `ins_bgt_warn_${bgt.category}`,
        type: 'warning',
        title: `${bgt.category} Budget Alert`,
        message: `You have used ${((spent / bgt.limit) * 100).toFixed(0)}% of your ${bgt.category} budget limit.`
      });
    }
  });

  return insights;
};
