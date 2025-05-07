import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

// Form components
import TextInput from '../components/forms/TextInput';
import TextAreaInput from '../components/forms/TextAreaInput';
import SelectInput from '../components/forms/SelectInput';
import DateInput from '../components/forms/DateInput';
import ImageUpload from '../components/forms/ImageUpload';

const OpportunityCreate = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    location: '',
    organization: '',
    requirements: '',
    eligibility: '',
    application_link: '',
    image: null
  });

  // Fetch categories and locations for dropdown options
  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        // Fetch categories
        const categoryResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/categories/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          setCategories(categoryData);
        }
        
        // Fetch locations
        const locationResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/locations/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (locationResponse.ok) {
          const locationData = await locationResponse.json();
          setLocations(locationData);
        }
      } catch (error) {
        console.error('Error fetching form options:', error);
        toast.error('Impossible de charger certaines options du formulaire');
      }
    };
    
    fetchFormOptions();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (file) => {
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.deadline) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add current user as creator
      submitData.append('created_by', user.id);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/opportunities/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });
      
      if (response.ok) {
        const newOpportunity = await response.json();
        toast.success('Opportunité créée avec succès!');
        navigate(`/opportunities/${newOpportunity.id}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Créer une nouvelle opportunité</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Informations de base</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Titre de l'opportunité *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Bourse d'études pour étudiant en ingénierie"
                  required
                />
                
                <SelectInput
                  label="Catégorie *"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                  placeholder="Sélectionner une catégorie"
                  required
                />
                
                <TextInput
                  label="Organisation"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Ex: Ministère de l'Education"
                />
                
                <SelectInput
                  label="Localisation"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                  placeholder="Sélectionner une localisation"
                />
                
                <DateInput
                  label="Date limite *"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
                
                <TextInput
                  label="Lien d'application"
                  name="application_link"
                  value={formData.application_link}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>
            
            {/* Detailed Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Informations détaillées</h2>
              
              <div className="space-y-6">
                <TextAreaInput
                  label="Description *"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez l'opportunité en détail..."
                  rows={5}
                  required
                />
                
                <TextAreaInput
                  label="Conditions d'éligibilité"
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
                  placeholder="Ex: Ouvert aux étudiants de 18 à 25 ans..."
                  rows={3}
                />
                
                <TextAreaInput
                  label="Prérequis et compétences"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Ex: Niveau d'anglais B2 requis..."
                  rows={3}
                />
              </div>
            </div>
            
            {/* Media Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Média</h2>
              
              <ImageUpload
                label="Image de l'opportunité"
                onChange={handleImageChange}
                currentImage={formData.image}
                className="mb-6"
              />
              
              <p className="text-sm text-gray-500 italic">
                Ajoutez une image représentative pour votre opportunité (format recommandé: 16:9, max 2MB)
              </p>
            </div>
            
            {/* Buttons */}
            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </span>
                ) : (
                  'Créer l\'opportunité'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default OpportunityCreate;