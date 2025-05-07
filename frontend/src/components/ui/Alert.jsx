/**
 * Composant d'alerte pour OpportuCI
 * Affiche des messages d'information, d'erreur, de succès ou d'avertissement
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant d'alerte
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.type - Type d'alerte (info, success, warning, error)
 * @param {string} props.message - Message à afficher
 * @param {boolean} props.dismissible - Indique si l'alerte peut être fermée
 * @param {Function} props.onClose - Fonction appelée lors de la fermeture de l'alerte
 * @param {number} props.autoClose - Temps en ms avant fermeture automatique (0 pour désactiver)
 * @returns {JSX.Element|null} Composant d'alerte ou null si fermé
 */
export const Alert = ({
  type = 'info',
  message = '',
  dismissible = true,
  onClose = () => {},
  autoClose = 0
}) => {
  const [visible, setVisible] = useState(true);

  // Configuration selon le type d'alerte
  const alertStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      icon: (
        <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-800',
      icon: (
        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-800',
      icon: (
        <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-800',
      icon: (
        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  };

  // Style de l'alerte en fonction du type
  const styles = alertStyles[type] || alertStyles.info;

  // Fermeture de l'alerte
  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  // Fermeture automatique après un délai
  useEffect(() => {
    if (autoClose > 0 && visible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, visible]);

  if (!visible) return null;

  return (
    <div className={`rounded-md p-4 mb-4 border ${styles.bg} ${styles.border}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className={`ml-3 ${styles.text}`}>
          <div className="text-sm font-medium">
            {message}
          </div>
        </div>
        
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 ${styles.bg} ${styles.text} hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-500`}
                onClick={handleClose}
                aria-label="Fermer"
              >
                <span className="sr-only">Fermer</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  message: PropTypes.string.isRequired,
  dismissible: PropTypes.bool,
  onClose: PropTypes.func,
  autoClose: PropTypes.number
};

export default Alert;