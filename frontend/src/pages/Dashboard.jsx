import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import { CategoryAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('created');
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'created') {
      fetchUserOpportunities();
    } else if (activeTab === 'saved') {
      fetchSavedOpportunities();
    }
  }, [activeTab]);

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
      // Remplacez ceci par votre appel API réel
      const data = await getUserOpportunities('saved');
      setSavedOpportunities(data);
    } catch (err) {
      setError('Impossible de charger vos opportunités sauvegardées: ' + (err.message || 'Erreur inconnue'));
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
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Échec de la suppression: ' + (err.message || 'Erreur inconnue'));
      
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Rendu conditionnel pour le chargement
  if (loading && activeTab === 'created' || savedLoading && activeTab === 'saved') {
    return (
      <Layout>
        <div className="p-6 flex justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  // Fonction pour déterminer la couleur de badge selon le type d'opportunité
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="mt-1 text-sm text-gray-500">
              Bienvenue, {user?.first_name || user?.username || 'Utilisateur'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/opportunities/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ajouter une opportunité
            </Link>
          </div>
        </div>

        {/* Notifications */}
        {error && <ErrorAlert message={error} className="mb-4" />}
        
        {successMessage && (
          <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded text-green-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Onglets de navigation */}
        <div className="border-b border-gray-200 mb-5">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('created')}
              className={`${
                activeTab === 'created' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Mes opportunités
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`${
                activeTab === 'saved' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Opportunités sauvegardées
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`${
                activeTab === 'recommendations' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Recommandations
            </button>
          </nav>
        </div>

        {/* Contenu de l'onglet "Mes opportunités" */}
        {activeTab === 'created' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Vos opportunités publiées
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Gérez les opportunités que vous avez créées
              </p>
            </div>

            {opportunities.length === 0 ? (
              <EmptyState
                title="Aucune opportunité trouvée"
                description="Vous n'avez pas encore publié d'opportunités."
                action={{
                  label: "Créer votre première opportunité",
                  href: "/opportunities/create"
                }}
                icon={(
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                )}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date limite
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                            {opportunity.category_name || "Catégorie inconnue"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(opportunity.deadline)}
                          </div>
                          {new Date(opportunity.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 
                           new Date(opportunity.deadline) > new Date() && (
                            <span className="text-xs text-orange-600 font-medium">
                              Bientôt expirée
                            </span>
                          )}
                          {new Date(opportunity.deadline) < new Date() && (
                            <span className="text-xs text-red-600 font-medium">
                              Expirée
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            opportunity.is_verified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {opportunity.is_verified ? 'Vérifiée' : 'En attente de vérification'}
                          </span>
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

        {/* Contenu de l'onglet "Opportunités sauvegardées" */}
        {activeTab === 'saved' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Opportunités sauvegardées
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Les opportunités que vous avez marquées pour référence ultérieure
              </p>
            </div>

            {savedOpportunities.length === 0 ? (
              <EmptyState
                title="Aucune opportunité sauvegardée"
                description="Vous n'avez pas encore sauvegardé d'opportunités. Explorez la plateforme pour trouver des opportunités qui vous intéressent."
                action={{
                  label: "Explorer les opportunités",
                  href: "/opportunities"
                }}
                icon={(
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                )}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {savedOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow">
                    <div className="px-4 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/opportunities/${opportunity.id}`} className="hover:text-blue-600">
                          {opportunity.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500">{opportunity.organization}</p>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex justify-between text-sm">
                        <span className={`px-2 py-1 rounded-full ${getBadgeColor(opportunity.category_name)}`}>
                          {opportunity.category_name}
                        </span>
                        <span className="text-gray-600">
                          Expire le: {formatDate(opportunity.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contenu de l'onglet "Recommandations" */}
        {activeTab === 'recommendations' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recommandations personnalisées
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Des opportunités sélectionnées pour vous en fonction de votre profil et de vos centres d'intérêt
              </p>
            </div>

            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Fonctionnalité à venir</h3>
              <p className="mt-1 text-sm text-gray-500">
                Notre système de recommandation personnalisée est en cours de développement. Complétez votre profil pour obtenir des recommandations plus pertinentes lors du lancement.
              </p>
              <div className="mt-6">
                <Link to="/profile" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  Compléter mon profil
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total des opportunités
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {opportunities.length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Opportunités vérifiées
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {opportunities.filter(opp => opp.is_verified).length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Échéances à venir
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {opportunities.filter(opp => new Date(opp.deadline) > new Date()).length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Opportunités sauvegardées
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {savedOpportunities.length}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;