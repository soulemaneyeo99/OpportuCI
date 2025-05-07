// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Configuration globale du token
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Axios instance personnalisée (utile pour ajouter interceptors plus tard)
const API = axios.create({
  baseURL: API_BASE_URL,
});

// ---------------------- AUTHENTIFICATION ----------------------

export const AuthAPI = {
  login: async (email, password) => {
    const res = await API.post('/auth/jwt/create/', { email, password });
    return res.data;
  },

  refreshToken: async (refresh) => {
    const res = await API.post('/auth/jwt/refresh/', { refresh });
    return res.data;
  },

  verifyToken: async (token) => {
    const res = await API.post('/auth/jwt/verify/', { token });
    return res.data;
  },

  resetPassword: async (email) => {
    const res = await API.post('/auth/users/reset_password/', { email });
    return res.data;
  },

  resetPasswordConfirm: async (uid, token, newPassword) => {
    const res = await API.post('/auth/users/reset_password_confirm/', {
      uid,
      token,
      new_password: newPassword,
    });
    return res.data;
  },
};

// ---------------------- UTILISATEUR ----------------------

export const UserAPI = {
  getCurrentUser: async () => {
    const res = await API.get('/auth/users/me/');
    return res.data;
  },

  register: async (userData) => {
    const res = await API.post('/accounts/users/', userData);
    return res.data;
  },

  update: async (userId, userData) => {
    const res = await API.patch(`/accounts/users/${userId}/`, userData);
    return res.data;
  },
};

// ---------------------- API AUTH UTILISÉE DANS LE CONTEXTE ----------------------

const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('access');
    if (token) {
      setAuthToken(token);
      return { access: token };
    }
    return null;
  } catch {
    return null;
  }
};

const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  setAuthToken(null);
};

const getUserProfile = async () => {
  const res = await UserAPI.getCurrentUser();
  return res;
};

const updateUserProfile = async (data) => {
  const user = await UserAPI.getCurrentUser();
  const userId = user.id;
  const res = await UserAPI.update(userId, data);
  return res;
};

const isAuthenticated = () => {
  return !!localStorage.getItem('access');
};

// ---------------------- OPPORTUNITÉS ----------------------

export const OpportunityAPI = {
  getAll: async () => {
    const res = await API.get('/opportunities/user-opportunities/');
    return res.data;
  },

  getById: async (id) => {
    const res = await API.get(`/opportunities/opportunities/${id}/`);
    return res.data;
  },

  create: async (data) => {
    const res = await API.post('/opportunities/opportunities/', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await API.put(`/opportunities/opportunities/${id}/`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await API.delete(`/opportunities/opportunities/${id}/`);
    return res.status === 204;
  },
};

// ---------------------- CATÉGORIES ----------------------

export const CategoryAPI = {
  getAll: async () => {
    const res = await API.get('/opportunities/categories/');
    return res.data;
  },
};

// ---------------------- API GÉNÉRIQUE ----------------------

export const GenericAPI = {
  get: (url, params = {}) => API.get(url, { params }),
  post: (url, data = {}) => API.post(url, data),
  put: (url, data = {}) => API.put(url, data),
  patch: (url, data = {}) => API.patch(url, data),
  delete: (url) => API.delete(url),
  upload: (url, formData) =>
    API.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ---------------------- EXPORT GLOBAL ----------------------

export default {
  setAuthToken,
  AuthAPI,
  UserAPI,
  OpportunityAPI,
  CategoryAPI,
  GenericAPI,
  login: AuthAPI.login,
  refreshToken: (refresh) => AuthAPI.refreshToken(refresh || localStorage.getItem('refresh')),
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  logout,
  isAuthenticated,
};


