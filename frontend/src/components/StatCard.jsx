const StatCard = ({ title, value, description, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
            {icon} {/* ✅ on affiche le JSX tel quel */}
          </div>
        </div>
        <div className="ml-5">
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dd className="flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            {description && (
              <div className="ml-2 text-sm text-gray-600">{description}</div>
            )}
          </dd>
        </div>
      </div>
    </div>
  );
};
// StatCard.jsx
export default StatCard;