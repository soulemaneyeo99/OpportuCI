// src/components/gamification/CareerPathProgress.jsx
import { motion } from 'framer-motion';
import { TrophyIcon, StarIcon, LockIcon } from 'lucide-react';

const CareerPathProgress = ({ careerPath, userProgress }) => {
  const progressPercentage = (userProgress.current_level / careerPath.total_levels) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div 
        className="h-32 bg-gradient-to-r p-6 text-white relative overflow-hidden"
        style={{ backgroundColor: careerPath.color }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">{careerPath.name}</h3>
          <p className="text-sm opacity-90">{careerPath.description}</p>
        </div>
        <div className="absolute top-4 right-4 text-4xl opacity-20">
          {careerPath.icon}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            Niveau {userProgress.current_level} sur {careerPath.total_levels}
          </span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
          ></motion.div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {Array.from({ length: careerPath.total_levels }, (_, index) => {
            const level = index + 1;
            const isCompleted = level <= userProgress.current_level;
            const isCurrent = level === userProgress.current_level + 1;
            const isLocked = level > userProgress.current_level + 1;

            return (
              <motion.div
                key={level}
                whileHover={{ scale: 1.1 }}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm font-bold
                  ${isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-400'}
                `}
              >
                {isCompleted ? (
                  <StarIcon className="w-4 h-4 fill-current" />
                ) : isLocked ? (
                  <LockIcon className="w-4 h-4" />
                ) : (
                  level
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800">Prochaines étapes:</h4>
          <div className="space-y-2">
            {careerPath.next_steps?.slice(0, 3).map((step, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Continuer le parcours
        </motion.button>
      </div>
    </motion.div>
  );
};
export {
  CareerPathProgress,
};