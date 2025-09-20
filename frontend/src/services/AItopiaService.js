// /**
//  * Service pour gérer les appels à l'API AItopia
//  */
// import axios from 'axios';

// // Création d'une instance axios spécifique pour AItopia
// const aitopiaClient = axios.create({
//   // Utilisation du proxy configuré dans vite.config.js
//   baseURL: '/extensions-api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 60000 // 60 secondes de timeout
// });

// // Intercepteur pour le logging et débogage
// aitopiaClient.interceptors.request.use(
//   (config) => {
//     console.log(`Requête AItopia vers: ${config.url}`);
//     return config;
//   },
//   (error) => {
//     console.error('Erreur requête AItopia:', error);
//     return Promise.reject(error);
//   }
// );

// aitopiaClient.interceptors.response.use(
//   (response) => {
//     console.log(`Réponse AItopia de ${response.config.url} réussie`);
//     return response;
//   },
//   (error) => {
//     console.error(`Erreur réponse AItopia:`, error.message);
//     return Promise.reject(error);
//   }
// );

// // Service d'API AItopia
// export const AItopiaService = {
//   // Récupération des prompts
//   getPrompts: async () => {
//     try {
//       const response = await aitopiaClient.post('/ai/prompts');
//       return response.data;
//     } catch (error) {
//       console.error('Erreur lors de la récupération des prompts:', error);
//       return null;
//     }
//   },

//   // Récupération des paramètres du modèle
//   getModelSettings: async () => {
//     try {
//       const response = await aitopiaClient.post('/ai/model_settings');
//       return response.data;
//     } catch (error) {
//       console.error('Erreur lors de la récupération des paramètres du modèle:', error);
//       return null;
//     }
//   },

//   // Récupération de la clé d'application
//   getAppKey: async () => {
//     try {
//       const response = await aitopiaClient.post('/extensions/app/get_key');
//       return response.data;
//     } catch (error) {
//       console.error('Erreur lors de la récupération de la clé d\'application:', error);
//       return null;
//     }
//   },

//   // Récupération des langues
//   getLanguages: async (lang = 'fr') => {
//     try {
//       const response = await aitopiaClient.post(`/languages/lang/get/lang/${lang}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de la récupération des langues pour ${lang}:`, error);
//       return null;
//     }
//   }
// };

// export default AItopiaService;