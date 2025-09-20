// src/components/ai/SimpleCareerAdvice.jsx - CORRECTION
import { useState } from 'react';
import { MessageCircleIcon, SendIcon } from 'lucide-react'; // Supprimé LoadingIcon qui n'existe pas

const SimpleCareerAdvice = () => {
  const [advice, setAdvice] = useState(null);
  const [careerGoals, setCareerGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCareerAdvice = async () => {
    if (!careerGoals.trim()) {
      setError('Veuillez décrire vos objectifs de carrière');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ai/career-advice/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ career_goals: careerGoals }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la génération des conseils');
      }
      
      const data = await response.json();
      setAdvice(data.career_advice);
    } catch (err) {
      setError('Impossible de générer les conseils');
      console.error('Erreur career advice:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <MessageCircleIcon className="w-5 h-5 mr-2 text-green-600" />
        Conseiller IA de Carrière
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Décrivez vos objectifs professionnels:
        </label>
        <textarea
          value={careerGoals}
          onChange={(e) => setCareerGoals(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          rows="3"
          placeholder="Ex: Je veux devenir développeur web, travailler dans une startup tech à Abidjan..."
        />
      </div>

      <button
        onClick={getCareerAdvice}
        disabled={loading || !careerGoals.trim()}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium"
      >
        {loading ? (
          <>
            {/* Spinner inline au lieu d'icône LoadingIcon */}
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Génération en cours...
          </>
        ) : (
          <>
            <SendIcon className="w-4 h-4 mr-2" />
            Obtenir des conseils IA
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {advice && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">✅ Vos Forces</h4>
            <ul className="text-sm text-green-700 list-disc list-inside">
              {advice.strengths?.map((strength, i) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-800 mb-2">🎯 À Améliorer</h4>
            <ul className="text-sm text-orange-700 list-disc list-inside">
              {advice.areas_to_improve?.map((area, i) => (
                <li key={i}>{area}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">🚀 Prochaines Étapes</h4>
            <ol className="text-sm text-blue-700 list-decimal list-inside">
              {advice.next_steps?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">📚 Compétences Recommandées</h4>
            <div className="flex flex-wrap gap-2">
              {advice.recommended_skills?.map((skill, i) => (
                <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {advice.salary_estimation && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">💰 Estimation Salariale</h4>
              <p className="text-sm text-gray-700">{advice.salary_estimation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleCareerAdvice;