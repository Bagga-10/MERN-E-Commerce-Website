import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import ShopSidebar from "../components/ShopSidebar";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, checked, radio } = useSelector((state) => state.shop);

  const { data: categoryData, isLoading: isLoadingCategories } = useFetchCategoriesQuery();
  const { data: productsData = [], isLoading: isLoadingProducts } = useGetFilteredProductsQuery({ checked, radio });

  const [priceFilter, setPriceFilter] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    if (categoryData) dispatch(setCategories(categoryData));
  }, [categoryData, dispatch]);

  const filteredProducts = useMemo(() => {
    return productsData
      .filter(product => priceFilter ? product.price.toString().includes(priceFilter) : true)
      .filter(product => selectedBrand ? product.brand === selectedBrand : true);
  }, [productsData, priceFilter, selectedBrand]);

  const handleResetFilters = useCallback(() => {
    dispatch(setChecked([]));
    setSelectedBrand("");
    setPriceFilter("");
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ShopSidebar
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          products={productsData}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          handleResetFilters={handleResetFilters}
        />

        {/* Product Grid */}
        <main className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {isLoadingProducts ? "Loading..." : `${filteredProducts.length} Products Found`}
          </h2>

          {isLoadingProducts ? (
            <Loader />
          ) : filteredProducts.length === 0 ? (
            <div>No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
