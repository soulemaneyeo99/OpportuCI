// src/pages/Login.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { username, password } = formData;
      
      if (!username || !password) {
        toast.error("Veuillez remplir tous les champs");
        return;
      }
      
      await login(username, password);
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else if (error.response?.data) {
        const errors = error.response.data;
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key].join(", ")}`);
        });
      } else {
        toast.error("Échec de la connexion. Veuillez vérifier vos identifiants.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border rounded-lg shadow-md p-8 my-10">
      <h1 className="text-2xl font-semibold mb-6 text-center text-blue-700">
        Connexion
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom d'utilisateur ou Email"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Votre nom d'utilisateur ou email"
          required
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
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>
          
          <div className="text-sm">
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </div>
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

export default Login;