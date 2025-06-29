import { Link } from "react-router";
import HeartIcon from "./HeartIcon";
import { useSelector } from "react-redux";

const Product = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 p-4 w-full h-full">
      <div className="relative h-60 w-full overflow-hidden rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {userInfo && <HeartIcon product={product} />}
      </div>

      <div className="mt-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
