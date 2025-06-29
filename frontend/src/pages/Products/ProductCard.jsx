import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineArrowRight } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = (product, qty) => {
    const alreadyInCart = cartItems.some((item) => item._id === product._id);
    if (alreadyInCart) {
      toast.info("Item is already in the cart", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      dispatch(addToCart({ ...product, qty }));
      toast.success("Item added to cart", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 border border-gray-200 max-w-sm relative">
      {/* Product Image */}
      <div className="relative">
        <Link to={`/product/${p._id}`}>
          <img
            src={p.image || "/placeholder.png"}
            alt={p.name}
            className="w-full h-[180px] object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-xs font-medium px-3 py-1 rounded-full">
            {p?.brand}
          </span>
        </Link>
        {userInfo && <HeartIcon product={p} />}
      </div>

      {/* Product Content */}
      <div className="p-5 text-gray-800">
        {/* Title & Price */}
        <div className="flex justify-between items-center mb-3">
          <h5 className="text-lg font-semibold truncate">{p?.name}</h5>
          <span className="text-pink-600 font-bold text-md">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {p?.description?.substring(0, 60)}...
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="flex items-center text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Read More
            <AiOutlineArrowRight className="ml-2" size={16} />
          </Link>

          <button
            onClick={() => addToCartHandler(p, 1)}
            type="button"
            className="text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            // title="Add to Cart"
          >
            <AiOutlineShoppingCart size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
