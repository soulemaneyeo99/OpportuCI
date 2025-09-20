// src/components/mentorship/MentorMatchmaking.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, StarIcon, ClockIcon, MessageCircleIcon, CheckIcon } from 'lucide-react';

const MentorMatchmaking = ({ userId }) => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchRecommendedMentors();
  }, [userId]);

  const fetchRecommendedMentors = async () => {
    try {
      const response = await fetch(`/api/mentorship/recommended/${userId}/`);
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.error('Erreur lors du chargement des mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestMentorship = async (mentorId, requestData) => {
    setRequesting(true);
    try {
      await fetch('/api/mentorship/requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentor_id: mentorId,
          ...requestData
        })
      });
      
      // Mise à jour de l'état du mentor
      setMentors(prev => prev.map(mentor => 
        mentor.id === mentorId 
          ? { ...mentor, request_sent: true }
          : mentor
      ));
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <UserIcon className="w-6 h-6 mr-3 text-blue-600" />
        Mentors Recommandés
      </h3>

      <div className="space-y-4">
        {mentors.map((mentor) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <img
                src={mentor.avatar || '/default-avatar.jpg'}
                alt={mentor.name}
                className="w-16 h-16 rounded-full object-cover bg-gray-200"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {mentor.name}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{mentor.rating}</span>
                    <span className="text-xs text-gray-500">({mentor.reviews_count})</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {mentor.current_position} chez {mentor.company}
                </p>

                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <span>{mentor.experience_years} ans d'expérience</span>
                  <span>•</span>
                  <span>{mentor.mentees_count} mentorés</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>Répond sous {mentor.avg_response_time}h</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {mentor.expertise_areas.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {mentor.expertise_areas.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{mentor.expertise_areas.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {mentor.is_pro_bono ? (
                      <span className="text-green-600 font-medium">Gratuit</span>
                    ) : (
                      <span className="text-gray-600">
                        {mentor.hourly_rate} FCFA/heure
                      </span>
                    )}
                  </div>

                  {mentor.request_sent ? (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Demande envoyée
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedMentor(mentor)}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50 flex items-center"
                      >
                        <MessageCircleIcon className="w-4 h-4 mr-1" />
                        Contacter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {mentor.bio && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal de demande de mentorat */}
      {selectedMentor && (
        <MentorshipRequestModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onRequest={(data) => {
            requestMentorship(selectedMentor.id, data);
            setSelectedMentor(null);
          }}
          requesting={requesting}
        />
      )}
    </div>
  );
};

// Composant Modal pour la demande de mentorat
const MentorshipRequestModal = ({ mentor, onClose, onRequest, requesting }) => {
  const [formData, setFormData] = useState({
    goals: '',
    duration_weeks: 12,
    preferred_frequency: 'weekly'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRequest(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">
          Demande de mentorat avec {mentor.name}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vos objectifs de mentorat
            </label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Décrivez ce que vous espérez accomplir avec ce mentorat..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée souhaitée
              </label>
              <select
                value={formData.duration_weeks}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_weeks: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={4}>1 mois</option>
                <option value={8}>2 mois</option>
                <option value={12}>3 mois</option>
                <option value={24}>6 mois</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fréquence des rencontres
              </label>
              <select
                value={formData.preferred_frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, preferred_frequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="weekly">Hebdomadaire</option>
                <option value="biweekly">Bi-hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={requesting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {requesting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Envoyer la demande'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export {
    MentorMatchmaking
};