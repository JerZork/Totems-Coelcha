import '../styles/Home.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoCoelcha.png";

const HomePagos = () => {
  const [inactivityTimer, setInactivityTimer] = useState(null);
  const navigate = useNavigate();

  const translations = {
    title: "Paga tu cuenta de electricidad",
    loginWithServiceNumber: "Ingresar con número de servicio",
    payWithReceipt: "Pagar con boleta"
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

  const resetForm = () => {
    // Aquí puedes agregar la lógica para resetear el formulario si es necesario
  };

  const handleLoginWithServiceNumber = () => {
    navigate("/loginNroServicio");
  };

  const handlePayWithReceipt = () => {
    navigate("/PagoConBoleta");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0072ce] to-[#003087] flex items-center justify-center p-4" onClick={resetInactivityTimer} style={{ height: "1802px", width: "1080px" }}>
      <div className="w-[900px] h-[1350px] bg-white rounded-xl shadow-lg p-12 space-y-8 border-t-4 border-yellow-400">
        <header>
          <img src={logo} alt="Logo" />
        </header>
        <div className="text-center mb-8">
          <h1 className="text-8xl font-bold text-blue-900">{translations.title}</h1>
        </div>

        <div className="space-y-28 py-36 flex flex-col items-center">
          <button
            type="button"
            onClick={handleLoginWithServiceNumber}
            className="w-2xl h-32 py-4 text-5xl font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
          >
            {translations.loginWithServiceNumber}
          </button>
          <button
            type="button"
            onClick={handlePayWithReceipt}
            className="w-2xl h-32 py-4 text-5xl font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
          >
            {translations.payWithReceipt}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePagos;