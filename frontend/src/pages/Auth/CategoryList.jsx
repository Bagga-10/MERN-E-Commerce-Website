import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "../Admin/AdminMenu";

const CategoryList = () => {
  const { data: categories, refetch } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      setName("");
      toast.success(`${result.name} is Created...`);
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again..");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Updating name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      toast.success(`${result.name} is updated...`);
      await refetch();
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteCategory = async () => {
    if (!window.confirm("Are you sure you want to delete this Category?")) {
      return;
    }
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      setSelectedCategory(null);
      setModalVisible(false);
      await refetch();
      toast.success("Category is deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to delete Category");
    }
  };

  return (
    <div className="ml-0 md:ml-[20rem] flex flex-col md:flex-row min-h-[52rem]  p-4">
      <AdminMenu/>
      <div
        className="md:w-3/4 p-6 bg-white rounded-lg shadow-lg "
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <h1 className="text-3xl font-semibold mb-6 text-pink-600">
          Manage Categories
        </h1>

        {/* Create Category Form */}
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleSubmitCategory}
        />

        <hr className="my-8 border-pink-300" />

        {/* Category Buttons Grid */}
        <div className="flex flex-wrap gap-4">
          {categories?.map((category) => (
            <button
              key={category._id}
              className="bg-white border-2 border-pink-500 text-pink-600 py-2 px-5 rounded-lg 
                         shadow-sm transition hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              onClick={() => {
                setModalVisible(true);
                setSelectedCategory(category);
                setUpdatingName(category.name);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Update/Delete Modal */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <h2 className="text-xl font-semibold text-pink-700 mb-4">
            Update Category
          </h2>
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
