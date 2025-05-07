import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CategoryAPI } from '../services/api';

const OpportunityForm = ({ 
  initialValues = {}, 
  onSubmit, 
  isSubmitting, 
  isEditMode = false 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    location: '',
    organization: '',
    is_verified: false,
    ...initialValues
  });
  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // When initialValues change, update formData
    if (initialValues && Object.keys(initialValues).length > 0) {
      // Format the deadline date for the input if it exists
      const formattedInitialValues = { ...initialValues };
      if (formattedInitialValues.deadline) {
        formattedInitialValues.deadline = new Date(formattedInitialValues.deadline)
          .toISOString().split('T')[0];
      }
      setFormData(formattedInitialValues);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.deadline) errors.deadline = 'Deadline is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.organization.trim()) errors.organization = 'Organization is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo(0, 0); // Scroll to top to show validation errors
      return;
    }

    // Format the data for submission
    const submissionData = {
      ...formData,
      // Convert deadline string to ISO format if it exists
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
    };

    await onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.title ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter opportunity title"
          required
        />
        {validationErrors.title && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          name="description"
          id="description"
          rows="5"
          value={formData.description || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.description ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter opportunity description"
          required
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category *
        </label>
        <select
          name="category"
          id="category"
          value={formData.category || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.category ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          required
          disabled={loadingCategories}
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {validationErrors.category && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
        )}
      </div>

      {/* Deadline */}
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
          Deadline *
        </label>
        <input
          type="date"
          name="deadline"
          id="deadline"
          value={formData.deadline || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.deadline ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          required
        />
        {validationErrors.deadline && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.deadline}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location *
        </label>
        <input
          type="text"
          name="location"
          id="location"
          value={formData.location || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.location ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter location (city, country, or 'Remote')"
          required
        />
        {validationErrors.location && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
        )}
      </div>

      {/* Organization */}
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
          Organization *
        </label>
        <input
          type="text"
          name="organization"
          id="organization"
          value={formData.organization || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.organization ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter organization name"
          required
        />
        {validationErrors.organization && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.organization}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{isEditMode ? 'Update Opportunity' : 'Create Opportunity'}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default OpportunityForm;