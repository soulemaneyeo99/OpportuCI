// src/pages/Dashboard.jsx - Version complète avec Chat IA intégré
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import { SimpleAIRecommendations, SimpleCareerAdvice } from '../components/ai';
import { CategoryAPI, getUserOpportunities, deleteOpportunity } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';
import { MessageCircleIcon, BrainIcon, TrendingUpIcon, StarIcon } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    upcoming: 0,
    saved: 0
  });

  useEffect(() => {
    if (activeTab === 'created') {
      fetchUserOpportunities();
    } else if (activeTab === 'saved') {
      fetchSavedOpportunities();
    } else if (activeTab === 'overview') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getUserOpportunities();
      setOpportunities(data.slice(0, 5)); // Dernières 5 pour l'aperçu
      
      // Calculer les stats
      setStats({
        total: data.length,
        verified: data.filter(opp => opp.is_verified).length,
        upcoming: data.filter(opp => new Date(opp.deadline) > new Date()).length,
        saved: savedOpportunities.length
      });
    } catch (err) {
      setError('Impossible de charger les données du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOpportunities = async () => {
    try {
      setLoading(true);
      const data = await getUserOpportunities();
      setOpportunities(data);
    } catch (err) {
      setError('Impossible de charger vos opportunités: ' + (err.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedOpportunities = async () => {
    try {
      setSavedLoading(true);
      const data = await getUserOpportunities('saved');
      setSavedOpportunities(data);
    } catch (err) {
      setError('Impossible de charger vos opportunités sauvegardées');
    } finally {
      setSavedLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette opportunité?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await deleteOpportunity(id);
      setOpportunities(opportunities.filter(opp => opp.id !== id));
      setSuccessMessage('Opportunité supprimée avec succès');
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Échec de la suppression: ' + (err.message || 'Erreur inconnue'));
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getBadgeColor = (category) => {
    const categories = {
      'bourse': 'bg-indigo-100 text-indigo-800',
      'concours': 'bg-orange-100 text-orange-800',
      'formation': 'bg-green-100 text-green-800',
      'stage': 'bg-blue-100 text-blue-800',
      'emploi': 'bg-purple-100 text-purple-800',
      'événement': 'bg-pink-100 text-pink-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    
    const lowerCategory = (category || '').toLowerCase();
    for (const key in categories) {
      if (lowerCategory.includes(key)) {
        return categories[key];
      }
    }
    return categories.default;
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUpIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total opportunités
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <StarIcon className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Vérifiées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.verified}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    À venir
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.upcoming}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sauvegardées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.saved}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section avec IA et Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommandations IA */}
        <div className="lg:col-span-2">
          <SimpleAIRecommendations userId={user?.id} />
        </div>

        {/* Chat IA intégré */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MessageCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                Assistant IA
              </h3>
              <button
                onClick={() => setShowChat(!showChat)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showChat ? 'Réduire' : 'Agrandir'}
              </button>
            </div>
            
            {showChat ? (
              <div className="h-96">
                <GeminiChat contextType="career_advice" />
              </div>
            ) : (
              <div className="p-6 text-center">
                <MessageCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Discutez avec votre assistant IA pour des conseils personnalisés
                </p>
                <button
                  onClick={() => setShowChat(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Commencer une conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conseils de carrière */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleCareerAdvice />
        
        {/* Aperçu des dernières opportunités */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Dernières opportunités</h3>
          </div>
          <div className="p-4">
            {opportunities.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">Aucune opportunité pour le moment</p>
                <Link
                  to="/opportunities/create"
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  Créer votre première opportunité
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {opportunities.slice(0, 3).map((opportunity) => (
                  <div key={opportunity.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          <Link to={`/opportunities/${opportunity.id}`} className="hover:text-blue-600">
                            {opportunity.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">{opportunity.organization}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(opportunity.category_name)}`}>
                        {opportunity.category_name}
                      </span>
                    </div>
                  </div>
                ))}
                
                {opportunities.length > 3 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setActiveTab('created')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Voir toutes ({opportunities.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && activeTab !== 'overview') {
    return (
      <Layout>
        <div className="p-6 flex justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="mt-1 text-sm text-gray-500">
              Bienvenue, {user?.first_name || user?.username || 'Utilisateur'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/opportunities/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nouvelle opportunité
            </Link>
          </div>
        </div>

        {/* Messages d'état */}
        {error && <ErrorAlert message={error} className="mb-4" />}
        {successMessage && (
          <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded text-green-800">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { key: 'overview', label: 'Vue d\'ensemble', icon: TrendingUpIcon },
              { key: 'created', label: 'Mes opportunités', icon: null },
              { key: 'saved', label: 'Sauvegardées', icon: null },
              { key: 'ai-recommendations', label: 'Recommandations IA', icon: BrainIcon },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                {tab.icon && <tab.icon className="w-4 h-4 mr-2" />}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && renderOverviewTab()}

        {activeTab === 'created' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Vos opportunités publiées
              </h3>
            </div>

            {opportunities.length === 0 ? (
              <EmptyState
                title="Aucune opportunité trouvée"
                description="Vous n'avez pas encore publié d'opportunités."
                action={{
                  label: "Créer votre première opportunité",
                  href: "/opportunities/create"
                }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date limite
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {opportunities.map((opportunity) => (
                      <tr key={opportunity.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/opportunities/${opportunity.id}`} className="hover:text-blue-600">
                              {opportunity.title}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">
                            {opportunity.organization}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getBadgeColor(opportunity.category_name)
                          }`}>
                            {opportunity.category_name || "Non catégorisé"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(opportunity.deadline)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link 
                              to={`/opportunities/${opportunity.id}/edit`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Modifier
                            </Link>
                            <button
                              onClick={() => handleDelete(opportunity.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={deleteLoading === opportunity.id}
                            >
                              {deleteLoading === opportunity.id ? 'Suppression...' : 'Supprimer'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai-recommendations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleAIRecommendations userId={user?.id} />
            <SimpleCareerAdvice />
          </div>
        )}

        {/* Bouton de chat flottant global */}
        <FloatingChatButton contextType="general" />
      </div>
    </Layout>
  );
};

export default Dashboard;