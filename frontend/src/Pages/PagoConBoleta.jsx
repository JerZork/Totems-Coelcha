import '../styles/Home.css';
import React, { useState, useEffect, useRef } from "react";
import { BsQuestionCircle, BsExclamationCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoCoelcha.png";
import { checkClienteExiste } from "../services/detallePagos.service.js";

const Home = () => {
  const [accessCode, setAccessCode] = useState("");
  const [errors, setErrors] = useState({ code: "" });
  const [inactivityTimer, setInactivityTimer] = useState(null);
  const [serviceError, setServiceError] = useState("");
  const codeInputRef = useRef(null);
  const navigate = useNavigate();

  const translations = {
    title: "Paga tu cuenta de electricidad",
    codeLabel: "Número de Servicio",
    submit: "Ingresar",
    reset: "Limpiar",
    help: "Ayuda",
    support: "¿Necesitas ayuda? Contacta soporte",
    invalidCode: "Nro de servicio debe tener 1-5 caracteres numéricos",
    serviceNotFound: "Cliente no encontrado"
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

  const validateCode = (code) => {
    return /^[a-zA-Z0-9]{1,5}$/.test(code);
  };

  const handleCodeChange = (value) => {
    setAccessCode(value.slice(0, 8));
    setErrors(prev => ({
      ...prev,
      code: validateCode(value) ? "" : translations.invalidCode
    }));
    resetInactivityTimer();
  };

  const resetForm = () => {
    setAccessCode("");
    setErrors({ code: "" });
    setServiceError("");
    codeInputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.code && validateCode(accessCode)) {
      try {
        const response = await checkClienteExiste(accessCode);
        if (response.message === "Cliente no encontrado") {
          setServiceError(translations.serviceNotFound);
        } else {
          console.log("Form submitted", { accessCode });
          navigate(`/cuenta/${accessCode}`);
        }
      } catch (error) {
        console.error('Error al verificar existencia de cliente', error);
        setServiceError(translations.serviceNotFound);
      }
    }
  };

  const isFormValid = !errors.code && accessCode;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0072ce] to-[#003087] flex items-center justify-center p-4" onClick={resetInactivityTimer} style={{ height: "1802px", width: "1080px" }}>
      <div className="w-[900px] h-[1350px] bg-white rounded-xl shadow-lg p-12 space-y-8 border-t-4 border-yellow-400">
        <header>
          <img src={logo} alt="Logo" />
        </header>
        <div className="text-center mb-8">
          <h1 className="text-8xl font-bold text-blue-900">{translations.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16 py-20">
          <div>
            <label className="block text-5xl font-medium text-blue-900 mb-3">
              {translations.codeLabel}
            </label>
            <div className="relative">
              <input
                ref={codeInputRef}
                type="text"
                value={accessCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className={`w-full px-6 py-4 text-5xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.code ? "border-red-500" : "border-yellow-300"}`}
              />
            </div>
            {errors.code && <p className="mt-2 text-red-500 text-lg">{errors.code}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 text-5xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
            disabled={!isFormValid}
          >
            {translations.submit}
          </button>
          {serviceError && <p className="mt-2 text-red-500 text-lg">{serviceError}</p>}
        </form>

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