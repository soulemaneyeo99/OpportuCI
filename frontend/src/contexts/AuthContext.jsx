// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// Hook personnalisé pour accéder au contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour effacer les erreurs
  const clearError = useCallback(() => setError(null), []);

  // Initialisation du contexte d'authentification
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Vérifie si un token existe dans le localStorage
        if (!api.isAuthenticated()) {
          return;
        }

        // Récupérer l'utilisateur courant si un token est présent
        const user = await api.getCurrentUser();
        
        if (user) {
          setCurrentUser(user);
          
          try {
            // Récupérer le profil utilisateur
            const profile = await api.getUserProfile();
            if (profile) {
              setUserProfile(profile);
            }
          } catch (profileError) {
            console.error("Erreur lors du chargement du profil:", profileError);
            // Ne pas déconnecter en cas d'erreur de profil
          }
        }
      } catch (err) {
        console.error("Erreur d'initialisation de l'authentification:", err);
        // Si erreur d'authentification, nettoyer les tokens éventuels
        if (err.response?.status === 401) {
          api.logout();
        }
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Fonction de login optimisée pour gérer les erreurs détaillées
  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    clearError();
    
    try {
      // Validation des champs côté client avant d'appeler l'API
      if (!email || !password) {
        throw new Error('Email et mot de passe sont requis');
      }
      
      // Appel de l'API pour se connecter
      const result = await api.login({ email, password });
      
      // Si l'API renvoie une erreur (pas une exception)
      if (!result.success) {
        // Structurer l'erreur pour qu'elle soit plus facilement utilisable dans les composants
        const errorObj = new Error(result.error || 'Erreur lors de la connexion');
        errorObj.fieldErrors = result.fieldErrors;
        throw errorObj;
      }

      // Récupération des données utilisateur après connexion réussie
      try {
        const user = await api.getCurrentUser();
        setCurrentUser(user);
        
        if (user) {
          const profile = await api.getUserProfile();
          setUserProfile(profile);
        }
      } catch (userError) {
        console.error('Erreur lors de la récupération des informations utilisateur:', userError);
        // On continue quand même, car l'authentification a réussi
        // Les données utilisateur seront chargées lors d'une prochaine utilisation
      }
      
      return result;
    } catch (err) {
      // Structurer l'erreur pour le composant Login
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Inscription utilisateur
  const register = useCallback(async (registerData) => {
    setLoading(true);
    clearError();
    
    try {
      const result = await api.UserAPI.register(registerData);
      return result;
    } catch (err) {
      // Structurer l'erreur comme pour le login
      const errorObj = new Error(err.response?.data?.detail || 'Erreur lors de l\'inscription');
      errorObj.fieldErrors = err.response?.data;
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Déconnexion
  const logout = useCallback(() => {
    api.logout();
    setCurrentUser(null);
    setUserProfile(null);
    clearError();
  }, [clearError]);

  // Mise à jour du profil
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    clearError();
    
    try {
      const updatedProfile = await api.updateUserProfile(profileData);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const errorObj = new Error(err.response?.data?.detail || 'Erreur lors de la mise à jour du profil');
      errorObj.fieldErrors = err.response?.data;
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Méthode utilitaire pour vérifier si l'utilisateur est authentifié
  const isAuthenticated = useCallback(() => {
    return api.isAuthenticated() && !!currentUser;
  }, [currentUser]);

  // Rafraîchir les données utilisateur
  const refreshUserData = useCallback(async () => {
    if (!api.isAuthenticated()) {
      return false;
    }
    
    setLoading(true);
    try {
      const user = await api.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const profile = await api.getUserProfile();
        setUserProfile(profile);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des données utilisateur:", err);
      if (err.response?.status === 401) {
        logout();
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    authInitialized,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    refreshUserData,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;