import API from './api';

export const authService = {
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      sessionStorage.removeItem('expenseflow_token');
      sessionStorage.removeItem('expenseflow_user');
      localStorage.removeItem('expenseflow_token');
      localStorage.removeItem('expenseflow_user');
      localStorage.removeItem('expenseflow_remember_me');
    }
  }
};
