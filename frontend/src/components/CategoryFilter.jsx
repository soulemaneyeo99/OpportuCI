
const CategoryFilter = ({ categories, selectedCategory, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Category
      </label>
      <select
        id="category"
        name="category"
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;