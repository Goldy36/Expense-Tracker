import Budget from '../models/Budget.js';

// @desc    Get all budgets for current user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    return res.json({
      success: true,
      count: budgets.length,
      data: budgets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update category budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res, next) => {
  try {
    const { category, limit, month, year, startDate, endDate } = req.body;

    if (!category || !limit) {
      return res.status(400).json({
        success: false,
        message: 'Category and monthly limit amount are required'
      });
    }

    const currentMonth = month !== undefined ? Number(month) : new Date().getMonth();
    const currentYear = year !== undefined ? Number(year) : new Date().getFullYear();

    // Check if budget for category & month already exists
    let budget = await Budget.findOne({
      userId: req.user._id,
      category,
      month: currentMonth,
      year: currentYear
    });

    if (budget) {
      budget.limit = Number(limit);
      if (startDate) budget.startDate = startDate;
      if (endDate) budget.endDate = endDate;
      await budget.save();
    } else {
      budget = await Budget.create({
        userId: req.user._id,
        category,
        limit: Number(limit),
        month: currentMonth,
        year: currentYear,
        startDate: startDate || new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
        endDate: endDate || new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
      });
    }

    return res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update budget by ID
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized'
      });
    }

    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget by ID
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized'
      });
    }

    await budget.deleteOne();

    return res.json({
      success: true,
      message: 'Budget deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};
