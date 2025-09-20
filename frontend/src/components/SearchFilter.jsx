import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";

const SearchFilter = ({
  filters,
  categories,
  locations,
  onFilterChange,
  onClearFilters
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        {/* Search input */}
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            placeholder="Search opportunities..."
            value={filters.search}
            onChange={handleInputChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Category dropdown */}
        <div className="w-full md:w-48">
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Location dropdown */}
        <div className="w-full md:w-48">
          <select
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Toute localisation</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Sort dropdown */}
        <div className="w-full md:w-48">
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="deadline">Trier par Deadline</option>
            <option value="created">Plus récent</option>
          </select>
        </div>

        {/* Clear filters button */}
        <button
          onClick={onClearFilters}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <XMarkIcon className="h-4 w-4 mr-1" />
          Clear
        </button>
      </div>
      
      {/* Active filters display */}
      {(filters.search || filters.category || filters.location) && (
        <div className="mt-3 flex flex-wrap items-center text-sm text-gray-700">
          <span className="mr-2 flex items-center">
            <FunnelIcon className="h-4 w-4 mr-1" />
            Active filters:
          </span>
          
          {filters.search && (
            <span className="bg-blue-100 text-blue-800 mr-2 px-2 py-0.5 rounded-full flex items-center my-1">
              Search: "{filters.search}"
              <button
                onClick={() => onFilterChange("search", "")}
                className="ml-1.5 text-blue-500 hover:text-blue-700"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          )}
          
          {filters.category && (
            <span className="bg-blue-100 text-blue-800 mr-2 px-2 py-0.5 rounded-full flex items-center my-1">
              {filters.category}
              <button
                onClick={() => onFilterChange("category", "")}
                className="ml-1.5 text-blue-500 hover:text-blue-700"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          )}
          
          {filters.location && (
            <span className="bg-blue-100 text-blue-800 mr-2 px-2 py-0.5 rounded-full flex items-center my-1">
              {filters.location}
              <button
                onClick={() => onFilterChange("location", "")}
                className="ml-1.5 text-blue-500 hover:text-blue-700"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;