import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // Réinitialiser les erreurs lorsque l'utilisateur modifie le formulaire
  useEffect(() => {
    if (errors.email || errors.password || errors.general) {
      setErrors({
        email: "",
        password: "",
        general: ""
      });
    }
  }, [formData.email, formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      general: ""
    };

    // Validation email
    if (!formData.email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(formData);
      
      // Si login retourne un objet au lieu de lancer une exception
      if (result && typeof result === 'object') {
        if (!result.success) {
          // Gérer les erreurs structurées
          if (result.fieldErrors) {
            const newErrors = { ...errors };
            
            if (result.fieldErrors.email) {
              newErrors.email = Array.isArray(result.fieldErrors.email) 
                ? result.fieldErrors.email[0] 
                : result.fieldErrors.email;
            }
            
            if (result.fieldErrors.password) {
              newErrors.password = Array.isArray(result.fieldErrors.password) 
                ? result.fieldErrors.password[0] 
                : result.fieldErrors.password;
            }
            
            setErrors(newErrors);
            toast.error(result.error || "Veuillez corriger les erreurs dans le formulaire");
            return;
          } else {
            // Message d'erreur général
            setErrors({ ...errors, general: result.error || "Erreur de connexion" });
            toast.error(result.error || "Échec de la connexion");
            return;
          }
        }
      }
      
      // Si tout s'est bien passé
      toast.success("Connexion réussie !");
      navigate("/profil");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      
      const errorMsg = error.message || "Échec de la connexion. Veuillez réessayer.";
      
      // Erreur d'authentification
      if (error.response?.status === 401) {
        setErrors({ ...errors, general: "Email ou mot de passe incorrect" });
        toast.error("Email ou mot de passe incorrect");
      } 
      // Erreur de validation
      else if (error.response?.status === 400) {
        const errorData = error.response.data;
        const newErrors = { ...errors };
        
        if (errorData.email) {
          newErrors.email = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
        }
        
        if (errorData.password) {
          newErrors.password = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
        }
        
        if (!newErrors.email && !newErrors.password && errorData.detail) {
          newErrors.general = errorData.detail;
        }
        
        setErrors(newErrors);
        toast.error("Veuillez corriger les erreurs dans le formulaire");
      } 
      // Autres erreurs
      else {
        setErrors({ ...errors, general: errorMsg });
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border rounded-lg shadow-md p-8 my-10">
      <h1 className="text-2xl font-semibold mb-6 text-center text-blue-700">
        Connexion
      </h1>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Votre adresse email"
          required
          error={errors.email}
        />

        <div className="relative">
          <Input
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Votre mot de passe"
            required
            error={errors.password}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
          >
            {showPassword ? (
              <EyeIcon />
            ) : (
              <EyeSlashIcon />
            )}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="remember-me"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span>Se souvenir de moi</span>
          </label>

          <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
            Mot de passe oublié ?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-2">Vous n'avez pas encore de compte ?</p>
        <Link to="/register">
          <Button variant="secondary" className="w-full">
            Créer un compte
          </Button>
        </Link>
      </div>
    </div>
  );
};

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
  </svg>
);

export default Login;