import '../styles/Home.css';
import React, { useState, useEffect, useRef } from "react";
import { BsQuestionCircle, BsExclamationCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoCoelcha.png";

const NumericKeyboard = ({ onKeyPress, onClose, keys }) => {
  const keyboardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={keyboardRef} className="fixed bottom-0 left-0  w-full h-[24rem] bg-gray-950 shadow-lg py-8 px-60 border-t border-gray-300">
      <div className="grid grid-cols-3 gap-4 place-items-center">
        {keys.map((key) => (
          <button
            key={key}
            className="text-3xl font-bold py-4 bg-gray-800 text-white rounded-lg hover:bg-blue-800 w-40"
            onClick={() => onKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="mt-4 bg-gray-950 w-screen h-12  absolute left-0">
        
         </div>

    </div>
  );
};

const Home = () => {
  const [rut, setRut] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [showRutKeyboard, setShowRutKeyboard] = useState(false);
  const [showCodeKeyboard, setShowCodeKeyboard] = useState(false);
  const [errors, setErrors] = useState({ rut: "", code: "" });
  const [inactivityTimer, setInactivityTimer] = useState(null);
  const rutInputRef = useRef(null);
  const codeInputRef = useRef(null);
  const navigate = useNavigate();

  const translations = {
    title: "Paga tu cuenta de electricidad",
    rutLabel: "Ingrese su RUT",
    codeLabel: "Número de Servicio",
    submit: "Ingresar",
    reset: "Limpiar",
    help: "Ayuda",
    support: "¿Necesitas ayuda? Contacta soporte",
    invalidRut: "RUT inválido",
    invalidCode: "Nro de servicio debe tener 1-5 caracteres numéricos"
  };

  useEffect(() => {
    resetInactivityTimer();
    return () => clearTimeout(inactivityTimer);
  }, []);

  const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    setInactivityTimer(
      setTimeout(() => {
        resetForm();
      }, 180000)
    );
  };

  const formatRut = (value) => {
    let cleaned = value.replace(/[^0-9kK]/g, "");
    if (cleaned.length > 9) cleaned = cleaned.slice(0, 9);
    if (cleaned.length > 1) {
      const verifier = cleaned.slice(-1);
      const numbers = cleaned.slice(0, -1);
      cleaned = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + verifier;
    }
    return cleaned;
  };

  const validateRut = (rutValue) => {
    const rutClean = rutValue.replace(/[^0-9kK]/g, "");
    if (rutClean.length < 2) return false;
    const verifier = rutClean.slice(-1).toLowerCase();
    const numbers = rutClean.slice(0, -1);
    let sum = 0;
    let multiplier = 2;
    
    for (let i = numbers.length - 1; i >= 0; i--) {
      sum += numbers[i] * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const expectedVerifier = (11 - (sum % 11)).toString();
    const validVerifier = expectedVerifier === "10" ? "k" : expectedVerifier === "11" ? "0" : expectedVerifier;
    return verifier === validVerifier;
  };

  const validateCode = (code) => {
    return /^[a-zA-Z0-9]{1,5}$/.test(code);
  };

  const handleRutChange = (key) => {
    if (key === "←") {
      setRut((prev) => formatRut(prev.slice(0, -1)));
    } else {
      setRut((prev) => formatRut(prev + key));
    }
  };

  const handleCodeChange = (key) => {
    if (key === "←") {
      setAccessCode((prev) => prev.slice(0, -1));
    } else {
      setAccessCode((prev) => (prev + key).slice(0, 5));
    }
    setErrors(prev => ({
      ...prev,
      code: validateCode(accessCode) ? "" : translations.invalidCode
    }));
    resetInactivityTimer();
  };

  const resetForm = () => {
    setRut("");
    setAccessCode("");
    setErrors({ rut: "", code: "" });
    rutInputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errors.rut && !errors.code && validateRut(rut) && validateCode(accessCode)) {
      console.log("Form submitted", { rut, accessCode });
      
    }
  };

  const isFormValid = !errors.rut && !errors.code && rut && accessCode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-yellow-200 flex items-center justify-center p-4" onClick={resetInactivityTimer} style={{ height: "1802px", width: "1080px" }}>
      <div className="w-[900px] h-[1350px] bg-white rounded-xl shadow-lg p-12 space-y-8 border-t-4 border-yellow-400">
        <header>
          <img src={logo} alt="Logo" />
        </header>
        <div className="text-center mb-8">
          <h1 className="text-8xl  font-bold text-blue-900">{translations.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16 py-20">
          <div>
            <label className="block text-5xl font-medium text-blue-900 mb-3">
              {translations.rutLabel}
            </label>
            <div className="relative">
              <input
                ref={rutInputRef}
                type="text"
                value={rut}
                readOnly
                onClick={() => setShowRutKeyboard(true)}
                className={`w-full px-6 py-4 text-5xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.rut ? "border-red-500" : "border-yellow-300"}`}
                placeholder="12.345.678-9"
              />
              {errors.rut && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500">
                  <BsExclamationCircle size={28} />
                </div>
              )}
            </div>
            {errors.rut && <p className="mt-2 text-red-500 text-lg">{errors.rut}</p>}
          </div>

          <div>
            <label className="block text-5xl font-medium text-blue-900 mb-3">
              {translations.codeLabel}
            </label>
            <div className="relative">
              <input
                ref={codeInputRef}
                type="text"
                value={accessCode}
                readOnly
                onClick={() => setShowCodeKeyboard(true)}
                className={`w-full px-6 py-4 text-5xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.code ? "border-red-500" : "border-yellow-300"}`}
              />
            </div>
            {errors.code && <p className="mt-2 text-red-500 text-lg">{errors.code}</p>}
          </div>

          <button
            onClick={()=> navigate('/cuenta')}
            type="submit"
            className="w-full py-4 text-5xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
            disabled={!isFormValid}
          >
            {translations.submit}
          </button>
        </form>

        {showRutKeyboard && (
          <NumericKeyboard
            onKeyPress={handleRutChange}
            onClose={() => setShowRutKeyboard(false)}
            keys={["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "k", "←"]}
          />
        )}

        {showCodeKeyboard && (
          <NumericKeyboard
            onKeyPress={handleCodeChange}
            onClose={() => setShowCodeKeyboard(false)}
            keys={["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "←"]}
          />
        )}

        <div className="pt-16 border-t border-yellow-200">
          <div className="flex justify-between items-center text-3xl text-blue-800">
            <button
              type="button"
              className="flex items-center space-x-2 hover:text-yellow-600"
              onClick={() => console.log("Help clicked")}
            >
              <BsQuestionCircle size={24} />
              <span>{translations.help}</span>
            </button>
            <span>{translations.support}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;