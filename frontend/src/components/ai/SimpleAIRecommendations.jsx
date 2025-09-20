// src/components/ai/SimpleAIRecommendations.jsx - CORRIGÉ
import { useState, useEffect } from 'react';
import { BrainIcon, StarIcon, RotateCcwIcon } from 'lucide-react'; // RefreshIcon -> RotateCcwIcon

const SimpleAIRecommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai/recommendations/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <BrainIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Recommandations IA
          </h3>
        </div>
        <button
          onClick={refreshRecommendations}
          disabled={refreshing}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            refreshing 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {refreshing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Actualisation...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <RotateCcwIcon className="w-4 h-4" />
              <span>Actualiser</span>
            </div>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {recommendations.map((opportunity, index) => (
          <div
            key={opportunity.id || index}
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            onClick={() => window.location.href = `/opportunities/${opportunity.slug || opportunity.id}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {opportunity.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {opportunity.organization}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className={`px-2 py-1 rounded-full ${
                    opportunity.category === 'Scholarship' ? 'bg-blue-100 text-blue-800' :
                    opportunity.category === 'Job' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {opportunity.category}
                  </span>
                  <span>•</span>
                  <span>{opportunity.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 ml-4">
                <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {Math.round((opportunity.match_score || 0.5) * 100)}%
                </span>
              </div>
            </div>
            
            <div className="mt-3 bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                <strong>Pourquoi cette recommandation:</strong> {opportunity.match_reason || 'Profil compatible'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <BrainIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Pas de recommandations pour le moment. Complétez votre profil pour obtenir des suggestions personnalisées.
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleAIRecommendations;