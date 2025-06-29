import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Items Summary */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border rounded-md shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product || item._id}`}
                        className="text-lg font-medium text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <ul className="space-y-2 text-base text-gray-700">
                <li className="flex justify-between">
                  <span>Items</span>
                  <span>${cart.itemsPrice}</span>
                </li>
                <li className="flex justify-between">
                  <span>Shipping</span>
                  <span>${cart.shippingPrice}</span>
                </li>
                <li className="flex justify-between">
                  <span>Tax</span>
                  <span>${cart.taxPrice}</span>
                </li>
                <li className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${cart.totalPrice}</span>
                </li>
              </ul>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition"
                  onClick={placeOrderHandler}
                  disabled={cart.cartItems.length === 0}
                >
                  Place Order
                </button>
              </div>

              {error && (
                <div className="mt-4">
                  <Message variant="danger">{error.data?.message}</Message>
                </div>
              )}

              {isLoading && <Loader />}
            </div>
          </div>
        )}

        {/* Shipping & Payment Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Shipping</h2>
            <p className="text-gray-700">
              <strong>Address: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
            <p className="text-gray-700">
              <strong>Method: </strong>
              {cart.paymentMethod}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
