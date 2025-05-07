/**
 * Composant d'indicateur de chargement pour OpportuCI
 * Affiche une animation de chargement personnalisable
 */

import PropTypes from 'prop-types';

/**
 * Composant d'animation de chargement
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.size - Taille du spinner (xs, sm, md, lg)
 * @param {string} props.color - Couleur du spinner (primary, white, gray)
 * @param {string} props.className - Classes CSS additionnelles
 * @returns {JSX.Element} Composant de chargement
 */
export const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Configuration des tailles
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  // Configuration des couleurs
  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  // Classes combinées
  const spinnerClasses = `
    animate-spin 
    ${sizeClasses[size] || sizeClasses.md} 
    ${colorClasses[color] || colorClasses.primary}
    ${className}
  `;

  return (
    <svg className={spinnerClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'white', 'gray']),
  className: PropTypes.string
};

export default LoadingSpinner;