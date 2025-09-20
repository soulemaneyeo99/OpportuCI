// src/pages/ChatPage.jsx - Page complète de chat
import { useState } from 'react';
import Layout from '../components/Layout';
import GeminiChat from '../components/chat/GeminiChat';
import ConversationsList from '../components/chat/ConversationsList';

const ChatPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedContextType, setSelectedContextType] = useState('general');

  const handleSelectConversation = (conversationId, contextType) => {
    setSelectedConversationId(conversationId);
    setSelectedContextType(contextType || 'general');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Assistant IA OpportuCI
            </h1>
            <p className="text-gray-600">
              Votre conseiller personnel pour carrière, opportunités et compétences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des conversations */}
            <div className="lg:col-span-1">
              <ConversationsList
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversationId}
              />
            </div>

            {/* Chat principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md h-96">
                <GeminiChat
                  contextType={selectedContextType}
                  initialConversationId={selectedConversationId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;