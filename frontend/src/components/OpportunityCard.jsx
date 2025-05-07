import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const OpportunityCard = ({ opportunity }) => {
  const {
    id,
    title,
    organization,
    category,
    deadline,
    location,
    is_verified,
    created_at,
  } = opportunity;

  // Format the deadline date
  const formatDeadline = (date) => {
    try {
      const deadlineDate = new Date(date);
      const today = new Date();
      
      if (isNaN(deadlineDate)) {
        return 'No deadline';
      }
      
      if (deadlineDate < today) {
        return 'Expired';
      }
      
      return formatDistanceToNow(deadlineDate, { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Map category to icon and color
  const getCategoryInfo = (categoryName) => {
    const categories = {
      'Scholarship': { icon: '🎓', color: 'bg-blue-100 text-blue-800' },
      'Internship': { icon: '💼', color: 'bg-green-100 text-green-800' },
      'Competition': { icon: '🏆', color: 'bg-yellow-100 text-yellow-800' },
      'Training': { icon: '📚', color: 'bg-purple-100 text-purple-800' },
      'Job': { icon: '🔧', color: 'bg-red-100 text-red-800' },
      'Volunteering': { icon: '🤝', color: 'bg-indigo-100 text-indigo-800' },
    };

    return categories[categoryName] || { icon: '📋', color: 'bg-gray-100 text-gray-800' };
  };

  const categoryInfo = getCategoryInfo(category);
  const deadlineText = formatDeadline(deadline);
  const isExpired = deadlineText === 'Expired';

  return (
    <Link 
      to={`/opportunities/${id}`}
      className={`block bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
        isExpired ? 'opacity-75' : ''
      }`}
    >
      <div className="p-5">
        {/* Top row with category and verification */}
        <div className="flex justify-between items-center mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
            {categoryInfo.icon} {category}
          </span>
          
          {is_verified && (
            <span className="flex items-center text-green-600" title="Verified Opportunity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        
        {/* Opportunity title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        
        {/* Organization */}
        <div className="flex items-center mb-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-sm truncate">{organization}</span>
        </div>
        
        {/* Location */}
        {location && (
          <div className="flex items-center mb-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm truncate">{location}</span>
          </div>
        )}
        
        {/* Divider */}
        <div className="border-t border-gray-100 my-3"></div>
        
        {/* Deadline */}
        <div className="flex justify-between items-center">
          <div className={`flex items-center ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">
              {isExpired ? 'Expired' : `Deadline: ${deadlineText}`}
            </span>
          </div>
          
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            onClick={(e) => {
              e.preventDefault(); // Prevent link navigation
              // You could implement a save/bookmark feature here
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Link>
  );
};

export default OpportunityCard;