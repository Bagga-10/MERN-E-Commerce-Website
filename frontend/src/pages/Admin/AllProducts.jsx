import { Link } from "react-router-dom"; // FIXED: use react-router-dom
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();

  useEffect(() => {
    refetch(); // Optional: If you really want fresh data on mount
  }, [refetch]);

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading products.</div>;

  return (
    <div className="container mx-auto px-4 md:flex gap-4 mt-6 ">
      {/* Sidebar */}
      <aside className=" ml-[10rem] mb-6 md:mb-0">
        <AdminMenu />
      </aside>

      {/* Products Section */}
      <main className="md:w-3/4">
        <h2 className="text-2xl font-bold mb-6">
          All Products ({products?.length || 0})
        </h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition p-4 flex gap-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-md border"
              />

              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Added: {moment(product.createdAt).format("MMMM Do YYYY")}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {product.description?.substring(0, 100)}...
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/admin/product/update/${product._id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded hover:bg-pink-700 transition"
                  >
                     <span className="mr-2">Update product</span><FaArrowRight />
                  </Link>
                  <span className="font-semibold text-gray-700">
                    ${product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
