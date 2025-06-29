import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !quantity || !description) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!image) {
      toast.error("Please select an image.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      // Create product with image file directly (single request)
      const productData = new FormData();
      productData.append("image", image); // Send actual file, not URL
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", Number(price));
      productData.append("category", category);
      productData.append("quantity", Number(quantity));
      productData.append("brand", brand);
      productData.append("countInStock", Number(stock));

      console.log("Sending product data:", {
        name,
        description,
        price,
        category,
        quantity,
        brand,
        imageFile: image?.name,
      });

      const { data } = await createProduct(productData);

      toast.success(`${data.name} is created`);

      // Reset form
      setImage("");
      setImageUrl(null);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setQuantity("");
      setBrand("");
      setStock(0);

      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("Product creation error:", error);
      toast.error("Product creation failed. Try Again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Just store the file, do not upload yet
      setImageUrl(URL.createObjectURL(file)); // For preview
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row ml-[14rem]">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-4xl mb-5">Create Product</div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="flex flex-col items-center justify-center border rounded-lg p-4 shadow-sm bg-gray-50 mb-4">
              <img
                src={imageUrl}
                alt="Product Preview"
                className="w-full max-w-xs h-auto object-cover rounded-md"
              />
              <p className="mt-2 text-sm text-gray-600">
                Preview: <span className="font-medium">{image?.name}</span>
              </p>
              <button
                onClick={() => {
                  setImage(null);
                  setImageUrl(null);
                }}
                className="mt-2 text-red-500 hover:underline text-sm"
              >
                Remove Image
              </button>
            </div>
          )}

          {/* File Upload */}
          <div className="mb-3">
            <label
              className={`border-2 border-dashed border-gray-300 px-4 block w-full text-center rounded-lg font-bold py-10 transition ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-pink-500"
              }`}
            >
              {image ? "Change Image" : "Click to Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                disabled={isLoading}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none ${
                    isLoading ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* Brand */}
              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Count In Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full px-4 py-3 border rounded-md bg-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6 text-right">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-8 py-3 font-semibold rounded-lg transition ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700"
                } text-white`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader />
                    <span className="ml-2">Creating Product...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
