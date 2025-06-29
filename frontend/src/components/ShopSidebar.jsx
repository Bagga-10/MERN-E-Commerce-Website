import React, { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChecked } from "../redux/features/shop/shopSlice";
import Loader from "./Loader";
import { debounce } from "lodash";

const ShopSidebar = ({
  categories,
  isLoadingCategories,
  products,
  priceFilter,
  setPriceFilter,
  selectedBrand,
  setSelectedBrand,
  handleResetFilters,
}) => {
  const dispatch = useDispatch();
  const checked = useSelector((state) => state.shop.checked);

  const uniqueBrands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand).filter(Boolean))];
  }, [products]);

  const handleCheck = useCallback(
    (isChecked, id) => {
      const updated = isChecked
        ? [...checked, id]
        : checked.filter((c) => c !== id);
      dispatch(setChecked(updated));
    },
    [dispatch, checked]
  );

  const debouncedPriceChange = useMemo(
    () =>
      debounce((value) => {
        setPriceFilter(value);
      }, 300),
    [setPriceFilter]
  );

  const handlePriceInput = useCallback(
    (e) => {
      debouncedPriceChange(e.target.value);
    },
    [debouncedPriceChange]
  );

  return (
    <aside className="w-full md:w-64 bg-white border rounded-lg p-5 shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Filter by Price</h2>
      <input
        type="text"
        placeholder="Enter price"
        defaultValue={priceFilter}
        onChange={handlePriceInput}
        className="w-full border px-3 py-2 rounded-md text-sm focus:ring-pink-300 focus:border-pink-500"
      />

      <button
        onClick={handleResetFilters}
        className="mt-6 mb-6 w-full border border-pink-500 text-pink-500 hover:bg-pink-50 py-2 rounded-md font-medium text-sm"
      >
        Reset Filters
      </button>

      <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter by Category</h2>
      {isLoadingCategories ? (
        <Loader />
      ) : (
        categories?.map((c) => (
          <label key={c._id} className="flex items-center mb-3">
            <input
              type="checkbox"
              className="accent-pink-500 w-4 h-4"
              checked={checked.includes(c._id)}
              onChange={(e) => handleCheck(e.target.checked, c._id)}
            />
            <span className="ml-2 text-gray-700 text-sm">{c.name}</span>
          </label>
        ))
      )}

      <h2 className="text-lg font-semibold mt-6 mb-4 text-gray-800">Filter by Brand</h2>
      {uniqueBrands.map((brand) => (
        <label key={brand} className="flex items-center mb-3">
          <input
            type="radio"
            name="brand"
            checked={selectedBrand === brand}
            onChange={() => setSelectedBrand(brand)}
            className="accent-pink-500 w-4 h-4"
          />
          <span className="ml-2 text-gray-700 text-sm">{brand}</span>
        </label>
      ))}
    </aside>
  );
};

export default ShopSidebar;
