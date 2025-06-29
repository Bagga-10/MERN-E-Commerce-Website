import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h2>

    {isLoading ? (
      <Loader />
    ) : error ? (
      <Message variant="danger">
        {error?.data?.error || error.error}
      </Message>
    ) : (
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Delivered</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t hover:bg-gray-50 transition duration-150"
              >
                <td className="px-4 py-4">
                  <img
                    src={order.orderItems[0].image}
                    alt="Order"
                    className="w-16 h-16 object-cover rounded border"
                  />
                </td>

                <td className="px-4 py-4 text-sm text-gray-800">{order._id}</td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {order.createdAt.substring(0, 10)}
                </td>

                <td className="px-4 py-4 font-medium text-gray-800">
                  ${order.totalPrice.toFixed(2)}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      order.isDelivered
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </span>
                </td>

                <td className="px-4 py-4 text-center">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-md transition duration-200">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

};

export default UserOrder;