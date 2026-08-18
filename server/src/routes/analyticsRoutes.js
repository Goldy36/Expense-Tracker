import express from 'express';
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyExpenses,
  getIncomeVsExpense
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All analytics routes are protected

router.get('/summary', getSummary);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/monthly', getMonthlyExpenses);
router.get('/income-expense', getIncomeVsExpense);

export default router;
