import React from "react";
import { FiCheck, FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, message, isSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-red-600 hover:text-red-800">
          Cerrar
        </button>
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <FiCheck className="w-16 h-16 text-green-600" />
          ) : (
            <FiX className="w-16 h-16 text-red-600" />
          )}
        </div>
        <p className="text-center mt-4">{message}</p>
      </div>
    </div>
  );
};

export default Modal;