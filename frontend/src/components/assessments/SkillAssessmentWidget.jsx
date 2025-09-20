// src/components/assessments/SkillAssessmentWidget.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainIcon, ClockIcon, TrendingUpIcon, AwardIcon } from 'lucide-react';

const SkillAssessmentWidget = ({ assessments, onStartAssessment }) => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const getCategoryIcon = (category) => {
    const icons = {
      technical: '💻',
      soft: '🤝',
      language: '🗣️',
      digital: '📱'
    };
    return icons[category] || '📋';
  };

  const getCategoryColor = (category) => {
    const colors = {
      technical: 'from-blue-500 to-cyan-500',
      soft: 'from-green-500 to-teal-500',
      language: 'from-purple-500 to-pink-500',
      digital: 'from-orange-500 to-red-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <BrainIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Évaluations de Compétences
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map((assessment) => (
          <motion.div
            key={assessment.id}
            whileHover={{ scale: 1.02 }}
            className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedAssessment(assessment)}
          >
            <div className={`h-24 bg-gradient-to-r ${getCategoryColor(assessment.category)} p-4 text-white relative`}>
              <div className="absolute top-2 right-2 text-2xl opacity-70">
                {getCategoryIcon(assessment.category)}
              </div>
              <h4 className="font-semibold text-lg">{assessment.name}</h4>
              <p className="text-sm opacity-90 capitalize">{assessment.category}</p>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{assessment.duration_minutes} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AwardIcon className="w-4 h-4" />
                  <span>{assessment.max_score} pts max</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {assessment.description}
              </p>

              {assessment.user_best_score ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUpIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">
                      Meilleur score: {assessment.user_best_score}%
                    </span>
                  </div>
                  <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200">
                    Reprendre
                  </button>
                </div>
              ) : (
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Commencer l'évaluation
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal de détails */}
      {selectedAssessment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAssessment(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">{selectedAssessment.name}</h3>
            <p className="text-gray-600 mb-4">{selectedAssessment.description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Durée:</span>
                <span className="font-medium">{selectedAssessment.duration_minutes} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Questions:</span>
                <span className="font-medium">{selectedAssessment.question_count} questions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Difficulté:</span>
                <span className="font-medium capitalize">{selectedAssessment.difficulty || 'Adaptative'}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedAssessment(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onStartAssessment(selectedAssessment.id);
                  setSelectedAssessment(null);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Commencer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
export {
  SkillAssessmentWidget,
};