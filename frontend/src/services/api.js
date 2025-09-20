// src/services/api.js - Version mise à jour avec Chat Gemini

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// ---------------------- Axios Instance ----------------------

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour éviter les boucles infinies sur les erreurs
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// ---------------------- Auth Token Config ----------------------

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('access', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    delete API.defaults.headers.common['Authorization'];
  }
};

// Intercepteur de requête pour ajouter le token automatiquement
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Intercepteur de réponse pour gérer les erreurs d'authentification
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest.url && 
                             originalRequest.url.includes('auth/jwt/refresh');
    
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !isRefreshRequest) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = localStorage.getItem('refresh');
      
      if (!refreshToken) {
        isRefreshing = false;
        logout();
        return Promise.reject(error);
      }
      
      try {
        const response = await API.post('/auth/jwt/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        
        setAuthToken(access);
        processQueue(null, access);
        
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        isRefreshing = false;
        
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ---------------------- Helper pour gérer les erreurs ----------------------

const handleRequest = async (requestFn) => {
  try {
    const res = await requestFn();
    return res.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// ---------------------- AUTHENTIFICATION ----------------------

export const AuthAPI = {
  login: async ({ email, password }) => {
    try {
      if (!email || !password) {
        return { 
          success: false, 
          error: 'Email et mot de passe sont requis' 
        };
      }
      
      const response = await API.post('/auth/jwt/create/', {
        email,
        password
      });
      
      const { access, refresh } = response.data;
      
      if (access) {
        setAuthToken(access);
        if (refresh) {
          localStorage.setItem('refresh', refresh);
        }
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'No access token received' };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.email || errorData.password) {
          const emailError = errorData.email ? errorData.email[0] : '';
          const passwordError = errorData.password ? errorData.password[0] : '';
          
          let errorMessage = '';
          if (emailError && passwordError) {
            errorMessage = `Email: ${emailError}, Mot de passe: ${passwordError}`;
          } else if (emailError) {
            errorMessage = `Email: ${emailError}`;
          } else if (passwordError) {
            errorMessage = `Mot de passe: ${passwordError}`;
          }
          
          return { 
            success: false, 
            error: errorMessage || 'Validation error', 
            fieldErrors: errorData 
          };
        }
        
        if (errorData.detail) {
          return { 
            success: false, 
            error: errorData.detail
          };
        }
      }
      
      return { 
        success: false, 
        error: 'Erreur de connexion. Veuillez réessayer.' 
      };
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const refresh = refreshToken || localStorage.getItem('refresh');
      
      if (!refresh) {
        return { success: false, error: 'No refresh token available' };
      }
      
      const response = await API.post('/auth/jwt/refresh/', { refresh });
      const { access } = response.data;
      
      if (access) {
        setAuthToken(access);
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'No access token received' };
    } catch (error) {
      console.error('Token refresh error:', error.response?.data || error.message);
      logout();
      return { success: false, error: 'Failed to refresh token' };
    }
  },

  verifyToken: async (token) => {
    try {
      await API.post('/auth/jwt/verify/', { token });
      return { success: true };
    } catch (error) {
      console.error('Token verification error:', error.response?.data || error.message);
      return { success: false, error: 'Token invalid' };
    }
  },

  resetPassword: (email) =>
    handleRequest(() => API.post('/auth/users/reset_password/', { email })),

  resetPasswordConfirm: (uid, token, newPassword) =>
    handleRequest(() =>
      API.post('/auth/users/reset_password_confirm/', {
        uid,
        token,
        new_password: newPassword,
      })
    ),
};

// ---------------------- UTILISATEURS ----------------------

export const UserAPI = {
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No access token available');
      }
      
      const response = await API.get('/auth/users/me/');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: (userData) =>
    handleRequest(() => API.post('/accounts/users/', userData)),

  update: (userId, userData) =>
    handleRequest(() => API.patch(`/accounts/users/${userId}/`, userData)),
};

// ---------------------- OPPORTUNITÉS ----------------------

export const OpportunityAPI = {
  getAll: () =>
    handleRequest(() => API.get('/opportunities/user-opportunities/')),

  getById: (id) =>
    handleRequest(() => API.get(`/opportunities/opportunities/${id}/`)),

  create: (data) =>
    handleRequest(() => API.post('/opportunities/opportunities/', data)),

  update: (id, data) =>
    handleRequest(() => API.put(`/opportunities/opportunities/${id}/`, data)),

  delete: (id) =>
    handleRequest(() => API.delete(`/opportunities/opportunities/${id}/`)),
};

// ---------------------- CATÉGORIES ----------------------

export const CategoryAPI = {
  getAll: () =>
    handleRequest(() => API.get('/opportunities/categories/')),
};

// ---------------------- CHAT GEMINI - NOUVEAU ----------------------

export const ChatAPI = {
  sendMessage: async (message, conversationId = null, contextType = 'general') => {
    try {
      const response = await API.post('/chat/send/', {
        message,
        conversation_id: conversationId,
        context_type: contextType
      });
      return response.data;
    } catch (error) {
      console.error('Chat send message error:', error.response?.data || error.message);
      throw error;
    }
  },

  getHistory: async (conversationId = null, limit = 50) => {
    try {
      const endpoint = conversationId 
        ? `/chat/history/${conversationId}/`
        : '/chat/history/';
      
      const response = await API.get(endpoint, { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Chat get history error:', error.response?.data || error.message);
      throw error;
    }
  },

  getConversations: async (limit = 20) => {
    try {
      const response = await API.get('/chat/conversations/', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Chat get conversations error:', error.response?.data || error.message);
      throw error;
    }
  },

  createConversation: async (contextType = 'general') => {
    try {
      const response = await API.post('/chat/new/', { context_type: contextType });
      return response.data;
    } catch (error) {
      console.error('Chat create conversation error:', error.response?.data || error.message);
      throw error;
    }
  }
};

// ---------------------- AI SERVICES ----------------------

export const AIAPI = {
  getRecommendations: async () => {
    try {
      const response = await API.get('/ai/recommendations/');
      return response.data;
    } catch (error) {
      console.error('AI recommendations error:', error.response?.data || error.message);
      throw error;
    }
  },

  getCareerAdvice: async (careerGoals) => {
    try {
      const response = await API.post('/ai/career-advice/', { career_goals: careerGoals });
      return response.data;
    } catch (error) {
      console.error('AI career advice error:', error.response?.data || error.message);
      throw error;
    }
  },

  getInterviewPrep: async (opportunityId) => {
    try {
      const response = await API.post('/ai/interview-prep/', { opportunity_id: opportunityId });
      return response.data;
    } catch (error) {
      console.error('AI interview prep error:', error.response?.data || error.message);
      throw error;
    }
  }
};

// ---------------------- API GÉNÉRIQUE ----------------------

export const GenericAPI = {
  get: (url, params = {}) => {
    const safeUrl = url.startsWith('/') ? url : `/${url}`;
    return handleRequest(() => API.get(safeUrl, { params }));
  },
  post: (url, data = {}) => {
    const safeUrl = url.startsWith('/') ? url : `/${url}`;
    return handleRequest(() => API.post(safeUrl, data));
  },
  put: (url, data = {}) => {
    const safeUrl = url.startsWith('/') ? url : `/${url}`;
    return handleRequest(() => API.put(safeUrl, data));
  },
  patch: (url, data = {}) => {
    const safeUrl = url.startsWith('/') ? url : `/${url}`;
    return handleRequest(() => API.patch(safeUrl, data));
  },
  delete: (url) => {
    const safeUrl = url.startsWith('/') ? url : `/${url}`;
    return handleRequest(() => API.delete(safeUrl));
  },
  upload: (url, formData) => {
    const safeUrl = url.startsWith('/') ? url : `/${url}`;
    return handleRequest(() =>
      API.post(safeUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  }
};

// ---------------------- FONCTIONS UTILITAIRES ----------------------

export async function deleteOpportunity(id) {
  const response = await fetch(`/api/opportunities/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete opportunity");
  }

  return await response.json();
}

export async function getUserOpportunities(userId) {
  const response = await fetch(`/api/users/${userId}/opportunities`);
  if (!response.ok) {
    throw new Error("Failed to fetch opportunities");
  }
  return await response.json();
}

// ---------------------- AUTH UTILS POUR CONTEXT ----------------------

const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  setAuthToken(null);
};

const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('access');
    if (!token) {
      return null;
    }
    
    try {
      const user = await UserAPI.getCurrentUser();
      return user;
    } catch (getUserError) {
      if (getUserError.response?.status === 401) {
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          const refreshResult = await AuthAPI.refreshToken(refreshToken);
          if (refreshResult.success) {
            return await UserAPI.getCurrentUser();
          }
        }
        logout();
      }
      return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    if (error.response?.status === 401) {
      logout();
    }
    return null;
  }
};

const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('access');
    if (!token) {
      return null;
    }
    
    return await UserAPI.getCurrentUser();
  } catch (error) {
    console.error('Error getting user profile:', error);
    
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        try {
          const refreshResult = await AuthAPI.refreshToken(refreshToken);
          if (refreshResult.success) {
            return await UserAPI.getCurrentUser();
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
        }
      }
      logout();
    }
    
    return null;
  }
};

const updateUserProfile = async (data) => {
  try {
    const user = await UserAPI.getCurrentUser();
    const userId = user.id;
    return await UserAPI.update(userId, data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

const isAuthenticated = () => {
  const token = localStorage.getItem('access');
  return !!token;
};

// ---------------------- NOUVELLE FONCTION CHAT GEMINI ----------------------

// REMPLACE l'ancienne fonction askBot
export const askBot = async (question, conversationId = null) => {
  try {
    const result = await ChatAPI.sendMessage(question, conversationId, 'general');
    if (result.success) {
      return result.response;
    } else {
      throw new Error(result.error || 'Erreur lors de la communication avec l\'assistant');
    }
  } catch (error) {
    console.error('Erreur lors de la communication avec le chatbot Gemini:', error);
    throw new Error('Échec de la communication avec l\'assistant IA');
  }
};

// ---------------------- EXPORT GLOBAL ----------------------

export default {
  setAuthToken,
  AuthAPI,
  UserAPI,
  OpportunityAPI,
  CategoryAPI,
  ChatAPI,        // NOUVEAU
  AIAPI,          // NOUVEAU
  GenericAPI,
  login: AuthAPI.login,
  refreshToken: (refresh) => AuthAPI.refreshToken(refresh),
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  logout,
  isAuthenticated,
};