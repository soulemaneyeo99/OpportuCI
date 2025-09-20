// src/components/networking/VirtualEventCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, UsersIcon, PlayCircleIcon, MapPinIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const VirtualEventCard = ({ event, onRegister }) => {
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(event.is_registered);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await onRegister(event.id);
      setRegistered(true);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    } finally {
      setRegistering(false);
    }
  };

  const eventDate = new Date(event.start_time);
  const isUpcoming = eventDate > new Date();
  const isLive = new Date() >= eventDate && new Date() <= new Date(event.end_time);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      <div className="relative">
        <div className={`h-48 bg-gradient-to-br ${
          event.event_type === 'webinar' ? 'from-blue-500 to-blue-700' :
          event.event_type === 'workshop' ? 'from-green-500 to-green-700' :
          event.event_type === 'networking' ? 'from-purple-500 to-purple-700' :
          'from-gray-500 to-gray-700'
        } relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Badge de statut */}
          <div className="absolute top-4 left-4">
            {isLive ? (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                EN DIRECT
              </span>
            ) : isUpcoming ? (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                À VENIR
              </span>
            ) : (
              <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                TERMINÉ
              </span>
            )}
          </div>

          {/* Type d'événement */}
          <div className="absolute top-4 right-4">
            <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
              {event.event_type_display}
            </span>
          </div>

          {/* Icône centrale */}
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircleIcon className="w-16 h-16 text-white opacity-60" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4" />
            <span>
              {format(eventDate, 'PPP à HH:mm', { locale: fr })}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <UsersIcon className="w-4 h-4" />
            <span>
              {event.registered_count} inscrits
              {event.max_participants && ` / ${event.max_participants}`}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4" />
            <span className="capitalize">{event.platform}</span>
          </div>
        </div>

        {/* Intervenants */}
        {event.speakers && event.speakers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Intervenants:</h4>
            <div className="flex -space-x-2">
              {event.speakers.slice(0, 3).map((speaker, index) => (
                <div key={index} className="relative">
                  <img
                    src={speaker.avatar || '/default-avatar.jpg'}
                    alt={speaker.name}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
                  />
                </div>
              ))}
              {event.speakers.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                  +{event.speakers.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          {registered ? (
            <button
              disabled
              className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-lg font-medium flex items-center justify-center"
            >
              <StarIcon className="w-4 h-4 mr-2" />
              Inscrit
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              disabled={registering || !isUpcoming}
              className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center ${
                !isUpcoming
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {registering ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              {!isUpcoming ? 'Terminé' : registering ? 'Inscription...' : 'S\'inscrire'}
            </motion.button>
          )}

          {isLive && registered && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(event.meeting_link, '_blank')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center"
            >
              <PlayCircleIcon className="w-4 h-4 mr-1" />
              Rejoindre
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export {
  VirtualEventCard,
};