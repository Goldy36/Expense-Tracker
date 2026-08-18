import Transaction from '../models/Transaction.js';

// @desc    Get dashboard financial summary
// @route   GET /api/analytics/summary
// @access  Private
export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startCurrent = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
    const endCurrent = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const startPrev = new Date(prevYear, prevMonth, 1).toISOString().split('T')[0];
    const endPrev = new Date(prevYear, prevMonth + 1, 0).toISOString().split('T')[0];

    // Current Month Data
    const currentTxs = await Transaction.find({
      userId,
      date: { $gte: startCurrent, $lte: endCurrent }
    });

    // Previous Month Data
    const prevTxs = await Transaction.find({
      userId,
      date: { $gte: startPrev, $lte: endPrev }
    });

    const totalIncome = currentTxs
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentTxs
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevIncome = prevTxs
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevExpenses = prevTxs
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const prevBalance = prevIncome - prevExpenses;
    const savings = balance > 0 ? balance : 0;
    const prevSavings = prevBalance > 0 ? prevBalance : 0;

    return res.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance,
        savings,
        prevIncome,
        prevExpenses,
        prevBalance,
        prevSavings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category expense breakdown
// @route   GET /api/analytics/category-breakdown
// @access  Private
export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const breakdown = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } }
    ]);

    return res.json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly expense trends (6 months)
// @route   GET /api/analytics/monthly
// @access  Private
export const getMonthlyExpenses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

      const start = new Date(y, m, 1).toISOString().split('T')[0];
      const end = new Date(y, m + 1, 0).toISOString().split('T')[0];

      const txs = await Transaction.find({
        userId,
        type: 'expense',
        date: { $gte: start, $lte: end }
      });

      const total = txs.reduce((sum, t) => sum + t.amount, 0);

      months.push({
        name: label,
        amount: total,
        isCurrent: i === 0
      });
    }

    return res.json({
      success: true,
      data: months
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get income vs expense chart series
// @route   GET /api/analytics/income-expense
// @access  Private
export const getIncomeVsExpense = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { timeframe = '30 Days' } = req.query;

    const transactions = await Transaction.find({ userId }).sort({ date: 1 });

    return res.json({
      success: true,
      timeframe,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};
