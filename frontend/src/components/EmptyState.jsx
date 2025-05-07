import { InboxIcon } from "@heroicons/react/24/outline";

const EmptyState = ({
  title = "No results found",
  description = "We couldn't find any matches for your search. Try adjusting your filters or check back later.",
  icon = InboxIcon,
  action = null,
  actionText = "Clear filters",
  customIcon = null,
}) => {
  const Icon = icon;
  
  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-center">
          {customIcon ? (
            customIcon
          ) : (
            <Icon className="h-16 w-16 text-gray-400" aria-hidden="true" />
          )}
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        
        {action && (
          <div className="mt-6">
            <button
              onClick={action}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;