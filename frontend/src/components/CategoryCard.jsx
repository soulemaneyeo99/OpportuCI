import { Link } from "react-router-dom";
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  TrophyIcon, 
  BookOpenIcon,
  UserGroupIcon,
  HeartIcon,
  SquaresPlusIcon
} from "@heroicons/react/24/outline";

const iconMap = {
  "Scholarship": AcademicCapIcon,
  "Internship": BriefcaseIcon,
  "Competition": TrophyIcon,
  "Training": BookOpenIcon,
  "Job": BriefcaseIcon,
  "Volunteer": HeartIcon,
  "Other": SquaresPlusIcon
};

const bgColorMap = {
  "Scholarship": "bg-blue-100 hover:bg-blue-200",
  "Internship": "bg-green-100 hover:bg-green-200",
  "Competition": "bg-purple-100 hover:bg-purple-200",
  "Training": "bg-yellow-100 hover:bg-yellow-200",
  "Job": "bg-pink-100 hover:bg-pink-200",
  "Volunteer": "bg-orange-100 hover:bg-orange-200",
  "Other": "bg-gray-100 hover:bg-gray-200"
};

const textColorMap = {
  "Scholarship": "text-blue-800",
  "Internship": "text-green-800",
  "Competition": "text-purple-800",
  "Training": "text-yellow-800",
  "Job": "text-pink-800",
  "Volunteer": "text-orange-800",
  "Other": "text-gray-800"
};

const iconColorMap = {
  "Scholarship": "text-blue-500",
  "Internship": "text-green-500",
  "Competition": "text-purple-500",
  "Training": "text-yellow-500",
  "Job": "text-pink-500",
  "Volunteer": "text-orange-500",
  "Other": "text-gray-500"
};

const CategoryCard = ({ category, count }) => {
  const Icon = iconMap[category] || iconMap["Other"];
  const bgColor = bgColorMap[category] || bgColorMap["Other"];
  const textColor = textColorMap[category] || textColorMap["Other"];
  const iconColor = iconColorMap[category] || iconColorMap["Other"];

  return (
    <Link 
      to={`/opportunities?category=${category}`}
      className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-sm transition-all duration-300 ${bgColor}`}
    >
      <div className={`rounded-full p-3 ${bgColor} mb-3`}>
        <Icon className={`h-8 w-8 ${iconColor}`} aria-hidden="true" />
      </div>
      <h3 className={`text-lg font-semibold ${textColor}`}>{category}</h3>
      <p className="text-sm text-gray-600 mt-1">{count} opportunities</p>
    </Link>
  );
};

export default CategoryCard;