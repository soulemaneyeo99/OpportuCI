// frontend/src/components/FloatingChatBot.jsx - Version finale avec votre API

import { useState, useRef, useEffect } from 'react';
import { ChatAPI } from '../services/api';

const FloatingChatBot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [typing, setTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [theme] = useState({
    primary: 'bg-orange-600',
    secondary: 'bg-indigo-100',
    hover: 'hover:bg-green-400',
    ring: 'focus:ring-indigo-400',
    button: 'bg-indigo-500',
    buttonHover: 'hover:bg-green-400',
  });
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Effet pour faire défiler automatiquement vers le dernier message
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);
  
  // Effet pour mettre le focus sur l'input quand le chat s'ouvre
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [open]);

  // Charger l'historique de conversation au premier chargement
  useEffect(() => {
    if (open && conversation.length === 0) {
      loadConversationHistory();
    }
  }, [open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setOpen(!open);
    setError(null);
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const loadConversationHistory = async () => {
    try {
      const data = await ChatAPI.getHistory(conversationId);
      
      // Convertir les messages de l'API au format de votre ancien chat
      const formattedMessages = data.messages.map(msg => ({
        type: msg.role === 'user' ? 'question' : 'answer',
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        id: msg.id
      }));
      setConversation(formattedMessages);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      // Ne pas afficher d'erreur pour l'historique, c'est pas critique
    }
  };

  const simulateTyping = (answer) => {
    setTyping(true);
    let displayedResponse = '';
    let i = 0;
    
    // Simulation de la frappe progressive (effet de typing)
    const typingInterval = setInterval(() => {
      if (i < answer.length) {
        displayedResponse += answer.charAt(i);
        setConversation(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { 
            ...updated[updated.length - 1], 
            content: displayedResponse 
          };
          return updated;
        });
        i++;
      } else {
        clearInterval(typingInterval);
        setTyping(false);
      }
    }, 15); // Vitesse de frappe
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;

    setLoading(true);
    setError(null);
    
    try {
      // Ajouter le message utilisateur immédiatement
      const userMessage = {
        type: 'question', 
        content: trimmedQuestion, 
        timestamp: new Date(),
        id: `user-${Date.now()}`
      };
      
      const updatedConversation = [...conversation, userMessage];
      setConversation(updatedConversation);
      setQuestion('');

      // Ajouter un message temporaire pour le bot
      const tempBotMessage = { 
        type: 'answer', 
        content: '', 
        timestamp: new Date(),
        id: `bot-${Date.now()}`
      };
      const tempConversation = [...updatedConversation, tempBotMessage];
      setConversation(tempConversation);

      // Appel à l'API Gemini via votre ChatAPI
      const result = await ChatAPI.sendMessage(trimmedQuestion, conversationId, 'general');

      if (result.success) {
        // Mettre à jour l'ID de conversation si c'est nouveau
        if (!conversationId && result.conversation_id) {
          setConversationId(result.conversation_id);
        }

        // Simuler la frappe du bot pour une expérience plus naturelle
        simulateTyping(result.response);
      } else {
        setError(result.error || 'Erreur lors de la communication avec l\'assistant');
        // Supprimer le message temporaire en cas d'erreur
        setConversation(prev => [
          ...prev.slice(0, -1),
          {
            type: 'error',
            content: result.error || 'Une erreur est survenue lors de la communication avec l\'assistant. Veuillez réessayer.',
            timestamp: new Date(),
            id: `error-${Date.now()}`
          },
        ]);
        setTyping(false);
      }
    } catch (err) {
      console.error('Erreur de communication avec le chatbot:', err);
      setError('Erreur de connexion');
      setConversation(prev => [
        ...prev.slice(0, -1), // Supprimer le message temporaire
        {
          type: 'error',
          content: 'Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.',
          timestamp: new Date(),
          id: `error-${Date.now()}`
        },
      ]);
      setTyping(false);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearConversation = async () => {
    try {
      // Créer une nouvelle conversation
      const newConversation = await ChatAPI.createConversation('general');
      setConversationId(newConversation.conversation_id);
      setConversation([]);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la création d\'une nouvelle conversation:', error);
      // Fallback: juste nettoyer localement
      setConversation([]);
      setConversationId(null);
      setError(null);
    }
  };

  return (
    <>
      {/* Bouton flottant avec animation */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 ${theme.primary} ${theme.hover} text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 ${theme.ring} transition-all duration-300 transform ${open ? 'rotate-90' : 'hover:scale-110'}`}
        aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {open ? (
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6l5 5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h3z" />
          </svg>
        )}
      </button>

      {/* Fenêtre de discussion avec transition */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] flex flex-col bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-2xl rounded-xl z-50 overflow-hidden animate-fadeIn">
          {/* Header du chatbot */}
          <div className={`${theme.primary} text-white p-4 font-semibold flex items-center justify-between shadow-md`}>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6l5 5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h3z" />
                </svg>
                <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-400 rounded-full"></span>
              </div>
              <div>
                <span className="text-lg">Assistant OpportuCI</span>
                <div className="text-xs opacity-80">Propulsé par Gemini AI</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Bouton pour effacer la conversation */}
              <button 
                onClick={clearConversation}
                className="text-white hover:text-gray-200 transition-colors p-1"
                title="Nouvelle conversation"
                aria-label="Nouvelle conversation"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              <button 
                onClick={toggleChat} 
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Fermer le chat"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Indicateur d'erreur si présent */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 text-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Zone de conversation avec défilement */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 text-sm">
            {conversation.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 space-y-4 p-6">
                <div className={`${theme.secondary} p-3 rounded-full`}>
                  <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Comment puis-je vous aider aujourd'hui ?</h3>
                  <p className="text-sm">
                    Posez une question sur les opportunités d'études, stages, 
                    formations ou demandez des conseils de carrière personnalisés.
                  </p>
                  <div className="mt-4 text-xs text-gray-400">
                    Suggestions:
                    <div className="mt-2 space-y-1">
                      <button 
                        onClick={() => setQuestion("Comment devenir développeur web en Côte d'Ivoire ?")}
                        className="block w-full text-left px-3 py-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        "Comment devenir développeur web en Côte d'Ivoire ?"
                      </button>
                      <button 
                        onClick={() => setQuestion("Quelles sont les opportunités en agriculture moderne ?")}
                        className="block w-full text-left px-3 py-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        "Quelles sont les opportunités en agriculture moderne ?"
                      </button>
                      <button 
                        onClick={() => setQuestion("Comment améliorer mon CV pour le marché ivoirien ?")}
                        className="block w-full text-left px-3 py-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        "Comment améliorer mon CV pour le marché ivoirien ?"
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex ${msg.type === 'question' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg shadow-sm 
                      ${msg.type === 'question' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : msg.type === 'error'
                          ? 'bg-red-100 text-red-700 rounded-tl-none' 
                          : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-tl-none'
                      }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium text-xs">
                          {msg.type === 'question' ? 'Vous' : msg.type === 'error' ? 'Erreur' : 'Assistant IA'}
                        </p>
                        {msg.timestamp && (
                          <span className="text-xs opacity-70 ml-2">
                            {formatTime(msg.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg max-w-[80%] flex space-x-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie avec animations */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-300 dark:border-gray-700 p-3 flex items-center gap-2 bg-white dark:bg-gray-800"
          >
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={handleQuestionChange}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              className="flex-1 px-4 py-2 text-sm border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white transition-all duration-200"
              disabled={loading && !typing}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className={`${theme.button} ${theme.buttonHover} text-white rounded-full p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-10 w-10`}
              aria-label="Envoyer le message"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5 text-white transform rotate-90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Styles globaux pour les animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default FloatingChatBot;