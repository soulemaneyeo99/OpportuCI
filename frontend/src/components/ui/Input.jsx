// src/components/ui/Input.jsx

import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helpText,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...rest
}, ref) => {
  
  // Générer un ID unique pour le champ
  const inputId = `input-${name}`;
  
  return (
    <div className={`form-control ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        className={`
          w-full rounded-md shadow-sm border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
          ${className}
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        {...rest}
      />
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;