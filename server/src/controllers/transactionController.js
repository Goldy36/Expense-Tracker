import Transaction from '../models/Transaction.js';

// @desc    Get all transactions for authenticated user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const { search, category, type, paymentMethod, dateRange, sortBy } = req.query;

    const query = { userId: req.user._id };

    // Filtering by type
    if (type && type !== 'all') {
      query.type = type;
    }

    // Filtering by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filtering by payment method
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    // Filtering by search term
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtering by date range
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      if (dateRange === 'this_month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        query.date = { $gte: startOfMonth, $lte: endOfMonth };
      } else if (dateRange === 'last_month') {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
        query.date = { $gte: startOfLastMonth, $lte: endOfLastMonth };
      } else if (dateRange === '30_days') {
        const past30 = new Date();
        past30.setDate(past30.getDate() - 30);
        query.date = { $gte: past30.toISOString().split('T')[0] };
      } else if (dateRange === 'this_year') {
        const startOfYear = `${now.getFullYear()}-01-01`;
        query.date = { $gte: startOfYear };
      }
    }

    // Sorting
    let sortOptions = { date: -1, createdAt: -1 };
    if (sortBy === 'date_asc') sortOptions = { date: 1, createdAt: 1 };
    if (sortBy === 'amount_desc') sortOptions = { amount: -1 };
    if (sortBy === 'amount_asc') sortOptions = { amount: 1 };

    const transactions = await Transaction.find(query).sort(sortOptions);

    return res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized'
      });
    }

    return res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, paymentMethod, description, notes, receiptUrl } = req.body;

    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: title, amount, type, category, date'
      });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      title,
      amount: Number(amount),
      type,
      category,
      date,
      paymentMethod: paymentMethod || 'UPI',
      description: description || '',
      notes: notes || '',
      receiptUrl: receiptUrl || null
    });

    return res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized'
      });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized'
      });
    }

    await transaction.deleteOne();

    return res.json({
      success: true,
      message: 'Transaction deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};
