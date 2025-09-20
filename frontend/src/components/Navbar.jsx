import { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  ChevronDown, 
  Menu, 
  X, 
  MessageCircle,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Globe
} from 'lucide-react';

// Mock data pour la démo
const mockUser = {
  username: "Jean Kouassi",
  email: "jean@oppouci.com",
  profile: { avatar: null },
  hasNotifications: true
};

const Navbar = () => {
  // États pour les menus déroulants et mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [opportunitiesDropdownOpen, setOpportunitiesDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock auth state - remplacez par votre contexte d'auth
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user] = useState(mockUser);
  
  const [currentPath, setCurrentPath] = useState('/');

  // Couleurs du thème OpportuCI
  const orangeCI = "#FF8200";
  const greenCI = "#009A44";

  // Gestion du scroll pour l'effet de transparence
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme tous les menus lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setOpportunitiesDropdownOpen(false);
    setLangDropdownOpen(false);
  }, [currentPath]);

  // Navigation principale
  const mainNavItems = [
    { name: 'Accueil', path: '/', exact: true },
    { 
      name: 'Opportunités', 
      path: '/opportunities',
      hasDropdown: true,
      subItems: [
        { name: 'Toutes les opportunités', path: '/opportunities' },
        { name: 'Bourses d\'études', path: '/opportunities/bourses' },
        { name: 'Concours & Examens', path: '/opportunities/concours' },
        { name: 'Formations', path: '/opportunities/formations' },
        { name: 'Stages & Emplois', path: '/opportunities/emplois' },
        { name: 'Volontariat', path: '/opportunities/volontariat' }
      ]
    },
    { name: 'Roadmaps Carrière', path: '/roadmaps' },
    { name: 'Actualités', path: '/actualites' },
    { name: 'À propos', path: '/about' }
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProfileDropdownOpen(false);
  };

  const isActivePath = (path, exact = false) => {
    if (exact) return currentPath === path;
    return currentPath.startsWith(path);
  };

  const handleNavigation = (path) => {
    setCurrentPath(path);
    // Dans votre vraie app, utilisez votre système de routing ici
    console.log('Navigation vers:', path);
  };

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'shadow-lg backdrop-blur-md bg-white/95' 
            : 'bg-white shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo et nom */}
            <div className="flex items-center flex-shrink-0">
              <button onClick={() => handleNavigation('/')} className="flex items-center group">
                <div 
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
                >
                  <span className="text-white font-bold text-lg">O</span>
                </div>
                <div className="ml-3 hidden sm:block">
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    OpportuCI
                  </span>
                  <div className="text-xs text-gray-500 -mt-1">
                    Ton avenir commence ici
                  </div>
                </div>
              </button>
            </div>

            {/* Navigation desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div className="relative">
                      <button
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActivePath(item.path)
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setOpportunitiesDropdownOpen(!opportunitiesDropdownOpen)}
                      >
                        {item.name}
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                          opportunitiesDropdownOpen ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {opportunitiesDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem.name}
                              onClick={() => handleNavigation(subItem.path)}
                              className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            >
                              {subItem.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActivePath(item.path, item.exact)
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Barre de recherche - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des opportunités..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Actions à droite */}
            <div className="flex items-center space-x-4">
              
              {/* Coach IA */}
              <button
                onClick={() => handleNavigation('/coach-ia')}
                className="hidden sm:flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Coach IA
              </button>

              {isAuthenticated ? (
                <>
                  {/* Soumettre opportunité */}
                  <button
                    onClick={() => handleNavigation('/submit-opportunity')}
                    className="hidden sm:flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-all shadow-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Publier
                  </button>

                  <button className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
                    <Bell className="h-5 w-5" />
                    {user.hasNotifications && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </button>

                  {/* Menu profil */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      {user?.profile?.avatar ? (
                        <img
                          src={user.profile.avatar}
                          alt={user.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-medium">
                          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                        profileDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        
                        <Link to="/dashboard" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                          <LayoutDashboard className="h-4 w-4 mr-3" />
                          Tableau de bord
                        </Link>
                        <Link to="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                          <User className="h-4 w-4 mr-3" />
                          Mon profil
                        </Link>
                        <Link to="/settings" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                          <Settings className="h-4 w-4 mr-3" />
                          Paramètres
                        </Link>
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Utilisateur non connecté */
                <div className="hidden sm:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
                  >
                    Rejoindre
                  </Link>
                </div>
              )}

              {/* Sélecteur de langue */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center p-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </button>
                
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    <button className="block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">🇫🇷 FR</button>
                    <button className="block w-full px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 text-left">🇬🇧 EN</button>
                  </div>
                )}
              </div>

              {/* Menu mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            {/* Recherche mobile */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Navigation mobile */}
            <div className="py-2">
              {mainNavItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setOpportunitiesDropdownOpen(!opportunitiesDropdownOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
                      >
                        {item.name}
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          opportunitiesDropdownOpen ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {opportunitiesDropdownOpen && (
                        <div className="bg-gray-50">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="block px-8 py-2 text-sm text-gray-600 hover:text-orange-600"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block px-4 py-3 text-gray-700 hover:bg-gray-50 ${
                        isActivePath(item.path, item.exact) ? 'text-orange-600 bg-orange-50' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Actions mobiles */}
            <div className="border-t border-gray-100 py-3">
              <Link
                to="/coach-ia"
                className="flex items-center px-4 py-3 text-green-600 hover:bg-green-50"
              >
                <MessageCircle className="h-5 w-5 mr-3" />
                Coach IA
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/submit-opportunity"
                    className="flex items-center px-4 py-3 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="h-5 w-5 mr-3" />
                    Publier une opportunité
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    Tableau de bord
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="px-4 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full py-2 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full py-2 text-center text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700"
                  >
                    Rejoindre OpportuCI
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;