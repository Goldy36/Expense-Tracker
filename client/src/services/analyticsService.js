import API from './api';

export const analyticsService = {
  getSummary: async () => {
    const response = await API.get('/analytics/summary');
    return response.data;
  },

  getCategoryBreakdown: async () => {
    const response = await API.get('/analytics/category-breakdown');
    return response.data;
  },

  getMonthlyExpenses: async () => {
    const response = await API.get('/analytics/monthly');
    return response.data;
  },

  getIncomeVsExpense: async (timeframe) => {
    const response = await API.get('/analytics/income-expense', { params: { timeframe } });
    return response.data;
  }
};
