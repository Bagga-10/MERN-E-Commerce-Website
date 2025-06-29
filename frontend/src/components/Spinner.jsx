const Spinner = ({ size = "md" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full animate-spin ${sizes[size]}`}
    />
  );
};

export default Spinner;
