import { Link } from 'react-router-dom';
import { 
  Target, 
  Globe, 
  BookOpen, 
  Users, 
  Brain, 
  TrendingUp, 
  Mail, 
  Shield, 
  Heart,
  Award,
  Lightbulb,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const About = () => {
  const orangeCI = "#FF8200";
  const greenCI = "#009A44";

  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Opportunités vérifiées",
      description: "Toutes les offres sont vérifiées par notre équipe pour garantir leur authenticité et leur pertinence."
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Formations & Roadmaps",
      description: "Des parcours personnalisés et des formations adaptées aux réalités du marché africain."
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Assistant IA carrière",
      description: "Un accompagnement intelligent pour vous guider dans vos choix de carrière et candidatures."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Communauté active",
      description: "Rejoignez une communauté d'ambition où l'entraide et le partage d'expériences sont au cœur."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Opportunités référencées", icon: <Target className="h-6 w-6" /> },
    { number: "5,000+", label: "Jeunes accompagnés", icon: <Users className="h-6 w-6" /> },
    { number: "15", label: "Pays couverts", icon: <Globe className="h-6 w-6" /> },
    { number: "95%", label: "Taux de satisfaction", icon: <Star className="h-6 w-6" /> }
  ];

  const testimonials = [
    {
      name: "Aminata K.",
      role: "Étudiante en Informatique, Abidjan",
      content: "Grâce à OpportuCI, j'ai décroché une bourse d'études au Canada. La plateforme m'a aidée à préparer mon dossier et à découvrir des opportunités que je n'aurais jamais trouvées ailleurs.",
      avatar: "A"
    },
    {
      name: "Kouadio M.",
      role: "Jeune entrepreneur, Bouaké",
      content: "L'assistant IA m'a orienté vers les bonnes formations en entrepreneuriat. Aujourd'hui, mon startup emploie 12 personnes. OpportuCI change vraiment des vies !",
      avatar: "K"
    },
    {
      name: "Fatou S.",
      role: "Développeuse Web, Dakar",
      content: "Les roadmaps tech d'OpportuCI sont exceptionnelles. J'ai suivi leur parcours développement web et j'ai trouvé mon premier emploi en 6 mois.",
      avatar: "F"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: orangeCI }}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              À propos d'<span className="text-white">OpportuCI</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              La plateforme qui révolutionne l'accès aux opportunités pour la jeunesse africaine francophone
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white bg-transparent hover:bg-white hover:text-orange-500 font-medium rounded-lg transition-all duration-200"
              >
                Rejoindre la communauté
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/opportunities"
                className="inline-flex items-center px-8 py-3 bg-white text-orange-500 hover:bg-gray-100 font-medium rounded-lg transition-all duration-200"
              >
                Découvrir les opportunités
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: `${orangeCI}20` }}>
              <Target className="h-8 w-8" style={{ color: orangeCI }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Notre Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Démocratiser l'accès aux opportunités de développement personnel et professionnel pour tous les jeunes d'Afrique francophone, en créant un écosystème où le talent rencontre l'opportunité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pourquoi OpportuCI existe ?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 mt-1 mr-3" style={{ color: greenCI }} />
                  <p className="text-gray-700">
                    <strong>Inégalité d'accès :</strong> Trop de jeunes talents passent à côté d'opportunités par manque d'information ou de réseau.
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 mt-1 mr-3" style={{ color: greenCI }} />
                  <p className="text-gray-700">
                    <strong>Information dispersée :</strong> Les opportunités sont éparpillées sur différentes plateformes, souvent en langues étrangères.
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 mt-1 mr-3" style={{ color: greenCI }} />
                  <p className="text-gray-700">
                    <strong>Manque d'accompagnement :</strong> Beaucoup abandonnent faute de guidance personnalisée dans leurs démarches.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-green-50 p-8 rounded-2xl">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Notre Vision</h4>
              <p className="text-gray-700 mb-6">
                Faire de l'Afrique francophone un terreau d'opportunités où chaque jeune, peu importe son origine ou sa situation, peut accéder aux ressources nécessaires pour construire l'avenir qu'il mérite.
              </p>
              <div className="flex items-center">
                <Heart className="h-6 w-6 mr-2" style={{ color: orangeCI }} />
                <span className="font-medium text-gray-900">Équité • Ambition • Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ce que nous offrons</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme complète conçue spécialement pour répondre aux besoins de la jeunesse africaine
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: `${orangeCI}20` }}>
                  <div style={{ color: orangeCI }}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: `${greenCI}20` }}>
                <Brain className="h-8 w-8" style={{ color: greenCI }} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                L'IA au service de votre avenir
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Notre assistant IA comprend le contexte africain et vous accompagne personnellement dans votre parcours professionnel.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Lightbulb className="h-6 w-6 mr-3" style={{ color: orangeCI }} />
                  <span className="text-gray-700">Recommandations d'opportunités personnalisées</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-6 w-6 mr-3" style={{ color: orangeCI }} />
                  <span className="text-gray-700">Aide à la rédaction de lettres de motivation</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3" style={{ color: orangeCI }} />
                  <span className="text-gray-700">Conseils carrière adaptés au marché local</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-6 w-6 mr-3" style={{ color: orangeCI }} />
                  <span className="text-gray-700">Vérification de la crédibilité des offres</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: orangeCI }}>
                    IA
                  </div>
                  <span className="ml-3 font-medium text-gray-900">Assistant OpportuCI</span>
                </div>
                <p className="text-gray-700 italic">
                  "Bonjour ! Je vois que vous cherchez des bourses en informatique. Basé sur votre profil, je vous recommande 3 programmes parfaitement adaptés à votre parcours. Voulez-vous que je vous aide à préparer vos candidatures ?"
                </p>
              </div>
              <p className="text-sm text-gray-600 text-center">
                💡 Notre IA parle votre langue et comprend votre contexte
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16" style={{ backgroundColor: `${orangeCI}10` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">OpportuCI en chiffres</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: orangeCI }}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ce que disent nos utilisateurs</h2>
            <p className="text-xl text-gray-600">
              Des témoignages authentiques de jeunes qui ont transformé leur avenir avec OpportuCI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium mr-4" style={{ backgroundColor: orangeCI }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" style={{ color: orangeCI }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Vision Section */}
      <div className="py-20" style={{ backgroundColor: greenCI }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6">
            <TrendingUp className="h-8 w-8" style={{ color: greenCI }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Nos ambitions pour demain</h2>
          <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
            Nous ne nous arrêtons pas là. Notre vision est de faire d'OpportuCI le pont entre le potentiel africain et les opportunités mondiales, en développant des partenariats stratégiques avec les universités, entreprises et organisations internationales.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <Award className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Expansion continentale</h3>
              <p className="text-white/80">Couvrir tous les pays d'Afrique francophone d'ici 2026</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <Users className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">100,000 jeunes</h3>
              <p className="text-white/80">Accompagner 100,000 jeunes dans leur réussite professionnelle</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <Globe className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Partenariats globaux</h3>
              <p className="text-white/80">Créer des ponts avec les meilleures institutions mondiales</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à transformez votre avenir ?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Rejoignez des milliers de jeunes qui ont déjà fait le choix de l'excellence avec OpportuCI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 font-medium rounded-lg transition-all duration-200 text-white hover:text-gray-100"
              style={{ backgroundColor: orangeCI }}
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/opportunities"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white font-medium rounded-lg transition-all duration-200"
            >
              Explorer les opportunités
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Footer */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Restons en contact</h3>
              <p className="text-gray-600 mb-6">
                Vous avez des questions, suggestions ou souhaitez établir un partenariat ? 
                Nous sommes toujours ravis d'échanger avec notre communauté.
              </p>
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 mr-3" style={{ color: orangeCI }} />
                <span className="text-gray-700">contact@opportunci.com</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-6 w-6 mr-3" style={{ color: orangeCI }} />
                <span className="text-gray-700">Abidjan, Côte d'Ivoire</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Suivez-nous</h3>
              <p className="text-gray-600 mb-6">
                Restez informé des dernières opportunités et actualités en nous suivant sur nos réseaux sociaux.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-200" style={{ backgroundColor: orangeCI }}>
                  <span className="font-bold">f</span>
                </a>
                <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-200" style={{ backgroundColor: orangeCI }}>
                  <span className="font-bold">in</span>
                </a>
                <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-200" style={{ backgroundColor: orangeCI }}>
                  <span className="font-bold">tw</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;