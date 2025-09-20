import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight,
  Pencil,
  Bookmark,
  LogOut,
  Briefcase,
  GraduationCap,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2 as CheckCircleIcon,
  XCircle as XCircleIcon
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Layout from '../components/Layout';
import API from '../services/api';
import { BarChart2 as ChartIcon } from 'lucide-react';

const ProfileSection = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="bg-white p-4 shadow rounded">{children}</div>
  </div>
);


const Profil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
  savedOpportunities: 0,
  approvedApplications: 0,
  pendingApplications: 0,
  totalApplications: 0,
});
const [activeTab, setActiveTab] = useState("informations");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // First verify and refresh token if needed
        const token = localStorage.getItem('access');
          if (!token) {
            console.warn('Utilisateur non authentifié. Redirection vers la page de connexion.');
            navigate('/login'); // Redirection propre
          }

        // Verify token validity
        const verifyResult = await API.AuthAPI.verifyToken(token);
        if (!verifyResult.success) {
          const refreshResult = await API.AuthAPI.refreshToken();
          if (!refreshResult.success) {
            throw new Error('Session expired');
          }
        }

        // Now fetch user data
        const userResponse = await API.getCurrentUser(); 

        setUser(userResponse);
        
      } catch (err) {
        console.error('Error fetching user:', err);
        
        if (err.message === 'Session expired' || 
            (err.response && err.response.status === 401)) {
          // Clear tokens and redirect to login
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          navigate('/login', { 
            state: { 
              from: location.pathname, 
              message: "Your session has expired. Please login again." 
            } 
          });
        } else {
          setError(err.message || "Failed to load user data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location.pathname]);
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/profil', { state: { message: "Déconnexion réussie" } });
  };

  // Fonction pour ajouter un bookmark avec instance axios configurée
  const bookmarkOpportunity = async (opportunityId) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const axiosInstance = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      await axiosInstance.post(`/api/user/bookmarks/${opportunityId}/`);
      // Mettre à jour les recommandations pour refléter le changement
      setRecommendations(prevRecs => 
        prevRecs.map(rec => rec.id === opportunityId ? {...rec, is_bookmarked: true} : rec)
      );
    } catch (err) {
      console.error('Erreur ajout bookmark', err);
    }
  };

  const removeBookmark = async (opportunityId) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const axiosInstance = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      await axiosInstance.delete(`/api/user/bookmarks/${opportunityId}/`);
      setSavedOpportunities(prevBookmarks => 
        prevBookmarks.filter(bookmark => bookmark.id !== opportunityId)
      );
      setStats(prevStats => ({
        ...prevStats,
        savedOpportunities: prevStats.savedOpportunities - 1
      }));
    } catch (err) {
      console.error('Erreur suppression bookmark', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="text-red-500 text-center mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
          >
            Réessayer
          </button>
        </div>
      </Layout>
    );
  }

  // Formater la date d'inscription
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">
            Gérez vos informations personnelles et suivez vos opportunités
          </p>
        </header>

        {/* Section supérieure avec profil et stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Informations utilisateur */}
          <div className="lg:col-span-2">
            <ProfileSection 
              title="Informations Personnelles" 
              icon={<User className="w-5 h-5" />}
            >
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                      {(user?.full_name || user?.username || 'U').charAt(0)}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {user?.full_name || user?.username || 'Nom non défini'}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{user?.email || 'Email non défini'}</span>
                      </div>
                      {user?.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user?.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Inscrit depuis {formatDate(user?.date_joined)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/modifier-profil')}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={() => navigate('/profil/parametres')}
                    className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                  >
                    Paramètres
                  </button>
                </div>
              </div>

              {user?.bio && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    À PROPOS
                  </h4>
                  <p className="text-gray-600">
                    {user.bio}
                  </p>
                </div>
              )}
            </ProfileSection>
          </div>

          {/* Statistiques */}
          <div className="lg:col-span-1">
            <ProfileSection 
              title="Statistiques" 
              icon={<ChartIcon className="w-5 h-5" />}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center">
                    <Bookmark className="w-5 h-5 text-blue-500 mr-2" />
                    <span>Opportunités sauvegardées</span>
                  </div>
                  <span className="font-semibold">{stats.savedOpportunities}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span>Candidatures approuvées</span>
                  </div>
                  <span className="font-semibold">{stats.approvedApplications}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                    <span>Candidatures en attente</span>
                  </div>
                  <span className="font-semibold">{stats.pendingApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-purple-500 mr-2" />
                    <span>Total candidatures</span>
                  </div>
                  <span className="font-semibold">{stats.totalApplications}</span>
                </div>
              </div>
            </ProfileSection>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'bookmarks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Opportunités Sauvegardées
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Mes Candidatures
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'recommendations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Recommandations
            </button>
          </nav>
        </div>

        {/* Contenu des Tabs */}
        <div>
          {/* Tab: Opportunités Sauvegardées */}
          {activeTab === 'bookmarks' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Opportunités Sauvegardées</h2>
              {savedOpportunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedOpportunities.map((opp) => (
                    <div key={opp.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-5">
                        <div className="mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {opp.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {opp.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {opp.organization}
                        </p>
                        <button
                          onClick={() => removeBookmark(opp.id)}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Clock className="w-4 h-4 mr-1" />
                          Date limite: {formatDate(opp.deadline)}
                        </div>
                        <div className="flex space-x-3">
                          <Link
                            to={`/opportunities/${opp.id}`}
                            className="text-sm text-blue-600 hover:text-blue-800 transition flex items-center"
                          >
                            Voir détails
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                          <Link
                            to={`/opportunities/${opp.id}/apply`}
                            className="text-sm text-green-600 hover:text-green-800 transition flex items-center"
                          >
                            Postuler
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="mb-4">
                    <Bookmark className="w-12 h-12 text-gray-300 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Vous n'avez encore enregistré aucune opportunité.
                  </h3>
                  <Link
                    to="/opportunities"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Explorer les opportunités
                    <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Tab: Mes Candidatures */}
          {activeTab === 'applications' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Mes Candidatures</h2>
              {applications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Opportunité
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organisation
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((app) => (
                        <tr key={app.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {app.opportunity.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {app.opportunity.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {app.opportunity.organization}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(app.submission_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <ApplicationStatusBadge status={app.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link
                              to={`/application/${app.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Détails
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="mb-4">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Vous n'avez pas encore postulé à des opportunités.
                  </h3>
                  <Link
                    to="/opportunities"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Explorer les opportunités
                    <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Tab: Recommandations */}
          {activeTab === 'recommendations' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Recommandations Personnalisées</h2>
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-5">
                        <div className="mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            Recommandé
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {rec.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {rec.organization}
                        </p>
                        <button
                          onClick={() => bookmarkOpportunity(rec.id)}
                          className="text-gray-400 hover:text-blue-500 transition"
                        >
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="px-5 py-3">
                        <p className="text-sm text-gray-600 mb-3">
                          {rec.short_description}
                        </p>
                      </div>
                      <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Clock className="w-4 h-4 mr-1" />
                          Date limite: {formatDate(rec.deadline)}
                        </div>
                        <div className="flex justify-between">
                          <Link
                            to={`/opportunities/${rec.id}`}
                            className="text-sm text-blue-600 hover:text-blue-800 transition flex items-center"
                          >
                            Voir détails
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                          <span className="text-sm font-medium text-purple-600">
                            Correspondance {rec.match_percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="mb-4">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Complétez votre profil pour recevoir des recommandations personnalisées.
                  </h3>
                  <button
                    onClick={() => navigate('/modifier-profil')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition inline-flex items-center"
                  >
                    Compléter mon profil
                    <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profil;