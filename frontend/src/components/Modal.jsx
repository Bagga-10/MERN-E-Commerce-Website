const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose} 
      />

      {/* Modal content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-10">
        <button
          className="absolute top-2 right-2 text-black font-semibold hover:text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          ❌
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
