import React, { useState, useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";

const RutInput = ({ value, onChange }) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef(null);
  const keyboardRef = useRef(null);

  const formatRut = (value) => {
    let cleaned = value.replace(/[^0-9kK]/g, "");
    if (cleaned.length > 9) cleaned = cleaned.slice(0, 9);
    
    if (cleaned.length > 1) {
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1);
      let formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return `${formatted}-${dv}`;
    }
    return cleaned;
  };

  const handleKeyClick = (value) => {
    const newRut = formatRut(value);
    onChange(newRut);
  };

  const handleInputFocus = () => {
    const rect = inputRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX
    });
    setShowKeyboard(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        keyboardRef.current &&
        !keyboardRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowKeyboard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const keys = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "K", "0"
  ];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <label
        htmlFor="rut-input"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        RUT
      </label>
      <input
        ref={inputRef}
        id="rut-input"
        type="text"
        value={value}
        onChange={(e) => onChange(formatRut(e.target.value))}
        onFocus={handleInputFocus}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        placeholder="Enter RUT"
        aria-label="RUT input field"
        readOnly
      />

      {showKeyboard && (
        <div
          ref={keyboardRef}
          className="absolute z-50 p-4 bg-white rounded-lg shadow-xl border border-gray-200 animate-fade-in"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          role="dialog"
          aria-label="Numeric keyboard"
        >
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowKeyboard(false)}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close keyboard"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 w-[240px]">
            {keys.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`
                  ${key === "0" ? "col-span-2" : ""}
                  p-4 text-lg font-semibold bg-gray-50 hover:bg-gray-100
                  active:bg-gray-200 rounded-lg transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                aria-label={`Number ${key}`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RutInput;