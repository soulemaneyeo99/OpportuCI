import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ErrorDisplay = ({
  message = "Something went wrong. Please try again later.",
  retryAction = null,
  retryText = "Try Again",
  icon = ExclamationTriangleIcon,
}) => {
  const Icon = icon;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto my-8">
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-100 p-3 rounded-full mb-4">
          <Icon className="h-8 w-8 text-red-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {retryAction && (
          <button
            onClick={retryAction}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;