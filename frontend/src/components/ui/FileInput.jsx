/**
 * Composant d'input pour fichiers
 *
 * Gère l'upload de fichiers avec affichage du nom du fichier sélectionné,
 * support de validation, accessibilité et messages d'erreur.
 */

import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const FileInput = ({
  label,
  name,
  accept,
  onChange,
  error,
  helpText,
  required,
  className,
  ...props
}) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  // Gestion du changement de fichier
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('');
    }

    if (onChange) {
      onChange(e);
    }
  };

  // Déclenchement de la boîte de dialogue de sélection de fichier
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`form-control ${className || ''}`}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex items-center">
        {/* Input fichier caché */}
        <input
          ref={fileInputRef}
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          aria-invalid={!!error}
          aria-describedby={`${name}-error ${name}-help`}
          {...props}
        />

        {/* Bouton personnalisé */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-md border border-gray-300 text-sm font-medium text-gray-700 transition-colors duration-200"
        >
          Parcourir...
        </button>

        {/* Nom du fichier affiché */}
        <div className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white text-sm text-gray-600 truncate">
          {fileName || "Aucun fichier sélectionné"}
        </div>
      </div>

      {/* Texte d'aide */}
      {helpText && (
        <p id={`${name}-help`} className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {/* Message d'erreur */}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Définition des types de props
FileInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  helpText: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

// Valeurs par défaut
FileInput.defaultProps = {
  label: '',
  accept: '',
  onChange: null,
  error: '',
  helpText: '',
  required: false,
  className: '',
};

export default FileInput;
