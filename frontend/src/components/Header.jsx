// Header.jsx
import logo from '../assets/oppouCI.webp';
import backImage from '../assets/back.webp';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Gestion de l'effet de défilement pour l'en-tête
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fermeture du menu mobile lors du changement de routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    // Fermeture du menu après déconnexion
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-orange-400 shadow-md py-2' : 'bg-transparent py-4'
      }`}
      style={!scrolled && location.pathname === '/' ? {
        backgroundImage: `linear-gradient(rgba(0, 48, 135, 0.8), rgba(0, 48, 135, 0.6))`,
        backgroundSize: 'cover',
      } : {}}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-white p-1 rounded-full shadow-md">
              <img 
                src={logo} 
                alt="Logo OpportuCI" 
                className="h-10 w-10 rounded-full"
              />
            </div>
            <span className={`font-bold text-xl ml-3 ${scrolled || location.pathname !== '/' ? 'text-blue-800' : 'text-white'}`}>
              OpportuCI
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/opportunities" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                scrolled || location.pathname !== '/' 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Opportunités
            </Link>
            <Link 
              to="/organizations" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                scrolled || location.pathname !== '/' 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Organisations
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                scrolled || location.pathname !== '/' 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              À propos
            </Link>
            <Link 
              to="/contact" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                scrolled || location.pathname !== '/' 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Contact
            </Link>

            {/* Boutons d'authentification */}
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className={`flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      scrolled || location.pathname !== '/' 
                        ? 'focus:ring-blue-800' 
                        : 'focus:ring-white'
                    }`}
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={toggleMenu}
                  >
                    <span className="sr-only">Ouvrir menu utilisateur</span>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      scrolled || location.pathname !== '/' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-white/20 text-white'
                    }`}>
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                </div>

                {/* Menu déroulant */}
                {isMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center ml-3 space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    scrolled || location.pathname !== '/' 
                      ? 'text-blue-700 hover:text-blue-800' 
                      : 'text-white hover:text-blue-50'
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    scrolled || location.pathname !== '/' 
                      ? 'bg-blue-700 text-white hover:bg-blue-800' 
                      : 'bg-white text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  Inscription
                </Link>
              </div>
            )}
          </nav>

          {/* Bouton menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled || location.pathname !== '/' 
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white hover:text-white hover:bg-white/10'
              }`}
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/opportunities"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Opportunités
            </Link>
            <Link
              to="/organizations"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Organisations
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="px-2 space-y-1">
                <div className="px-3 py-2 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.full_name || user?.username || 'Utilisateur'}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.email || ''}
                    </div>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Tableau de bord
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;