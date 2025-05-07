// Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import OpportunityCard from "../components/OpportunityCard";
import CategoryCard from "../components/CategoryCard";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  UserGroupIcon,
  GlobeAltIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import api from "../services/api"; 

const Home = () => {
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
  const [stats, setStats] = useState({
    opportunities: 0,
    organizations: 0,
    scholarships: 0,
    internships: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { 
      id: 1, 
      name: "Bourses", 
      icon: <AcademicCapIcon className="h-8 w-8 text-blue-600" />,
      description: "Financements pour vos études",
      count: 48,
      color: "bg-blue-100" 
    },
    { 
      id: 2, 
      name: "Stages", 
      icon: <BriefcaseIcon className="h-8 w-8 text-green-600" />,
      description: "Expériences professionnelles",
      count: 76,
      color: "bg-green-100" 
    },
    { 
      id: 3, 
      name: "Concours", 
      icon: <UserGroupIcon className="h-8 w-8 text-purple-600" />,
      description: "Défis et compétitions",
      count: 32,
      color: "bg-purple-100" 
    },
    { 
      id: 4, 
      name: "Formations", 
      icon: <GlobeAltIcon className="h-8 w-8 text-orange-600" />,
      description: "Programmes de développement",
      count: 59,
      color: "bg-orange-100" 
    }
  ];
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les opportunités à la une
        const opportunitiesResponse = await api.GenericAPI.get('/opportunities/featured/');
  
        // Si tu réactives les stats :
        // const statsResponse = await api.get("/api/stats/");
  
        setFeaturedOpportunities(opportunitiesResponse.data);
        // setStats(statsResponse.data); // décommente si nécessaire
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Échec du chargement du contenu. Veuillez rafraîchir la page.");
        setLoading(false);
      }
    };
  
    fetchHomeData();
  }, []);
  

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="text-red-500 text-center mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
          >
            Réessayer
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Section Hero */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white" style={{
        backgroundImage: `url('../assets/back.webp'), linear-gradient(to right, rgba(30, 64, 175, 0.95), rgba(37, 99, 235, 0.9))`,
        backgroundSize: 'cover',
        backgroundBlendMode: 'overlay',
      }}>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Découvrez des Opportunités Professionnelles pour Jeunes Ivoiriens
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Connectez-vous avec des bourses, stages, concours et programmes de formation pour booster votre carrière.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/opportunities" 
                className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-gray-100 transition shadow-md"
              >
                Explorer les Opportunités
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-700 transition"
              >
                Créer un Compte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <StatCard 
              icon={<GlobeAltIcon className="h-8 w-8 text-blue-600" />}
              title="Opportunités"
              value={stats.opportunities}
              description="Actuellement disponibles"
            />
            <StatCard 
              icon={<BriefcaseIcon className="h-8 w-8 text-green-600" />}
              title="Organisations"
              value={stats.organizations}
              description="Partenaires de confiance"
            />
            <StatCard 
              icon={<AcademicCapIcon className="h-8 w-8 text-purple-600" />}
              title="Bourses"
              value={stats.scholarships}
              description="Opportunités éducatives"
            />
            <StatCard 
              icon={<UserGroupIcon className="h-8 w-8 text-orange-600" />}
              title="Stages"
              value={stats.internships}
              description="Expériences professionnelles"
            />
          </div>
        </div>
      </section>

      {/* Section Catégories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explorer par Catégorie</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Parcourez notre collection diversifiée d'opportunités professionnelles adaptées aux jeunes talents ivoiriens.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id}
                name={category.name}
                icon={category.icon}
                description={category.description}
                count={category.count}
                color={category.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Opportunités à la Une */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Opportunités à la Une</h2>
              <p className="text-gray-600">
                Découvrez les opportunités les plus récentes et les plus recherchées
              </p>
            </div>
            <Link 
              to="/opportunities" 
              className="hidden md:flex items-center text-blue-700 hover:text-blue-800"
            >
              Voir toutes les opportunités
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          {featuredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOpportunities.map((opportunity) => (
                <OpportunityCard 
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">Aucune opportunité à la une disponible pour le moment.</p>
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link 
              to="/opportunities" 
              className="inline-flex items-center text-blue-700 hover:text-blue-800"
            >
              Voir toutes les opportunités
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comment Ça Marche */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment Fonctionne OpportuCI</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre plateforme connecte les jeunes talents ivoiriens à des opportunités qui transforment leur vie en trois étapes simples.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-700 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Création de Compte</h3>
              <p className="text-gray-600">
                Inscrivez-vous gratuitement et complétez votre profil pour débloquer des recommandations personnalisées.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-700 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Exploration des Opportunités</h3>
              <p className="text-gray-600">
                Parcourez notre liste soigneusement sélectionnée de bourses, stages et programmes de formation.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-700 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Candidature et Réussite</h3>
              <p className="text-gray-600">
                Suivez les instructions de candidature, soumettez vos documents et suivez votre progression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Appel à l'Action */}
      <section className="py-16 bg-blue-700 text-white" style={{
        backgroundImage: `url('../assets/back.webp'), linear-gradient(to right, rgba(29, 78, 216, 0.95), rgba(30, 64, 175, 0.9))`,
        backgroundSize: 'cover',
        backgroundBlendMode: 'overlay',
      }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à Exploiter Votre Potentiel ?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez OpportuCI aujourd'hui et découvrez les opportunités qui façonneront votre future carrière.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-gray-100 transition shadow-md"
            >
              Commencer Maintenant
            </Link>
            <Link 
              to="/about" 
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-700 transition"
            >
              En Savoir Plus
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;