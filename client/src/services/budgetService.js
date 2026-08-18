import API from './api';

export const budgetService = {
  getBudgets: async () => {
    const response = await API.get('/budgets');
    return response.data;
  },

  createBudget: async (data) => {
    const response = await API.post('/budgets', data);
    return response.data;
  },

  updateBudget: async (id, data) => {
    const response = await API.put(`/budgets/${id}`, data);
    return response.data;
  },

  deleteBudget: async (id) => {
    const response = await API.delete(`/budgets/${id}`);
    return response.data;
  }
};
