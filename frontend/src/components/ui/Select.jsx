// src/components/ui/Select.jsx
/**
 * Composants de sélection pour OpportuCI
 * Ces composants offrent des interfaces de sélection stylisées et accessibles
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant de sélection du type d'utilisateur
 * Permet de choisir entre étudiant, professionnel ou organisation
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.defaultValue - Valeur par défaut (student, professional, organization)
 * @param {Function} props.onChange - Fonction appelée lors du changement de sélection
 * @returns {JSX.Element} Composant de sélection
 */

// In Register.jsx (add this before the Register component)
export const EducationLevelSelect = ({ defaultValue, onChange }) => {
  const educationLevels = [
    { value: 'secondary', label: 'Secondaire' },
    { value: 'baccalaureate', label: 'Baccalauréat' },
    { value: 'bachelor', label: 'Licence' },
    { value: 'master', label: 'Master' },
    { value: 'phd', label: 'Doctorat' },
    { value: 'other', label: 'Autre' }
  ];

  return (
    <select
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Sélectionnez votre niveau</option>
      {educationLevels.map((level) => (
        <option key={level.value} value={level.value}>
          {level.label}
        </option>
      ))}
    </select>
  );
};

export const UserTypeSelect = ({ defaultValue = 'student', onChange }) => {
  const [selectedType, setSelectedType] = useState(defaultValue);

  useEffect(() => {
    setSelectedType(defaultValue);
  }, [defaultValue]);

  const handleChange = (type) => {
    setSelectedType(type);
    if (onChange) {
      onChange(type);
    }
  };

  const userTypes = [
    {
      id: 'student',
      name: 'Étudiant',
      description: 'Pour les étudiants cherchant des opportunités',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
        </svg>
      ),
    },
    {
      id: 'professional',
      name: 'Professionnel',
      description: 'Pour les professionnels recherchant des talents',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'organization',
      name: 'Organisation',
      description: 'Pour les entreprises et organisations',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {userTypes.map((type) => (
        <div 
          key={type.id}
          className={`
            relative rounded-lg border px-4 py-3 shadow-sm cursor-pointer 
            transition duration-150 ease-in-out hover:border-primary-500
            ${selectedType === type.id 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300'
            }
          `}
          onClick={() => handleChange(type.id)}
        >
          <input
            type="radio"
            name="user_type"
            id={`user_type_${type.id}`}
            className="sr-only"
            value={type.id}
            checked={selectedType === type.id}
            onChange={() => handleChange(type.id)}
          />
          <label htmlFor={`user_type_${type.id}`} className="cursor-pointer flex">
            <span className="flex items-center">
              <span className={`flex-shrink-0 text-${selectedType === type.id ? 'primary' : 'gray'}-600`}>
                {type.icon}
              </span>
              <span className="ml-3 flex flex-col">
                <span className={`block text-sm font-medium ${selectedType === type.id ? 'text-primary-900' : 'text-gray-900'}`}>
                  {type.name}
                </span>
                <span className={`block text-xs ${selectedType === type.id ? 'text-primary-700' : 'text-gray-500'}`}>
                  {type.description}
                </span>
              </span>
            </span>
          </label>
          
          {/* Indicateur de sélection */}
          {selectedType === type.id && (
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

UserTypeSelect.propTypes = {
  defaultValue: PropTypes.oneOf(['student', 'professional', 'organization']),
  onChange: PropTypes.func,
};

/**
 * Composant de sélection générique avec recherche
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.options - Options disponibles [{value, label}]
 * @param {string|Array} props.value - Valeur(s) sélectionnée(s)
 * @param {Function} props.onChange - Fonction appelée lors du changement
 * @param {string} props.placeholder - Texte affiché quand aucune option n'est sélectionnée
 * @param {boolean} props.multiple - Autoriser la sélection multiple
 * @param {boolean} props.disabled - Désactiver le sélecteur
 * @returns {JSX.Element} Composant de sélection
 */
export const SearchableSelect = ({ 
  options = [], 
  value = '', 
  onChange, 
  placeholder = 'Sélectionner...', 
  multiple = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState(multiple ? (Array.isArray(value) ? value : []) : value);

  useEffect(() => {
    if (multiple) {
      setSelectedValues(Array.isArray(value) ? value : []);
    } else {
      setSelectedValues(value);
    }
  }, [value, multiple]);

  const handleSelect = (optionValue) => {
    let newValue;
    
    if (multiple) {
      if (selectedValues.includes(optionValue)) {
        newValue = selectedValues.filter(val => val !== optionValue);
      } else {
        newValue = [...selectedValues, optionValue];
      }
    } else {
      newValue = optionValue;
      setIsOpen(false);
    }
    
    setSelectedValues(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisplayValue = () => {
    if (multiple) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = options.find(opt => opt.value === selectedValues[0]);
        return option ? option.label : placeholder;
      }
      return `${selectedValues.length} sélectionnés`;
    } else {
      const option = options.find(opt => opt.value === selectedValues);
      return option ? option.label : placeholder;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={`
          relative w-full bg-white border rounded-md shadow-sm pl-3 pr-10 py-2 text-left 
          focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-primary-500' : 'border-gray-300'}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="block truncate">{getDisplayValue()}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          <div className="sticky top-0 z-10 bg-white px-2 py-2">
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {filteredOptions.length > 0 ? (
            <ul className="max-h-40 overflow-y-auto">
              {filteredOptions.map((option) => {
                const isSelected = multiple 
                  ? selectedValues.includes(option.value)
                  : selectedValues === option.value;
                
                return (
                  <li
                    key={option.value}
                    className={`
                      cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary-50
                      ${isSelected ? 'bg-primary-100 text-primary-900' : 'text-gray-900'}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
                  >
                    <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                      {option.label}
                    </span>
                    
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              Aucun résultat trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SearchableSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Selection;