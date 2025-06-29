import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        ❤️ Your Favorite Products
      </h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl hover:scale-105 transition duration-300 p-4"
            >
              <Product product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-10">
          You haven’t added any favorite products yet.
        </div>
      )}
    </div>
  );
};

export default Favorites;
