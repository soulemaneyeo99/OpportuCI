/**
 * Service d'authentification pour OpportuCI - Version optimisée avec gestion CORS
 * Gère les requêtes liées à l'authentification vers l'API
 */

import axios from 'axios';

// Configuration de l'URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

// Instance axios avec configuration de base et gestion CORS
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour les cookies de session
});

// Intercepteur pour requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    
    console.log(`Requête envoyée à: ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour réponses avec gestion détaillée des erreurs
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Réponse de ${response.config.url}:`, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error(`Erreur depuis ${originalRequest?.url || 'inconnu'}:`, error.response || error.message);
    
    // Gestion spécifique des erreurs CORS
    if (error.message && (
        error.message.includes('Network Error') || 
        error.message.includes('CORS') ||
        !error.response
    )) {
      console.error('Possible erreur CORS détectée');
      
      // Si nous sommes en environnement de développement, suggérer l'utilisation d'un proxy
      if (import.meta.env.DEV) {
        console.warn(
          'CONSEIL: Pour résoudre les erreurs CORS en développement, ' +
          'configurez un proxy dans vite.config.js ou utilisez une extension comme CORS Unblock'
        );
      }
    }
    
    // Si erreur 401 et pas déjà une requête de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newTokens = await AuthService.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Échec du rafraîchissement du token:', refreshError);
        AuthService.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour traiter les erreurs de manière cohérente
const handleApiError = (error, context) => {
  // Afficher plus de détails sur l'erreur pour faciliter le débogage
  console.group(`Erreur détaillée - ${context}`);
  console.error('Message:', error.message);
  console.error('Réponse:', error.response?.data);
  console.error('Status:', error.response?.status);
  console.error('Headers:', error.response?.headers);
  console.error('Config:', error.config);
  console.groupEnd();

  const errorData = error.response?.data || {
    message: `Erreur lors de ${context}`,
    details: error.message
  };
  
  return errorData;
};

// Service d'authentification
export const AuthService = {
  /**
   * Inscription d'un nouvel utilisateur avec gestion des fichiers
   */
  /**
 * Optimisation de la fonction d'inscription dans authService.js
 * Résout les problèmes de format de données et de structure
 */

// Remplacer la fonction register existante par celle-ci dans authService.js:
  register: async (userData) => {
    try {
      console.log('Données d\'inscription brutes:', userData);
      
      // Préparation des données selon la structure attendue par le backend
      let data;
      let config = {};
      
      // Vérifie si des fichiers sont présents pour déterminer le format d'envoi
      const hasFiles = userData.cv instanceof File || userData.profile_picture instanceof File;
      
      if (hasFiles) {
        // Cas avec fichiers: utiliser FormData
        data = new FormData();
        
        // Traitement des données de profil pour les intégrer correctement
        // Convertir les propriétés de profil en format plat
        if (userData.profile) {
          const profileData = userData.profile;
          delete userData.profile; // Retirer l'objet profile
          
          // Ajouter les champs de profil avec le préfixe "profile."
          Object.entries(profileData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                // Convertir les tableaux en chaînes séparées par des virgules
                data.append(`profile.${key}`, value.join(','));
              } else {
                data.append(`profile.${key}`, value);
              }
            }
          });
        }
        
        // Ajouter les autres champs
        Object.entries(userData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              data.append(key, value);
            } else if (Array.isArray(value)) {
              data.append(key, value.join(','));
            } else {
              data.append(key, value);
            }
          }
        });
        
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        };
        
        // Log pour vérifier les données FormData
        console.log('Envoi en mode FormData:');
        for (const [key, value] of data.entries()) {
          console.log(`${key}: ${value instanceof File ? `Fichier: ${value.name}` : value}`);
        }
      } else {
        // Cas sans fichiers: utiliser JSON standard
        // Structure propre pour le backend
        data = {
          ...userData,
          // S'assurer que les tableaux restent des tableaux
          skills: Array.isArray(userData.skills) ? userData.skills : 
            (userData.skills ? userData.skills.split(',').map(s => s.trim()) : []),
          interests: Array.isArray(userData.interests) ? userData.interests : 
            (userData.interests ? userData.interests.split(',').map(s => s.trim()) : []),
          languages: Array.isArray(userData.languages) ? userData.languages : 
            (userData.languages ? userData.languages.split(',').map(s => s.trim()) : []),
          certifications: Array.isArray(userData.certifications) ? userData.certifications : 
            (userData.certifications ? userData.certifications.split(',').map(s => s.trim()) : [])
        };
        
        config = {
          headers: {
            'Content-Type': 'application/json',
          }
        };
        
        console.log('Envoi en mode JSON:', data);
      }

      // Envoi de la requête avec l'URL complète pour éviter les problèmes de chemin
      const url = '/api/accounts/users/';
      console.log(`Envoi de la requête à ${url}`);
      
      const response = await apiClient.post(url, data, config);
      console.log('Réponse d\'inscription:', response.data);
      return response.data;
    } catch (error) {
      // Amélioration du débogage des erreurs
      console.group('Erreur détaillée - Inscription');
      console.error('Message:', error.message);
      
      if (error.response) {
        console.error('Statut HTTP:', error.response.status);
        console.error('Détails de l\'erreur:', error.response.data);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Aucune réponse reçue. Vérifiez le réseau et CORS:', error.request);
      } else {
        console.error('Erreur dans la configuration de la requête:', error.config);
      }
      console.groupEnd();

      // Formater l'erreur pour l'interface utilisateur
      const errorData = error.response?.data || {
        message: `Erreur lors de l'inscription: ${error.message}`,
        details: error.message
      };
      
      throw errorData;
    }
  },
  
  /**
   * Connexion d'un utilisateur
   */
  login: async (credentials) => {
  try {
    const { email, password } = credentials;  // <-- destructuration correcte
    console.log('Tentative de connexion avec:', { email, password: '********' });

    const response = await axios.post(`${API_URL}api/auth/jwt/create/`, {
      email, 
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      console.log('Connexion réussie, token stocké');
    }

    return response.data;
  } catch (error) {
    console.error('Erreur de connexion détaillée:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    if (error.response?.status === 401) {
      throw new Error('Email ou mot de passe incorrect');
    }
    throw error;
  }
},

  /**
   * Rafraîchissement du token
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Refresh token non disponible');
      }
      
      const response = await apiClient.post('/api/accounts/auth/token/refresh/', {
        refresh: refreshToken
      });
      
      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        console.log('Token rafraîchi avec succès');
      }
      
      return response.data;
    } catch (error) {
      const errorData = handleApiError(error, 'le rafraîchissement du token');
      throw errorData;
    }
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('Déconnexion effectuée, tokens supprimés');
    // Optionnel: Appel API pour invalider le token côté serveur
    // apiClient.post('api/accounts/auth/logout/');
  },

  /**
   * Vérification de l'état d'authentification
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  /**
   * Récupération du profil utilisateur
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/accounts/profile/');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const errorData = handleApiError(error, 'la récupération du profil');
      throw errorData;
    }
  },

  /**
   * Mise à jour du profil utilisateur
   */
  updateProfile: async (profileData) => {
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== undefined && profileData[key] !== null) {
          formData.append(key, profileData[key]);
        }
      });

      const response = await apiClient.patch('/api/accounts/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const errorData = handleApiError(error, 'la mise à jour du profil');
      throw errorData;
    }
  },

  /**
   * Gestion des erreurs CORS
   */
  handleCorsError: (error) => {
    if (error.message && error.message.includes('Network Error')) {
      console.error('Erreur réseau détectée:', error);
      return {
        message: 'Problème de connexion au serveur',
        details: 'Vérifiez votre connexion internet ou contactez le support. Si vous êtes en développement, vérifiez la configuration CORS.'
      };
    }
    return error;
  }
};

export default AuthService;