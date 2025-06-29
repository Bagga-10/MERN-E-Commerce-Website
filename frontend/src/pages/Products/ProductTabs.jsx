import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingproductReview,
  submitHandler,
  rating,
  comment,
  userInfo,
  setComment,
  setRating,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  const tabClasses = (tabNum) =>
    `py-2 px-4 text-sm sm:text-base font-medium border-b-2 transition-all duration-300 cursor-pointer ${
      activeTab === tabNum
        ? "border-pink-600 text-pink-600"
        : "border-transparent hover:text-pink-500"
    }`;

  return (
    <div className="w-full max-w-6xl px-4 py-8">
      {/* Tabs */}
      <div className="flex justify-start border-b mb-6 space-x-6 overflow-x-auto">
        <div onClick={() => setActiveTab(1)} className={tabClasses(1)}>
          ✍️ Write a Review
        </div>
        <div onClick={() => setActiveTab(2)} className={tabClasses(2)}>
          ⭐ All Reviews
        </div>
        <div onClick={() => setActiveTab(3)} className={tabClasses(3)}>
          🔁 Related Products
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 1 && (
          <div className="space-y-6">
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-lg font-medium mb-2"
                  >
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full sm:w-[500px] p-2 border border-gray-300 rounded-lg text-black"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-lg font-medium mb-2"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full sm:w-[500px] p-3 border border-gray-300 rounded-lg text-black"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingproductReview}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg shadow-md transition"
                >
                  {loadingproductReview ? "Submitting..." : "Submit"}
                </button>
              </form>
            ) : (
              <p className="text-gray-600 text-lg">
                Please{" "}
                <Link
                  to="/login"
                  className="text-pink-600 font-semibold underline"
                >
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-100 p-5 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-lg text-gray-800">
                      {review.name}
                    </strong>
                    <span className="text-sm text-gray-500">
                      {review.createdAt.substring(0, 10)}
                    </span>
                  </div>
                  <Ratings value={review.rating} />
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.length > 0 ? (
              data.map((product) => (
                <SmallProduct key={product._id} product={product} className="ml-0"/>
              ))
            ) : (
              <Loader />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
