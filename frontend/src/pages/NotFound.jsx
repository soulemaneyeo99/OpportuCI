import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * 404 Not Found page
 * Displayed when users navigate to a URL that doesn't exist
 */
const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          {/* 404 Icon/Illustration */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-5xl font-bold">404</span>
              </div>
              <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 text-xl">!</span>
              </div>
            </div>
          </div>
          
          {/* Heading and Description */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page introuvable
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Page précédente
            </button>
          </div>
        </div>
        
        {/* Helpful links section */}
        <div className="mt-16 w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">
            Vous pourriez être intéressé par:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/opportunities" 
              className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex flex-col items-center text-center"
            >
              <span className="text-gray-900 font-medium mb-1">Découvrir les opportunités</span>
              <span className="text-gray-500 text-sm">Explorez les bourses, stages et formations</span>
            </Link>
            <Link 
              to="/register" 
              className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex flex-col items-center text-center"
            >
              <span className="text-gray-900 font-medium mb-1">Créer un compte</span>
              <span className="text-gray-500 text-sm">Rejoignez notre communauté</span>
            </Link>
            <Link 
              to="/about" 
              className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex flex-col items-center text-center"
            >
              <span className="text-gray-900 font-medium mb-1">À propos de nous</span>
              <span className="text-gray-500 text-sm">Découvrez notre mission et vision</span>
            </Link>
            <Link 
              to="/login" 
              className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex flex-col items-center text-center"
            >
              <span className="text-gray-900 font-medium mb-1">Se connecter</span>
              <span className="text-gray-500 text-sm">Accédez à votre compte</span>
            </Link>
          </div>
        </div>
        
        {/* Help section */}
        <div className="mt-10 text-center">
          <p className="text-gray-500">
            Besoin d'aide? <Link to="/contact" className="text-blue-600 hover:text-blue-800">Contactez-nous</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;