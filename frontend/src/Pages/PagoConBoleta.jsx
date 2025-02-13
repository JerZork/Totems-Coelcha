import '../styles/Home.css';
import React, { useState, useEffect, useRef } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoCoelcha.png";
import { checkClienteExiste } from "../services/detallePagos.service.js";
import { getNroService } from "../services/detallePagos.service.js";
import boletaejemplo from "../assets/BOLETAEJEMPLO.png";
import manosdoc from "../assets/manosdoc.svg";

const PagoConBoleta = () => {
  const [accessCode, setAccessCode] = useState("");
  const [errors, setErrors] = useState({ code: "" });
  const [inactivityTimer, setInactivityTimer] = useState(null);
  const [serviceError, setServiceError] = useState("");
  const codeInputRef = useRef(null);
  const navigate = useNavigate();

  const translations = {
    title: "Porfavor Escanear su Boleta",
    codeLabel: "Número de boleta electrónica",
    submit: "Ingresar",
    reset: "Limpiar",
    help: "Ayuda",
    support: "¿Necesitas ayuda? Contacta soporte",
    invalidCode: "Nro de servicio debe tener 1-5 caracteres numéricos",
    serviceNotFound: "Cliente no encontrado"
  };

  useEffect(() => {
    resetInactivityTimer();
    codeInputRef.current?.focus();
    
    // Agregar listener para mantener el foco
    const handleBlur = () => {
      codeInputRef.current?.focus();
    };
    
    const inputElement = codeInputRef.current;
    inputElement?.addEventListener('blur', handleBlur);

    return () => {
      inputElement?.removeEventListener('blur', handleBlur);
      clearTimeout(inactivityTimer);
    };
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
    return /^[0-9]{0,12}$/.test(code);
  };

  const handleCodeChange = (value) => {
    setAccessCode(value.slice(0, 12));
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

  function formatearCadena(cadena) {
    if (isNaN(cadena[0])) {
      cadena = cadena.substring(1);
    }

    let numeros = '';
    for (let char of cadena) {
      if (!isNaN(char) && char !== ' ') {
        numeros += char;
      } else {
        break;
      }
    }
    return numeros;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let numeros = formatearCadena(accessCode);
    const nservicio = await getNroService(numeros);

    if (nservicio.length > 0) {
      try {
        const response = await checkClienteExiste(nservicio[0].NUMERO_SERVICIO);
        if (response.message === "Cliente no encontrado") {
          setServiceError(translations.serviceNotFound);
        } else {
          sessionStorage.setItem('nroservice', JSON.stringify(nservicio[0].NUMERO_SERVICIO));
          navigate(`/cuenta/`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0072ce] to-[#003087] flex justify-center items-center">
      <div className="w-[900px] h-[1740px] bg-white rounded-xl shadow-lg p-12 space-y-8 border-t-4 border-yellow-400 pointer-events-none">
        
      
        <div className="flex gap-2 justify-end pointer-events-auto">
          <button
            onClick={handleLogout}
            className="p-4 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors"
          >
            Volver
          </button>
        </div>
        <div className="relative pointer-events-auto ">
              
            </div>
        <header> 
          <h1 className="flex justify-center text-5xl font-bold text-blue-950">{translations.title}</h1>
          <h2 className="flex justify-center text-3xl font-bold text-slate-600 space-y-12">Acercar código de barras al lector</h2>
          <div className='flex justify-center '>
            <img className="py-" src={boletaejemplo} alt="Boleta de Ejemplo" />
            
          </div>
        </header>
        <div className='flex justify-center'>  
          <img src={manosdoc} alt="Manos Documento" />
        </div>
        

        <form onSubmit={handleSubmit} className="space-y-16">
        <input
                ref={codeInputRef}
                type="text"
                value={accessCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className={`w-10 px-0 py-0 text-2xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.code ? "border-red-500" : "border-yellow-300"
                }`}
                style={{position: 'absolute', zIndex: -1 }}
                onBlur={() => codeInputRef.current?.focus()}
              />
          <div>

            {errors.code && <p className="mt-2 text-red-500 text-lg">{errors.code}</p>}
          </div>

          {serviceError && <p className="mt-2 text-red-500 text-lg">{serviceError}</p>}
        </form>

        
        
      </div>
    </div>
  );
};

export default PagoConBoleta;