// frontend/src/components/auth/PasswordStrengthMeter.jsx

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getPasswordStrength } from "../../utils/validationUtils";

/**
 * Composant affichant un indicateur visuel de la force d'un mot de passe
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.password - Le mot de passe à évaluer
 * @param {Function} props.setPasswordStrength - Fonction pour mettre à jour la force du mot de passe dans le parent
 */
const PasswordStrengthMeter = ({ password, setPasswordStrength }) => {
  const [strength, setStrength] = useState(0);
  const [strengthText, setStrengthText] = useState("");
  const [barColor, setBarColor] = useState("");

  useEffect(() => {
    // Calculer la force du mot de passe (score de 0 à 4)
    const score = getPasswordStrength(password);
    
    // Mettre à jour l'état local
    setStrength(score);
    
    // Mettre à jour l'état dans le composant parent
    if (setPasswordStrength) {
      setPasswordStrength(score);
    }
    
    // Définir le texte et la couleur en fonction du score
    switch (score) {
      case 0:
        setStrengthText("Trop court");
        setBarColor("bg-gray-300");
        break;
      case 1:
        setStrengthText("Très faible");
        setBarColor("bg-red-500");
        break;
      case 2:
        setStrengthText("Faible");
        setBarColor("bg-orange-500");
        break;
      case 3:
        setStrengthText("Moyen");
        setBarColor("bg-yellow-500");
        break;
      case 4:
        setStrengthText("Fort");
        setBarColor("bg-green-500");
        break;
      default:
        setStrengthText("");
        setBarColor("bg-gray-300");
    }
  }, [password, setPasswordStrength]);

  // Si pas de mot de passe, ne rien afficher
  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 mb-1">
      <div className="flex justify-between mb-1">
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`h-2 w-6 rounded-sm ${
                index <= strength ? barColor : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>
        <span className="text-xs text-gray-600">{strengthText}</span>
      </div>
      
      {/* Conseils pour un mot de passe fort */}
      {strength < 3 && (
        <p className="text-xs text-gray-500">
          Un mot de passe fort contient au moins 8 caractères, avec des lettres majuscules, 
          minuscules, des chiffres et des caractères spéciaux.
        </p>
      )}
    </div>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string,
  setPasswordStrength: PropTypes.func
};

export default PasswordStrengthMeter;