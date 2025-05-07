import { Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon, BriefcaseIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

const OpportunityCard = ({ opportunity }) => {
  const {
    id,
    title,
    organization,
    description,
    category,
    deadline,
    location,
    is_verified,
    created_at,
  } = opportunity;

  // Calculate days remaining until deadline
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const isExpired = deadlineDate < today;
  const timeRemaining = formatDistanceToNow(deadlineDate, { addSuffix: true });

  // Truncate description
  const truncatedDescription = 
    description.length > 120 
      ? `${description.substring(0, 120)}...` 
      : description;

  // Category badge color mapping
  const categoryColors = {
    Scholarship: "bg-purple-100 text-purple-800",
    Internship: "bg-blue-100 text-blue-800",
    Job: "bg-green-100 text-green-800",
    Training: "bg-yellow-100 text-yellow-800",
    Competition: "bg-red-100 text-red-800",
    Event: "bg-indigo-100 text-indigo-800",
    Volunteering: "bg-pink-100 text-pink-800",
  };

  const categoryColor = categoryColors[category] || "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColor}`}>
            {category}
          </span>
          {is_verified && (
            <span className="flex items-center text-xs text-green-700">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Verified
            </span>
          )}
        </div>
        
        <Link to={`/opportunities/${id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-4">{truncatedDescription}</p>
        
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <BriefcaseIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span>{organization}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span>{location}</span>
          </div>
          
          <div className={`flex items-center text-sm ${isExpired ? 'text-red-500' : 'text-gray-500'} mt-1`}>
            <CalendarIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="font-medium">
              {isExpired ? "Expired " : "Deadline: "}{timeRemaining}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-2 text-right">
        <Link 
          to={`/opportunities/${id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View details →
        </Link>
      </div>
    </div>
  );
};

export default OpportunityCard;