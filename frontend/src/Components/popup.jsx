import React from "react";
import { FiX } from "react-icons/fi";

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5xl h-11/12 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-red-600 hover:text-red-800">
          <FiX className="w-8 h-8" />
        </button>
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Popup;