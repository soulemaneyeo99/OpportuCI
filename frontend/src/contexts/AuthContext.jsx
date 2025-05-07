// src/contexts/AuthContext.jsx
import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// Hook personnalisé pour accéder au contexte
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifie l'état d'authentification au démarrage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = api.getCurrentUser();

        if (user) {
          setCurrentUser(user);

          try {
            const profile = await api.getUserProfile();
            setUserProfile(profile);
          } catch (profileError) {
            console.error("Erreur chargement profil:", profileError);

            if (profileError.response?.status === 401) {
              try {
                await api.refreshToken();
                const refreshedProfile = await api.getUserProfile();
                setUserProfile(refreshedProfile);
              } catch (refreshError) {
                logout();
              }
            }
          }
        }
      } catch (err) {
        setError(err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Intercepteur pour rafraîchir automatiquement le token
  useEffect(() => {
    if (!currentUser) return;

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshResult = await api.refreshToken();
            if (refreshResult?.access) {
              axios.defaults.headers.common['Authorization'] = `Bearer ${refreshResult.access}`;
              originalRequest.headers['Authorization'] = `Bearer ${refreshResult.access}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [currentUser]);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const userData = await api.login(username, password);
      setCurrentUser(userData);

      const profile = await api.getUserProfile();
      setUserProfile(profile);

      return userData;
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    try {
      setLoading(true);
      setError(null);
      return await api.register(registerData);
    } catch (err) {
      setError(err.response?.data || 'Erreur lors de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const updatedProfile = await api.updateUserProfile(profileData);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err.response?.data || 'Erreur mise à jour profil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: api.isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
