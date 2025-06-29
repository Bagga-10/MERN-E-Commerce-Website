import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword && <Header />}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-t from-pink-100 to-white py-20 px-4 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto rounded-lg shadow-sm">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Special Products
              </h1>
              <p className="text-gray-600 text-lg max-w-md">
                Discover our top-quality selections just for you.
              </p>
            </div>
            <Link
              to="/shop"
              className="mt-6 md:mt-0 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full py-3 px-8 transition duration-300"
            >
              Shop Now
            </Link>
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-4 mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8 justify-items-center">
              {data.products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
            

          </div>
        </>
      )}
      <div className="flex justify-center items-center mt-10 mb-4">
        <h3 className="text-2xl font-semibold">Created with 💕 by Syed Farhan</h3>
      </div>
    </>
  );
};

export default Home;
