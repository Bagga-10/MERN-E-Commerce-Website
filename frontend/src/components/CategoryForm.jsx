const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-3 px-4 border rounded-lg w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          placeholder="Write Category Name..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          aria-label="Category name"
        />

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 mt-3"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              aria-label="Delete category"
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-opacity-50 mt-3"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
