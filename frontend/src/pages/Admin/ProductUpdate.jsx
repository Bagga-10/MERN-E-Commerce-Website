import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";

import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";

const ProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [stock, setStock] = useState(productData?.countInStock || "");

  const navigate = useNavigate();

  const { data: categories = [], refetch } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [imageUrl, setImageUrl] = useState(productData?.image || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImageUrl(productData.image);
      setImage(null);
    }
  }, [productData]);

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Just store the file, do not upload yet
      setImageUrl(URL.createObjectURL(file)); // For preview
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    if (!name || !price || !category || !quantity || !description) {
      toast.error("Please fill all required fields.");
      setIsUpdating(false);
      return;
    }
    try {
      let uploadedImagePath = imageUrl;
      if (image instanceof File) {
        const formData = new FormData();
        formData.append("image", image);
        const res = await uploadProductImage(formData).unwrap();
        uploadedImagePath = res.image;
      }

      // Prepare FormData for update
      const formData = new FormData();
      formData.append("image", uploadedImagePath);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", Number(stock));

      await updateProduct({ productId: params._id, formData }).unwrap();

      // Update local image state with the new image path
      setImageUrl(uploadedImagePath);
      setImage(null);

      toast.success("Product successfully updated...");
      // Optionally refetch product data here if needed
      refetch();
      // If you want to navigate, keep this line:
      navigate("/admin/allproductslist");
    } catch (error) {
      console.error(error);
      toast.error("Product update failed. Try Again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete the product?"
      );

      if (!answer) return;
      setIsDeleting(true);

      await deleteProduct(params._id);
      toast.success("Product Deleted");
      navigate("/admin/allproductslist");
    } catch (error) {
      console.log(error);
      toast.error("Delete failed. Try again...");
    } finally {
      setIsDeleting(false);
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
              <button
                onClick={() => {
                  setImage(null);
                  setImageUrl("");
                }}
                className="mt-2 text-red-500 hover:underline text-sm"
              >
                Remove Image
              </button>
            </div>
          )}

          {/* File Upload */}
          <div className="mb-3">
            <label className="border-2 border-dashed border-gray-300 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-10 hover:border-pink-500 transition">
              {image ? "Change Image" : "Click to Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
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
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none"
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
                  value={category}
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

            {/* Submit Button
            <div className="mt-6 text-right">
              <button
                onClick={handleUpdate}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition mr-6"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition"
              >
                Delete
              </button>
            </div> */}
            {/* Submit Button */}
            <div className="mt-6 text-right">
              <button
                onClick={handleUpdate}
                disabled={isUpdating || isDeleting}
                className={`px-8 py-3 ${
                  isUpdating || isDeleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition mr-6`}
              >
                {isUpdating ? <Loader /> : "Update"}
              </button>
              <button
                onClick={handleDelete}
                disabled={isUpdating || isDeleting}
                className={`px-8 py-3 ${
                  isUpdating || isDeleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700"
                } px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition`}
              >
                {isDeleting ? <Loader /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
