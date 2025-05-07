import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { AuthService } from '../services/authService';

// Composants UI

import logo from '../assets/oppouCI.webp';
import backImg from "../assets/back.webp";
import { LoadingSpinner } from '../components/LoadingSpinner';
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { UserTypeSelect } from '../components/ui/Select';
import ErrorAlert from '../components/ErrorAlert';

// Icons
import { EyeIcon, EyeOffIcon, CheckIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
// Header.jsx
import logo from '../assets/oppouCI.webp';

// Validation rules
const validationRules = {
  username: {
    required: 'Le nom d\'utilisateur est obligatoire',
    minLength: {
      value: 3,
      message: 'Minimum 3 caractères'
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
    minLength: {
      value: 8,
      message: 'Minimum 8 caractères'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      message: 'Majuscule, minuscule et chiffre requis'
    }
  },
  terms: {
    required: 'Vous devez accepter les conditions'
  }
};

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const navigate = useNavigate();
  
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
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: '',
      user_type: 'student',
      phone_number: '',
      city: '',
      country: 'Côte d\'Ivoire',
      terms: false
    },
    mode: 'onChange',
  });

  const password = watch('password');
  const userType = watch('user_type');

  const handleServerErrors = (errors) => {
    if (typeof errors === 'string') {
      setServerError(errors);
      toast.error(errors);
      return;
    }
    
    Object.keys(errors).forEach((key) => {
      if (key === 'non_field_errors') {
        setServerError(errors[key]);
        toast.error(Array.isArray(errors[key]) ? errors[key].join(' ') : errors[key]);
      } else {
        setError(key, { 
          type: 'server', 
          message: Array.isArray(errors[key]) ? errors[key].join(' ') : errors[key] 
        });
      }
    });
  };

  const goToNextStep = async () => {
    let fieldsToValidate = [];
    
    if (registrationStep === 1) {
      fieldsToValidate = ['email', 'username', 'password', 'confirm_password'];
    } else if (registrationStep === 2) {
      fieldsToValidate = ['first_name', 'last_name', 'phone_number', 'city'];
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setRegistrationStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    setRegistrationStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const { confirm_password, terms, ...submitData } = data;
      await AuthService.register(submitData);
      
      toast.success('Inscription réussie !');
      navigate('/login', { 
        state: { 
          message: 'Votre compte a été créé avec succès.',
          email: data.email
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      if (error.response?.data) {
        handleServerErrors(error.response.data);
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.');
        toast.error('Erreur de connexion au serveur');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeChange = (type) => {
    setValue('user_type', type);
    clearErrors();
  };

  const renderStepTitle = () => {
    const titles = {
      1: "Créez votre compte OpportuCI",
      2: "Informations personnelles",
      3: "Finaliser votre inscription"
    };
    return titles[registrationStep] || "Inscription";
  };

  const renderStepContent = () => {
    switch (registrationStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return null;
    }
  };

  const renderStep1 = () => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de compte *
        </label>
        <UserTypeSelect 
          defaultValue={userType}
          onChange={handleUserTypeChange}
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
              required: 'Confirmation requise',
              validate: value => value === password || 'Les mots de passe ne correspondent pas'
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
        disabled={!!errors.email || !!errors.username || !!errors.password || !!errors.confirm_password}
      >
        Continuer <ChevronRightIcon className="ml-1 h-4 w-4" />
      </Button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <Input
          id="first_name"
          label="Prénom"
          type="text"
          placeholder="Votre prénom"
          error={errors.first_name?.message}
          {...register('first_name')}
        />
        <Input
          id="last_name"
          label="Nom"
          type="text"
          placeholder="Votre nom"
          error={errors.last_name?.message}
          {...register('last_name')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
        <Input
          id="phone_number"
          label="Numéro de téléphone"
          type="tel"
          placeholder="+225 0102030405"
          error={errors.phone_number?.message}
          {...register('phone_number')}
        />
        <Input
          id="city"
          label="Ville"
          type="text"
          placeholder="Ex: Abidjan"
          error={errors.city?.message}
          {...register('city')}
        />
      </div>

      {userType === 'student' && (
        <Input
          id="school"
          label="Établissement scolaire"
          type="text"
          placeholder="Nom de votre établissement"
          error={errors.school?.message}
          {...register('school')}
          className="mb-6"
        />
      )}

      {userType === 'organization' && (
        <Input
          id="organization_name"
          label="Nom de l'organisation"
          type="text"
          placeholder="Nom de votre organisation"
          error={errors.organization_name?.message}
          {...register('organization_name')}
          className="mb-6"
        />
      )}

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
        >
          Continuer <ChevronRightIcon className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Récapitulatif</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium">Type de compte:</span> {userType === 'student' ? 'Étudiant' : userType === 'organization' ? 'Organisation' : 'Professionnel'}</p>
          <p><span className="font-medium">Email:</span> {getValues('email')}</p>
          <p><span className="font-medium">Nom d'utilisateur:</span> {getValues('username')}</p>
          {getValues('first_name') && <p><span className="font-medium">Prénom:</span> {getValues('first_name')}</p>}
          {getValues('last_name') && <p><span className="font-medium">Nom:</span> {getValues('last_name')}</p>}
          {getValues('phone_number') && <p><span className="font-medium">Téléphone:</span> {getValues('phone_number')}</p>}
          {getValues('city') && <p><span className="font-medium">Ville:</span> {getValues('city')}</p>}
        </div>
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
          disabled={isSubmitting || isLoading || !getValues('terms')}
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
                src={logo} 
                alt="Logo OpportuCI" 
                className="h-10 w-10 rounded-full"
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
                    "Bourses d'études internationales",
                    "Stages en entreprises leaders",
                    "Formations certifiantes",
                    "Concours professionnels"
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
                <Link to="/" className="lg:hidden">
                <img
                className="h-10 w-auto mx-auto lg:mx-0"
                src={backImg}
                alt="OpportuCI"
              />

                </Link>
                
                <h1 className="mt-6 text-2xl font-bold text-gray-900">
                  {renderStepTitle()}
                </h1>
                
                <p className="mt-2 text-gray-600">
                  {registrationStep === 1 && "Commencez votre parcours vers des opportunités exceptionnelles"}
                  {registrationStep === 2 && "Complétez votre profil pour des recommandations personnalisées"}
                  {registrationStep === 3 && "Finalisez votre inscription et commencez à explorer"}
                </p>
              </div>
              
              {/* Indicateur de progression */}
              <div className="mb-8">
                <div className="flex items-center">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
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
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Compte</span>
                  <span>Profil</span>
                  <span>Finaliser</span>
                </div>
              </div>
              
              {serverError && (
                <ErrorAlert 
                  message={serverError} 
                  onClose={() => setServerError(null)}
                  className="mb-6"
                />
              )}
              
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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