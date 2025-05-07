import { XCircleIcon } from "@heroicons/react/24/solid";

const ErrorAlert = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
              >
                <span className="sr-only">Dismiss</span>
                <XCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;