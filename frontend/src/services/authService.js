/**
 * Service d'authentification pour OpportuCI
 * Gère les requêtes liées à l'authentification vers l'API
 */

import axios from 'axios';

// Configuration de l'URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Instance axios avec configuration de base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service d'authentification
export const AuthService = {
  /**
   * Inscription d'un nouvel utilisateur
   * 
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise} - Promise avec la réponse de l'API
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/accounts/auth/register/', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  },

  /**
   * Connexion d'un utilisateur
   * 
   * @param {Object} credentials - Identifiants de connexion (email/password)
   * @returns {Promise} - Promise avec les tokens et les données utilisateur
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/accounts/auth/login/', credentials);
      
      // Stockage des tokens dans le localStorage
      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Vérification de l'état d'authentification
   * 
   * @returns {Boolean} - État de l'authentification
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Récupération du profil utilisateur
   * 
   * @returns {Promise} - Promise avec les données du profil
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/accounts/profile/');
      return response.data;
    } catch (error) {
      console.error('Erreur de récupération du profil:', error);
      throw error;
    }
  },

  /**
   * Mise à jour du profil utilisateur
   * 
   * @param {Object} profileData - Données du profil à mettre à jour
   * @returns {Promise} - Promise avec les données mises à jour
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.patch('/accounts/profile/', profileData);
      return response.data;
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      throw error;
    }
  },

  /**
   * Modification du mot de passe
   * 
   * @param {Object} passwordData - Ancien et nouveau mot de passe
   * @returns {Promise} - Promise avec la réponse de l'API
   */
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.post('/accounts/auth/password/change/', passwordData);
      return response.data;
    } catch (error) {
      console.error('Erreur de changement de mot de passe:', error);
      throw error;
    }
  },

  /**
   * Récupération d'un nouveau token à partir du refresh token
   * 
   * @returns {Promise} - Promise avec le nouveau token
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Pas de refresh token disponible');
      }
      
      const response = await apiClient.post('/accounts/auth/token/refresh/', {
        refresh: refreshToken
      });
      
      localStorage.setItem('accessToken', response.data.access);
      return response.data;
    } catch (error) {
      console.error('Erreur de rafraîchissement du token:', error);
      // En cas d'échec du rafraîchissement, déconnexion
      AuthService.logout();
      throw error;
    }
  },

  /**
   * Demande de réinitialisation de mot de passe
   * 
   * @param {Object} emailData - Email de l'utilisateur
   * @returns {Promise} - Promise avec la réponse de l'API
   */
  requestPasswordReset: async (emailData) => {
    try {
      const response = await apiClient.post('/accounts/auth/password/reset/', emailData);
      return response.data;
    } catch (error) {
      console.error('Erreur de demande de réinitialisation:', error);
      throw error;
    }
  },

  /**
   * Confirmation de la réinitialisation du mot de passe
   * 
   * @param {Object} resetData - Token et nouveau mot de passe
   * @returns {Promise} - Promise avec la réponse de l'API
   */
  confirmPasswordReset: async (resetData) => {
    try {
      const response = await apiClient.post('/accounts/auth/password/reset/confirm/', resetData);
      return response.data;
    } catch (error) {
      console.error('Erreur de confirmation de réinitialisation:', error);
      throw error;
    }
  },

  /**
   * Vérification de l'adresse email
   * 
   * @param {Object} tokenData - Token de vérification
   * @returns {Promise} - Promise avec la réponse de l'API
   */
  verifyEmail: async (tokenData) => {
    try {
      const response = await apiClient.post('/accounts/auth/email/verify/', tokenData);
      return response.data;
    } catch (error) {
      console.error('Erreur de vérification d\'email:', error);
      throw error;
    }
  }
};

export default AuthService;