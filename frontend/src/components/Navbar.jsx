import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/oppouCI.webp';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Couleurs du drapeau ivoirien
  const orangeCI = "#FF8200"; // Orange du drapeau ivoirien
  const greenCI = "#009A44"; // Vert du drapeau ivoirien (pour certaines accentuations)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Ferme les menus lorsque la route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileDropdownOpen(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Bourses', path: '/opportunities/category/bourses' },
    { name: 'Concours', path: '/opportunities/category/concours' },
    { name: 'Formations', path: '/opportunities/category/formations' },
    { name: 'Roadmaps', path: '/roadmaps' },
    { name: 'Actualités', path: '/actualites' },
  ];

  return (
    <nav 
      className={`${scrolled ? 'shadow-md' : ''} fixed w-full z-50 transition-all duration-300`}
      style={{ backgroundColor: orangeCI }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <img 
                  src={logo} 
                  alt="OpportuCI Logo" 
                  className="h-10 w-10 mr-3 rounded-full"
                />
              </Link>
              <span className="ml-2 text-lg font-bold text-white">OpportuCI</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'border-white text-white font-medium'
                      : 'border-transparent text-white hover:border-white/70 hover:text-white/90'
                  } inline-flex items-center px-2 pt-1 border-b-2 text-sm font-medium h-16`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Bouton Recherche */}
            <Link
              to="/search"
              className="p-1 rounded-full text-white hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
            >
              <span className="sr-only">Rechercher</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Authentifié vs Non authentifié */}
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <span className="sr-only">Menu utilisateur</span>
                    {user?.profile?.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.profile.avatar}
                        alt={user.username}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-orange-600 font-medium">
                        {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>
                </div>
                {profileDropdownOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      Connecté en tant que <span className="font-medium">{user?.username || user?.email}</span>
                    </div>
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
                      Mon profil
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Paramètres
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-white/90 text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-1.5 border border-white text-sm font-medium rounded-md shadow-sm text-orange-500 bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
          
          {/* Hamburger menu pour mobile */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white/80 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
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
              {/* Icon when menu is open */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
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
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden bg-orange-500`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`${
                location.pathname === item.path
                  ? 'bg-orange-600 border-white text-white'
                  : 'border-transparent text-white hover:bg-orange-600 hover:border-white/70 hover:text-white/90'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-orange-600">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {user?.profile?.avatar ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.profile.avatar}
                      alt={user.username}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-orange-600 font-medium">
                      {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.username || user?.email}
                  </div>
                  <div className="text-sm font-medium text-white/80">
                    {user?.email}
                  </div>
                </div>
                <Link
                  to="/search"
                  className="ml-auto flex-shrink-0 p-1 rounded-full text-white hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span className="sr-only">Rechercher</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Link>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-base font-medium text-white hover:text-white/90 hover:bg-orange-600"
                >
                  Tableau de bord
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-white hover:text-white/90 hover:bg-orange-600"
                >
                  Mon profil
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-base font-medium text-white hover:text-white/90 hover:bg-orange-600"
                >
                  Paramètres
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-white hover:text-white/90 hover:bg-orange-600"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-1 px-2">
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-white hover:text-white/90 hover:bg-orange-600"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="block mx-4 my-2 px-4 py-2 text-base font-medium text-orange-500 bg-white hover:bg-white/90 rounded-md"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;