// src/components/ui/Button.jsx

import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  type = "button", 
  className = "", 
  variant = "primary", 
  size = "medium", 
  disabled = false, 
  onClick, 
  ...rest 
}, ref) => {
  
  // Base styles appliqués à tous les boutons
  let baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  
  // Styles spécifiques aux variantes
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 border border-transparent",
    secondary: "bg-white text-blue-600 hover:bg-blue-50 border border-blue-600",
    outline: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent",
    success: "bg-green-600 text-white hover:bg-green-700 border border-transparent",
    link: "bg-transparent text-blue-600 hover:text-blue-800 hover:underline border-none p-0 shadow-none"
  };
  
  // Styles spécifiques aux tailles
  const sizeStyles = {
    small: "text-xs py-1 px-3",
    medium: "text-sm py-2 px-4",
    large: "text-base py-2.5 px-5"
  };
  
  // Styles pour l'état désactivé
  const disabledStyles = disabled 
    ? "opacity-60 cursor-not-allowed" 
    : "shadow-sm";
  
  // Combiner tous les styles
  const buttonStyles = `
    ${baseStyles} 
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.medium}
    ${disabledStyles}
    ${className}
  `.trim();
  
  return (
    <button
      ref={ref}
      type={type}
      className={buttonStyles}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;