import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">
          Your cart is empty.{" "}
          <Link to="/shop" className="text-pink-500 underline">
            Go To Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white shadow-sm p-4 mb-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-semibold text-pink-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-600">{item.brand}</p>
                    <p className="text-md font-medium text-gray-800 mt-1">
                      ${item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-32 mr-5">
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                    className="w-full p-1 border rounded text-black mr-5"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove item"
                  >
                    <FaTrash size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-1/3 bg-gray-100 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Total Items:</span>
              <span>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total Price:</span>
              <span>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </span>
            </div>
            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-md transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
