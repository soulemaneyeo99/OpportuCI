import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import OpportunityCard from "../components/OpportunityCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { 
  AcademicCapIcon, 
  BriefcaseIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import api from "../services/api";

const Home = () => {
  // État initial optimisé
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Statistiques avec valeurs réalistes pour la Côte d'Ivoire
  const [stats] = useState({
    opportunities: 1560,
    organizations: 92,
    scholarships: 210,
    internships: 430,
    users: 6870,
    aiMatches: 2350
  });

  // Animation des compteurs
  const [animatedStats, setAnimatedStats] = useState({
    opportunities: 0,
    organizations: 0,
    scholarships: 0,
    internships: 0,
    users: 0,
    aiMatches: 0
  });

  // Données structurées pour un meilleur maintien
  const platformData = {
    impactMetrics: [
      {
        icon: <UserGroupIcon className="h-8 w-8 text-emerald-600" />,
        title: "Talents Connectés",
        value: animatedStats.users,
        suffix: "+",
        description: "Jeunes accompagnés"
      },
      {
        icon: <BriefcaseIcon className="h-8 w-8 text-blue-600" />,
        title: "Opportunités",
        value: animatedStats.opportunities,
        suffix: "+",
        description: "Offres vérifiées"
      },
      {
        icon: <AcademicCapIcon className="h-8 w-8 text-purple-600" />,
        title: "Bourses",
        value: animatedStats.scholarships,
        suffix: "+",
        description: "Financements disponibles"
      },
      {
        icon: <SparklesIcon className="h-8 w-8 text-amber-500" />,
        title: "Matchs IA",
        value: animatedStats.aiMatches,
        suffix: "+",
        description: "Recommandations mensuelles"
      }
    ],
    features: [
      {
        icon: <SparklesIcon className="h-10 w-10 text-blue-600" />,
        title: "Recommandation IA",
        description: "Notre algorithme analyse votre profil pour des suggestions ultra-personnalisées.",
        color: "bg-blue-50 border-blue-100"
      },
      {
        icon: <ShieldCheckIcon className="h-10 w-10 text-emerald-600" />,
        title: "Validation Humaine",
        description: "Chaque opportunité est vérifiée par notre équipe avant publication.",
        color: "bg-emerald-50 border-emerald-100"
      },
      {
        icon: <ChartBarIcon className="h-10 w-10 text-purple-600" />,
        title: "Analytique Avancée",
        description: "Suivez vos candidatures et optimisez vos chances de succès.",
        color: "bg-purple-50 border-purple-100"
      }
    ],
    processSteps: [
      {
        step: "1",
        title: "Créez Votre Profil",
        description: "Décrivez vos compétences et aspirations professionnelles.",
        icon: <UserGroupIcon className="h-6 w-6" />
      },
      {
        step: "2",
        title: "Recevez des Offres",
        description: "Obtenez des recommandations personnalisées par notre IA.",
        icon: <LightBulbIcon className="h-6 w-6" />
      },
      {
        step: "3",
        title: "Postulez en Confiance",
        description: "Candidatez avec des outils optimisés pour maximiser vos chances.",
        icon: <CheckCircleIcon className="h-6 w-6" />
      }
    ],
    testimonials: [
      {
        name: "Aminata K.",
        role: "Étudiante en Informatique",
        text: "Grâce à OpportuCI, j'ai découvert un stage parfaitement adapté à mon profil.",
        avatar: "AK"
      },
      {
        name: "Kouamé D.",
        role: "Jeune Diplômé",
        text: "La plateforme m'a guidé vers une formation qui a boosté mon employabilité.",
        avatar: "KD"
      },
      {
        name: "Fatou B.",
        role: "Professionnelle en Reconversion",
        text: "Les recommandations IA m'ont aidé à trouver un emploi dans un nouveau domaine.",
        avatar: "FB"
      }
    ]
  };

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.GenericAPI.get('/opportunities/featured/');
        setFeaturedOpportunities(response?.data || []);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError("Une erreur est survenue. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Animation des statistiques
    const animateValues = (duration = 2000) => {
      const startTime = Date.now();
      
      const animate = () => {
        const progress = Math.min((Date.now() - startTime) / duration, 1);
        
        setAnimatedStats({
          opportunities: Math.floor(stats.opportunities * progress),
          organizations: Math.floor(stats.organizations * progress),
          scholarships: Math.floor(stats.scholarships * progress),
          internships: Math.floor(stats.internships * progress),
          users: Math.floor(stats.users * progress),
          aiMatches: Math.floor(stats.aiMatches * progress)
        });

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };

    const timer = setTimeout(animateValues, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Hero Section - Version optimisée */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBmaWxsPSJub25lIi8+PC9zdmc+')]"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span className="text-sm">Plateforme 100% ivoirienne</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Boostez votre carrière avec <span className="text-yellow-400">l'IA</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              OpportuCI révolutionne l'accès aux opportunités professionnelles en Côte d'Ivoire grâce à l'intelligence artificielle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="/register" 
                className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Commencer gratuitement
              </a>
              <a 
                href="/ai-demo" 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 font-semibold rounded-lg transition"
              >
                Voir la démo IA
              </a>
            </div>
            
            <div className="flex items-center justify-center text-blue-200 text-sm">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Sécurisé • Personnalisé • Efficace
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics - Design épuré */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre impact en chiffres
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des milliers de jeunes Ivoiriens ont déjà transformé leur carrière
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platformData.impactMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                <div className="flex justify-center mb-3">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {metric.value.toLocaleString()}{metric.suffix}
                </div>
                <div className="text-gray-700 font-medium">
                  {metric.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Mise en valeur de l'IA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              La puissance de l'IA au service de votre carrière
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Découvrez comment notre technologie intelligente vous donne un avantage compétitif
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {platformData.features.map((feature, index) => (
              <div key={index} className={`p-8 rounded-xl border ${feature.color} hover:shadow-md transition-all`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Étapes claires */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transformez votre carrière en seulement 3 étapes simples
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gray-200 z-0"></div>
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {platformData.processSteps.map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mr-4">
                      {step.icon}
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-gray-600 pl-14">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Design moderne */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez ce que disent les jeunes talents ivoiriens
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {platformData.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities - Section optimisée */}
      {featuredOpportunities.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div className="mb-4 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-900">
                  Opportunités sélectionnées
                </h2>
                <p className="text-gray-600">
                  Recommandées par notre algorithme IA
                </p>
              </div>
              <a 
                href="/opportunities" 
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir toutes <ArrowRightIcon className="ml-2 h-4 w-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOpportunities.slice(0, 3).map((opportunity, index) => (
                <OpportunityCard 
                  key={opportunity.id || index}
                  opportunity={opportunity}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final - Conversion optimisée */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à booster votre carrière ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Rejoignez la première plateforme intelligente d'opportunités en Côte d'Ivoire
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/register" 
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold rounded-lg transition shadow-lg"
            >
              S'inscrire gratuitement
            </a>
            <a 
              href="/opportunities" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 font-medium rounded-lg transition"
            >
              Explorer les offres
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;