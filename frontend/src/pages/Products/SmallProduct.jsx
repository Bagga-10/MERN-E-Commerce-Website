import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { useSelector } from "react-redux";

const SmallProduct = ({ product, className = "ml-[5rem]" }) => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div
      className={`w-80 my-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
        />
        {userInfo && <HeartIcon product={product} />}
      </div>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors duration-300">
              {product.name}
            </h2>
            <span className="bg-pink-100 text-pink-800 font-semibold text-sm px-2 py-1 rounded-full">
              ${product.price}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
