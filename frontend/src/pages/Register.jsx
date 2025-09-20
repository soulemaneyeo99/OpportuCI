import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '../services/authService';

// Assets
import logo from '../assets/oppouCI.webp';

// Components
import { LoadingSpinner } from '../components/LoadingSpinner';
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { UserTypeSelect, EducationLevelSelect } from '../components/ui/Select';
import ErrorAlert from '../components/ErrorAlert';

// Icons
import { EyeIcon, EyeOffIcon, CheckIcon, ChevronRightIcon, ChevronLeftIcon, UploadIcon, XIcon } from 'lucide-react';

// Règles de validation centralisées et améliorées
const validationRules = {
  username: {
    required: 'Le nom d\'utilisateur est obligatoire',
    minLength: { value: 3, message: 'Minimum 3 caractères' },
    maxLength: { value: 150, message: 'Maximum 150 caractères' },
    pattern: {
      value: /^[\w.@+-]+$/,
      message: 'Lettres, chiffres et @/./+/-/_ seulement'
    }
  },
  email: {
    required: 'L\'email est obligatoire',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email invalide'
    }
  },
  password: {
    required: 'Le mot de passe est obligatoire',
    minLength: { value: 8, message: 'Minimum 8 caractères' }
  },
  confirm_password: {
    required: 'La confirmation du mot de passe est obligatoire'
  },
  first_name: {
    required: 'Le prénom est obligatoire',
    maxLength: { value: 30, message: 'Maximum 30 caractères' }
  },
  last_name: {
    required: 'Le nom est obligatoire',
    maxLength: { value: 150, message: 'Maximum 150 caractères' }
  },
  phone_number: {
    pattern: {
      value: /^\+?225[0-9]{8,10}$/,
      message: 'Numéro ivoirien invalide (ex: +2250102030405)'
    }
  },
  terms: {
    required: 'Vous devez accepter les conditions'
  },
  cv: {
    validate: {
      fileSize: file => !file || file.size <= 5 * 1024 * 1024 || 'Le fichier ne doit pas dépasser 5MB',
      fileType: file => !file || ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type) || 'Format accepté: PDF ou Word'
    }
  }
};

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [cvFile, setCvFile] = useState(null);
  const cvInputRef = useRef(null);
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [showCustomCity, setShowCustomCity] = useState(false);
  // Initialisation du formulaire avec mode onBlur pour une meilleure UX
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    getValues,
    trigger,
    clearErrors
  } = useForm({
    mode: 'onBlur', // Valide dès qu'un champ perd le focus
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: '',
      user_type: 'student',  // Correspondre au choix backend
      phone_number: '',
      city: '',
      country: 'Côte d\'Ivoire',
      education_level: '',
      institution: '',
      field_of_study: '',
      bio: '',
      skills: '',
      interests: '',
      linkedin_profile: '',
      github_profile: '',
      portfolio_website: '',
      languages: 'Français',
      certifications: '',
      availability_status: 'available',
      terms: false,
      cv: null
    }
  });

  // Watch pour validation en temps réel
  const password = watch('password');
  const userType = watch('user_type');

  // Reset les erreurs serveur quand l'utilisateur modifie un champ
  useEffect(() => {
    if (serverError) {
      const subscription = watch((value, { name }) => {
        if (name && serverError) {
          setServerError(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [serverError, watch]);

  // Gestion améliorée des erreurs du serveur
  const handleServerErrors = (errors) => {
    if (typeof errors === 'string') {
      setServerError(errors);
      toast.error(errors);
      return;
    }
    
    // Si l'erreur est un objet mais pas un objet d'erreurs standard
    if (typeof errors !== 'object' || errors === null) {
      setServerError("Une erreur inattendue s'est produite.");
      toast.error("Une erreur inattendue s'est produite.");
      return;
    }
    
    // Traitement des erreurs de formulaire renvoyées par le backend
    Object.keys(errors).forEach((key) => {
      if (key === 'non_field_errors' || key === 'detail') {
        const errorMessage = Array.isArray(errors[key]) ? errors[key].join(' ') : errors[key];
        setServerError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = Array.isArray(errors[key]) ? errors[key].join(' ') : errors[key];
        setError(key, { 
          type: 'server', 
          message: errorMessage
        });
      }
    });
  };

  // Gestion du téléchargement du CV
  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      setError('cv', { type: 'manual', message: 'Le fichier ne doit pas dépasser 5MB' });
      return;
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('cv', { type: 'manual', message: 'Format accepté: PDF ou Word' });
      return;
    }

    setCvFile(file);
    setValue('cv', file, { shouldValidate: true });
    clearErrors('cv');
  };

  // Suppression du CV
  const removeCv = () => {
    setCvFile(null);
    setValue('cv', null);
    if (cvInputRef.current) {
      cvInputRef.current.value = '';
    }
    clearErrors('cv');
  };

  // Navigation entre les étapes avec validation préalable
  const goToNextStep = async () => {
    let fieldsToValidate = [];
    
    // Définir les champs à valider selon l'étape actuelle
    if (registrationStep === 1) {
      fieldsToValidate = ['email', 'username', 'password', 'confirm_password', 'user_type'];
    } else if (registrationStep === 2) {
      fieldsToValidate = ['first_name', 'last_name', 'education_level', 'institution'];
    } else if (registrationStep === 3) {
      fieldsToValidate = ['bio', 'skills', 'languages'];
    }
    
    // Vérification de la validation des champs nécessaires
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setRegistrationStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error("Veuillez corriger les erreurs avant de continuer.");
    }
  };

  // Retour à l'étape précédente
  const goToPreviousStep = () => {
    setRegistrationStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  // Préparation des données pour correspondre aux attentes du backend
  const prepareDataForBackend = (data) => {
    // Suppression des champs qui ne doivent pas être envoyés au backend
    const { confirm_password, terms, ...submitData } = data;
    
    // S'assurer que les types correspondent à ce qu'attend le backend
    // Par exemple, convertir 'education_level' en nombre si nécessaire
    // ou transformer les valeurs séparées par des virgules en tableaux
    
    // Exemple : transformation des chaînes séparées par des virgules en tableaux
    if (submitData.skills) {
      submitData.skills = submitData.skills.split(',').map(item => item.trim()).filter(Boolean);
    }
    
    if (submitData.interests) {
      submitData.interests = submitData.interests.split(',').map(item => item.trim()).filter(Boolean);
    }
    
    if (submitData.languages) {
      submitData.languages = submitData.languages.split(',').map(item => item.trim()).filter(Boolean);
    }
    
    if (submitData.certifications) {
      submitData.certifications = submitData.certifications.split(',').map(item => item.trim()).filter(Boolean);
    }

    // S'assurer que le type d'utilisateur est correct selon le backend
    if (submitData.user_type === 'student') {
      submitData.user_type = 'student';  // Ou la valeur exacte attendue par le backend
    } else if (submitData.user_type === 'professional') {
      submitData.user_type = 'professional';  // Ou la valeur exacte attendue par le backend
    } else if (submitData.user_type === 'organization') {
      submitData.user_type = 'organization';  // Ou la valeur exacte attendue par le backend
    }
    
    return submitData;
  };
// Fonction onSubmit optimisée pour Register.jsx
// À remplacer dans votre composant

const onSubmit = async (data) => {
  setIsLoading(true);
  setServerError(null);

  try {
    // 1. Structure appropriée des données
    // - Crée la structure de données attendue par le backend
    // - Gère correctement les tableaux et les valeurs par défaut

    // Préparer les données du profil
    const profileData = {
      bio: data.bio || "",
      skills: processArrayField(data.skills),
      interests: processArrayField(data.interests),
      languages: processArrayField(data.languages),
      certifications: processArrayField(data.certifications),
      linkedin_profile: data.linkedin_profile || "",
      github_profile: data.github_profile || "",
      portfolio_website: data.portfolio_website || "",
      availability_status: data.availability_status || "available"
    };

    // Préparer les données principales de l'utilisateur
   const registerData = {
  email: data.email,
  username: data.username,
  password: data.password,
  confirm_password: data.confirm_password,
  user_type: data.user_type,
  first_name: data.first_name,
  last_name: data.last_name,
  phone_number: data.phone_number || "",
  city: selectedCity === 'other' ? customCity : selectedCity || "",
  country: data.country || "Côte d'Ivoire",
  education_level: data.education_level || "",
  institution: data.institution || "",
  field_of_study: data.field_of_study || "",
  profile: {
    bio: data.bio || "",
    skills: data.skills || "",
    interests: data.interests || "",
    languages: data.languages || "Français",
    certifications: data.certifications || "",
    linkedin_profile: data.linkedin_profile || "",
    github_profile: data.github_profile || "",
    portfolio_website: data.portfolio_website || "",
    availability_status: data.availability_status || "available",
    cv: data.cv || null
  },
  terms: data.terms
};

    // Ajouter le CV si présent
    if (cvFile) {
      registerData.cv = cvFile;
    }

    console.log('Données à envoyer:', registerData);

    // 2. Appel au service avec journalisation
    const response = await AuthService.register(registerData);

    // 3. Gestion de la réponse réussie
    toast.success('Inscription réussie ! Un email de confirmation a été envoyé.', {
      position: 'top-center',
      autoClose: 5000,
    });

    // Redirection vers la page de connexion avec message
    navigate('/login', {
      state: {
        message: 'Votre compte a été créé avec succès. Veuillez vérifier votre email pour confirmer votre compte.',
        email: data.email,
        userType: data.user_type,
        timestamp: new Date().toISOString()
      },
      replace: true
    });

  } catch (error) {
    // 4. Gestion améliorée des erreurs
    console.group('Erreur lors de l\'inscription');
    console.error('Erreur complète:', error);
    console.groupEnd();

    // Traitement des erreurs de validation backend
    if (error && typeof error === 'object') {
      // Traitement des erreurs de champ spécifiques
      Object.entries(error).forEach(([field, message]) => {
        const errorMsg = Array.isArray(message) ? message.join(' ') : message;
        
        // Gestion des erreurs de champs spécifiques
        if (field !== 'message' && field !== 'details' && field !== 'non_field_errors' && field !== 'detail') {
          // Pour les erreurs dans l'objet profile
          if (field.startsWith('profile.')) {
            // Extraire le nom du champ à partir de 'profile.field'
            const profileField = field.split('.')[1];
            setError(profileField, { type: 'server', message: errorMsg });
          } else {
            // Pour les erreurs au niveau utilisateur
            setError(field, { type: 'server', message: errorMsg });
          }
        } else {
          // Pour les erreurs globales
          const globalError = errorMsg || "Une erreur est survenue lors de l'inscription";
          setServerError(globalError);
          toast.error(globalError);
        }
      });
    } else {
      // Erreur générique
      const errorMessage = typeof error === 'string' ? error : "Une erreur inattendue s'est produite";
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  } finally {
    setIsLoading(false);
  }
};

// Fonction utilitaire pour traiter les champs de tableau
function processArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(',').map(item => item.trim()).filter(Boolean);
}
// Helper pour formater les erreurs de validation
const formatValidationErrors = (errors) => {
  if (typeof errors === 'string') return errors;
  
  return Object.entries(errors)
    .map(([field, messages]) => {
      const fieldName = field.replace(/_/g, ' ');
      return `${fieldName}: ${Array.isArray(messages) ? messages.join(' • ') : messages}`;
    })
    .join('\n');
};

// Titres des étapes
const renderStepTitle = () => {
  const titles = {
    1: "Informations de base",
    2: "Profil académique",
    3: "Compétences et centres d'intérêt"
  };
  return titles[registrationStep] || "Inscription";
};
  // Rendu du contenu selon l'étape
  const renderStepContent = () => {
    switch (registrationStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return null;
    }
  };

  // Étape 1: Informations de base
  const renderStep1 = () => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de compte *
        </label>
        <UserTypeSelect 
          defaultValue={userType}
          onChange={(type) => {
            setValue('user_type', type, { shouldValidate: true });
            clearErrors('user_type');
          }}
        />
        {errors.user_type && (
          <p className="mt-1 text-sm text-red-600">{errors.user_type.message}</p>
        )}
      </div>

      <Input
        id="email"
        label="Adresse email *"
        type="email"
        placeholder="votre.email@example.com"
        error={errors.email?.message}
        {...register('email', validationRules.email)}
      />

      <Input
        id="username"
        label="Nom d'utilisateur *"
        type="text"
        placeholder="Choisissez un nom unique"
        error={errors.username?.message}
        {...register('username', validationRules.username)}
      />

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe *
        </label>
        <div className="relative">
          <input
            id="password"
            type={passwordVisible ? "text" : "password"}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="8 caractères minimum"
            {...register('password', validationRules.password)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
          Confirmer le mot de passe *
        </label>
        <div className="relative">
          <input
            id="confirm_password"
            type={confirmPasswordVisible ? "text" : "password"}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              errors.confirm_password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirmez votre mot de passe"
            {...register('confirm_password', {
              required: 'La confirmation du mot de passe est obligatoire',
              validate: value => value === watch('password') || 'Les mots de passe ne correspondent pas'
            })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            {confirmPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirm_password && (
          <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
        )}
      </div>

      <Button
        type="button"
        onClick={goToNextStep}
        className="w-full bg-blue-700 hover:bg-blue-800"
        disabled={isSubmitting || !!errors.email || !!errors.username || !!errors.password || !!errors.confirm_password}
      >
        Continuer <ChevronRightIcon className="ml-1 h-4 w-4" />
      </Button>
    </>
  );

  // Étape 2: Profil académique
  const renderStep2 = () => (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <Input
          id="first_name"
          label="Prénom *"
          type="text"
          placeholder="Votre prénom"
          error={errors.first_name?.message}
          {...register('first_name', validationRules.first_name)}
        />
        <Input
          id="last_name"
          label="Nom *"
          type="text"
          placeholder="Votre nom"
          error={errors.last_name?.message}
          {...register('last_name', validationRules.last_name)}
        />
      </div>

      <Input
        id="phone_number"
        label="Numéro de téléphone"
        type="tel"
        placeholder="+2250102030405"
        error={errors.phone_number?.message}
        {...register('phone_number', validationRules.phone_number)}
      />

  

    <div className="mb-4">
      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
        Ville *
      </label>
      <select
        id="city"
        value={selectedCity}
        onChange={(e) => {
          setSelectedCity(e.target.value);
          setShowCustomCity(e.target.value === 'other');
          setValue('city', e.target.value);
        }}
        className={`w-full px-4 py-2 border rounded-lg ${
          errors.city ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Sélectionnez une ville</option>
        <option value="abidjan">Abidjan</option>
        <option value="bouake">Bouaké</option>
        <option value="daloa">Daloa</option>
        <option value="yamoussoukro">Yamoussoukro</option>
        <option value="sanpedro">San-Pédro</option>
        <option value="korhogo">Korhogo</option>
        <option value="man">Man</option>
        <option value="other">Autre ville</option>
      </select>
      {errors.city && (
        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
      )}
    </div>

    {showCustomCity && (
      <Input
        id="custom_city"
        label="Précisez votre ville *"
        type="text"
        placeholder="Entrez le nom de votre ville"
        value={customCity}
        onChange={(e) => {
          setCustomCity(e.target.value);
          setValue('city', e.target.value);
        }}
        error={errors.custom_city?.message}
      />
    )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Niveau d'éducation *
        </label>
        <EducationLevelSelect 
          defaultValue={getValues('education_level')}
          onChange={(value) => setValue('education_level', value, { shouldValidate: true })}
        />
        {errors.education_level && (
          <p className="mt-1 text-sm text-red-600">{errors.education_level.message}</p>
        )}
      </div>

      <Input
        id="institution"
        label="Établissement d'enseignement *"
        type="text"
        placeholder="Ex: Université Félix Houphouët-Boigny, INP-HB, ENS"
        error={errors.institution?.message}
        {...register('institution', { required: "L'établissement est obligatoire" })}
      />

      <Input
        id="field_of_study"
        label="Domaine d'étude"
        type="text"
        placeholder="Ex: Informatique, Médecine, Droit"
        error={errors.field_of_study?.message}
        {...register('field_of_study')}
      />

      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          onClick={goToPreviousStep}
          variant="outline"
          className="w-1/2 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeftIcon className="mr-1 h-4 w-4" /> Retour
        </Button>
        <Button
          type="button"
          onClick={goToNextStep}
          className="w-1/2 bg-blue-700 hover:bg-blue-800"
          disabled={isSubmitting || !!errors.first_name || !!errors.last_name || !!errors.education_level || !!errors.institution}
        >
          Continuer <ChevronRightIcon className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </>
  );

  // Étape 3: Compétences et centres d'intérêt
  const renderStep3 = () => (
    <>
      <Input
        id="bio"
        label="Biographie *"
        type="textarea"
        rows={4}
        placeholder="Décrivez vos objectifs académiques et professionnels (min 30 caractères)"
        error={errors.bio?.message}
        {...register('bio', { 
          required: "La biographie est requise",
          minLength: {
            value: 30,
            message: "Minimum 30 caractères"
          },
          maxLength: {
            value: 500,
            message: "Maximum 500 caractères"
          }
        })}
      />

      <Input
        id="skills"
        label="Compétences (séparées par des virgules) *"
        type="text"
        placeholder="Ex: Python, Gestion de projet, Leadership"
        error={errors.skills?.message}
        {...register('skills', { required: "Au moins une compétence est requise" })}
      />

      <Input
        id="interests"
        label="Centres d'intérêt (séparés par des virgules)"
        type="text"
        placeholder="Ex: Technologie, Entrepreneuriat, Art"
        error={errors.interests?.message}
        {...register('interests')}
      />

      <Input
        id="languages"
        label="Langues parlées (séparées par des virgules) *"
        type="text"
        placeholder="Ex: Français, Anglais, Baoulé"
        error={errors.languages?.message}
        {...register('languages', { required: "Au moins une langue est requise" })}
      />

      <Input
        id="certifications"
        label="Certifications (séparées par des virgules)"
        type="text"
        placeholder="Ex: AWS Certified, Google Analytics"
        error={errors.certifications?.message}
        {...register('certifications')}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CV (PDF ou Word)
        </label>
        <div className="mt-1 flex items-center">
          <label
            htmlFor="cv-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            Téléverser un CV
          </label>
          <input
            id="cv-upload"
            type="file"
            ref={cvInputRef}
            className="sr-only"
            accept=".pdf,.doc,.docx"
            onChange={handleCvUpload}
          />
          {cvFile && (
            <div className="ml-4 flex items-center">
              <span className="text-sm text-gray-700 truncate max-w-xs">
                {cvFile.name}
              </span>
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={removeCv}
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {errors.cv && (
          <p className="mt-1 text-sm text-red-600">{errors.cv.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Formats acceptés: PDF, DOC, DOCX (max 5MB)
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Statut de disponibilité
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          {...register('availability_status')}
        >
          <option value="available">Disponible</option>
          <option value="limited">Disponibilité limitée</option>
          <option value="unavailable">Non disponible</option>
        </select>
      </div>

      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...register('terms', validationRules.terms)}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-700">
            J'accepte les{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500">
              conditions générales
            </Link>{' '}
            et la{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
              politique de confidentialité
            </Link>
          </label>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          onClick={goToPreviousStep}
          variant="outline"
          className="w-1/2 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeftIcon className="mr-1 h-4 w-4" /> Retour
        </Button>
        <Button
          type="submit"
          className="w-1/2 bg-blue-700 hover:bg-blue-800"
          disabled={isLoading || !getValues('terms')}
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            "S'inscrire"
          )}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Colonne illustration */}
            <div className="hidden lg:block bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white">
              <div className="h-full flex flex-col justify-center">
                <Link to="/" className="mb-8">
                  <img
                    className="max-w-[200px] h-auto mx-auto lg:mx-0 rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
                    src={logo}
                    alt="OpportuCI"
                  />
                </Link>
                
                <h2 className="text-3xl font-bold mb-4">
                  Rejoignez la communauté OpportuCI
                </h2>
                
                <p className="text-blue-100 mb-8">
                  Accédez à des opportunités exclusives pour booster votre carrière
                </p>
                
                <ul className="space-y-3">
                  {[
                    "Bourses d'études locales et internationales",
                    "Stages et emplois en Côte d'Ivoire",
                    "Formations certifiantes gratuites",
                    "Concours académiques et professionnels",
                    "Roadmaps personnalisées par domaine"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-5 w-5 mr-2 text-blue-200" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Colonne formulaire */}
            <div className="p-8 sm:p-12">
              <div className="mb-8 text-center lg:text-left">
                <Link to="/" className="lg:hidden block mb-6">
                  <img
                    className="max-w-[150px] h-auto mx-auto rounded-xl"
                    src={logo}
                    alt="OpportuCI"
                  />
                </Link>
                
                <h1 className="text-2xl font-bold text-gray-900">
                  {renderStepTitle()}
                </h1>
                
                <p className="mt-2 text-gray-600">
                  {registrationStep === 1 && "Commencez votre parcours vers des opportunités exceptionnelles"}
                  {registrationStep === 2 && "Complétez votre profil académique"}
                  {registrationStep === 3 && "Ajoutez vos compétences et centres d'intérêt"}
                </p>
              </div>
              
              {/* Indicateur de progression */}
              <div className="mb-8">
                <div className="flex items-center">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        step <= registrationStep 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`flex-1 h-1 mx-2 ${
                          step < registrationStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Compte</span>
                  <span>Académique</span>
                  <span>Compétences</span>
                </div>
              </div>
              
              {serverError && (
                <ErrorAlert 
                  message={serverError} 
                  onClose={() => setServerError(null)}
                  className="mb-6"
                />
              )}
              
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                {renderStepContent()}
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Connectez-vous
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;