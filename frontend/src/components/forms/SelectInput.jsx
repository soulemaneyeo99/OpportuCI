
const SelectInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Sélectionner une option',
  required = false,
  error = null,
  className = ''
}) => {
  const id = `select-${name}`;
  
  return (
    <div className={`${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectInput;