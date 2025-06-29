import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import { useEffect } from "react";

const OrderList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminMenu />

      <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-pink-100 text-gray-700 text-sm uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Items</th>
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Paid</th>
                <th className="text-left px-4 py-3">Delivered</th>
                <th className="text-left px-4 py-3"></th>
              </tr>
            </thead>

            <tbody className="text-gray-700 text-sm">
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`border-b hover:bg-pink-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <img
                      src={order.orderItems[0].image}
                      alt={order._id}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>

                  <td className="px-4 py-3">{order._id}</td>

                  <td className="px-4 py-3">{order.user?.username || "N/A"}</td>

                  <td className="px-4 py-3">
                    {order.createdAt?.substring(0, 10) || "N/A"}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    ${order.totalPrice}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.isPaid ? "Completed" : "Pending"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.isDelivered
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.isDelivered ? "Completed" : "Pending"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition duration-200 text-sm font-medium">
                        View
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

export default OrderList;
