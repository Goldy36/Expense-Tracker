const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const buildUrl = (path, params) => {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
};

const request = async (method, path, data, params) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = sessionStorage.getItem('expenseflow_token') || localStorage.getItem('expenseflow_token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  let responseData = null;
  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      sessionStorage.removeItem('expenseflow_token');
      sessionStorage.removeItem('expenseflow_user');
      localStorage.removeItem('expenseflow_token');
      localStorage.removeItem('expenseflow_user');
      localStorage.removeItem('expenseflow_remember_me');
      window.dispatchEvent(new Event('expenseflow:auth-cleared'));
    }

    const error = new Error(responseData?.message || 'Request failed');
    error.response = {
      status: response.status,
      data: responseData,
    };
    throw error;
  }

  return { data: responseData };
};

const API = {
  get: (path, config = {}) => request('GET', path, undefined, config.params),
  post: (path, data) => request('POST', path, data),
  put: (path, data) => request('PUT', path, data),
  delete: (path) => request('DELETE', path),
};

export default API;
