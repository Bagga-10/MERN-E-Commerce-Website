import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const colorClass = colorMap[color] || "text-yellow-500";

  return (
    <div className="flex items-center gap-x-1">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className={colorClass} />
      ))}

      {halfStars === 1 && <FaStarHalfAlt className={colorClass} />}

      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className={colorClass} />
      ))}

      {text && (
        <span className="ml-2 text-sm text-gray-700 font-medium">
          {text}
        </span>
      )}
    </div>
  );
};

const colorMap = {
  yellow: "text-yellow-500",
  red: "text-red-500",
  blue: "text-blue-500",
  green: "text-green-500",
};

Ratings.defaultProps = {
  color: "yellow",
};

export default Ratings;
