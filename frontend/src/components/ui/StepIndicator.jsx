/**
 * Composant d'indicateur d'étapes
 * 
 * Affiche la progression dans un processus en plusieurs étapes,
 * avec une barre de progression et des indicateurs visuels pour chaque étape.
 */
import PropTypes from 'prop-types';

const StepIndicator = ({ currentStep, steps }) => {
  // Calcul du pourcentage de progression
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  
  return (
    <div className="mb-8">
      {/* Indicateurs d'étapes */}
      <div className="flex items-center justify-between mb-2">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className="flex items-center"
          >
            <div 
              className={`rounded-full h-10 w-10 flex items-center justify-center text-white font-medium ${
                currentStep === step.number 
                  ? "bg-blue-600" 
                  : currentStep > step.number 
                    ? "bg-green-500" 
                    : "bg-gray-300"
              }`}
              aria-label={`Étape ${step.number} ${
                currentStep === step.number ? '(étape actuelle)' : 
                currentStep > step.number ? '(étape complétée)' : 
                '(étape à venir)'
              }`}
            >
              {currentStep > step.number ? "✓" : step.number}
            </div>
            <span 
              className="ml-2 text-sm font-medium hidden sm:block"
              aria-hidden="true"
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Barre de progression */}
      <div 
        className="w-full bg-gray-200 rounded-full h-1" 
        role="progressbar" 
        aria-valuenow={progressPercentage} 
        aria-valuemin="0" 
        aria-valuemax="100"
      >
        <div 
          className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

StepIndicator.propTypes = {
  // Étape actuelle (commençant à 1)
  currentStep: PropTypes.number.isRequired,
  
  // Liste des étapes avec leur numéro et libellé
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired
};

export default StepIndicator;