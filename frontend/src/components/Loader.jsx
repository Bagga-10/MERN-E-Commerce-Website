const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-60">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 border-opacity-50"></div>
    </div>
  );
};

export default Loader;