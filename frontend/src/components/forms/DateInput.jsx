
const DateInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false,
  minDate = '',
  maxDate = '',
  error = null,
  className = ''
}) => {
  const id = `date-${name}`;
  
  // Calculate default minimum date if not provided (today)
  const today = new Date().toISOString().split('T')[0];
  const effectiveMinDate = minDate || today;
  
  return (
    <div className={`${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="date"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={effectiveMinDate}
        max={maxDate}
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default DateInput;