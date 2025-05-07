
const LoadingSkeleton = ({ type = "card", count = 1 }) => {
  const renderCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded-full w-1/5"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="border-t border-gray-100 pt-3">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/5 mb-2"></div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 flex justify-end">
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="h-7 bg-gray-200 rounded-full w-1/6"></div>
          <div className="h-8 bg-gray-200 rounded-full w-1/4"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="h-14 bg-gray-200 rounded"></div>
          <div className="h-14 bg-gray-200 rounded"></div>
          <div className="h-14 bg-gray-200 rounded"></div>
        </div>
        
        <div className="space-y-3 mb-8">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        
        <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
      </div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      
      <div className="space-y-6">
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/6 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
        
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
          </div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
          </div>
        </div>
        
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/5 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded-md w-full"></div>
        </div>
        
        <div className="flex justify-end">
          <div className="h-10 bg-gray-200 rounded-md w-1/4"></div>
        </div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded-md w-1/6"></div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="bg-gray-50 border-b p-4 grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 bg-gray-200 rounded"></div>
            ))}
          </div>
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="border-b p-4 grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, colIndex) => (
                <div key={colIndex} className="h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const skeletonMap = {
    card: renderCardSkeleton,
    detail: renderDetailSkeleton,
    form: renderFormSkeleton,
    table: renderTableSkeleton,
  };

  const renderSkeleton = skeletonMap[type] || renderCardSkeleton;

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default LoadingSkeleton;