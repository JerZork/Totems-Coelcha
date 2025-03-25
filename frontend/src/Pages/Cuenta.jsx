import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiX,
  FiDownload,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import logo from "../assets/LOGO_HORIZONTAL.png";
import { getDetallePagos } from "../services/detallePagos.service.js";
import { handlePayAll } from "../Utils/paymentUtils.js";
import {
  generatePrintableContent,
  generatePaymentReceiptContent,
} from "../Utils/printUtils.js";
import "react-toastify/dist/ReactToastify.css";
import Popup from "../Components/popup.jsx";
import Modal from "../Components/Modal.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCreditCard, FaTimesCircle } from "react-icons/fa";

// Se importa framer-motion para el nuevo diseño del popup de confirmación
import { motion, AnimatePresence } from "framer-motion";

// Componente para el popup de confirmación de pago
const PaymentConfirmationModal = ({
  isOpen,
  onClose,
  onlogout,
  onConfirm,
  amount,
  paymentType, // "total" o "previous"
  operationResult, // Objeto { success: boolean, message: string }
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [shouldLogout, setShouldLogout] = useState(false); // Nueva variable de estado

  // Detalles de pago que se muestran en el popup
  const paymentDetails = {
    Monto: amount,
    "Descripción de Pago":
      paymentType === "total" ? "Todos los documentos" : "Documentos anteriores",
    date: new Date().toLocaleDateString(),
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    await onConfirm();
    setIsProcessing(false);
    setIsFinished(true);
    setShouldLogout(true); // Actualiza shouldLogout al finalizar la operación
  };

  const handleClose = () => {
    if (shouldLogout) {
      onlogout();
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue bg-opacity-50 backdrop-blur-sm"
            onClick={() => !isProcessing && handleClose()}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative z-50 border-t-4 border-yellow-400"
          >
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-3">
                <FiCheckCircle className="text-blue-600 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Confirmar Pago
                </h2>
              </div>
              {!isProcessing && (
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiX />
                </button>
              )}
            </div>
            {!isFinished ? (
              <div className="space-y-4">
                <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                  {Object.entries(paymentDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-blue-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span className="font-medium text-blue-900">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 space-x-4 flex justify-end">
                  <button
                    disabled={isProcessing}
                    onClick={handleClose}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={handleConfirmPayment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                        Procesando...
                      </>
                    ) : (
                      "Confirmar Pago"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {operationResult.success ? (
                  <div className="text-center py-8 bg-blue-50 rounded-lg">
                    <FiCheckCircle className="text-yellow-400 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      ¡Pago Exitoso!
                    </h3>
                    <p className="text-blue-700">
                      El pago se realizó correctamente.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-blue-50 rounded-lg">
                    <FiX className="text-red-600 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      ¡Pago Fallido!
                    </h3>
                    <p className="text-blue-700">
                      Hubo un error al procesar el pago.
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Cuenta = () => {
  const navigate = useNavigate();
  const accessCode = JSON.parse(sessionStorage.getItem("nroservice"));
  
  

  // Estados de la lógica original
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [debtData, setDebtData] = useState([]);
  const [clientDetails, setClientDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalMessage, setPaymentModalMessage] = useState("");
  const [showOperationPopup, setShowOperationPopup] = useState(false);
  const [operationResult, setOperationResult] = useState({
    success: false,
    message: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Nuevo estado para el popup de confirmación de pago
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  // Define el tipo de pago que se confirmará ("total" o "previous")
  const [paymentType, setPaymentType] = useState("total");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDetallePagos(accessCode);
        setClientDetails(data.detalle[0]);
        setDebtData(data.pagos);
      } catch (error) {
        setError("Error al obtener los datos de pagos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessCode]);

  const handleViewInvoice = (numFactur) => {
    setInvoiceUrl(
      `https://www.coelcha.cl/Clientes-Online2/BuscarBoleta_sistemaRecaudacion.php?Folio=${numFactur}`
    );
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setInvoiceUrl("");
    setIsLoading(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    window.location.reload();
  };

  const handleCloseOperationPopup = () => {
    setShowOperationPopup(false);
    if (operationResult.success) {
      window.location.reload();
    }
  };

  // Calcular el total de deuda general
  const totalDebt = debtData.reduce(
    (acc, curr) => acc + parseFloat(curr.SALDO),
    0
  );
  // Calcular deudas anteriores (todos los documentos menos el último)
  const previousDebts = debtData.slice(0, -1);
  const totalPreviousDebt = previousDebts.reduce(
    (acc, curr) => acc + parseFloat(curr.SALDO),
    0
  );

  const handleExport = () => {
    setLoading(true);
    if (previousDebts.length === 0) {
      alert("No hay documentos suficientes para imprimir");
      setLoading(false);
      return;
    }
    generatePrintableContent(clientDetails, previousDebts, totalPreviousDebt);
    setLoading(false);
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    navigate("/home");
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Funciones de pago originales
  const handlePayPreviousBalance = async () => {
    setIsProcessing(true);
    try {
      await handlePayAll(
        previousDebts,
        clientDetails,
        totalPreviousDebt,
        setOperationResult,
        setShowOperationPopup,
        generatePaymentReceiptContent
      );
    } catch (error) {
      console.error("Error en el pago del saldo anterior:", error);
    }
    setIsProcessing(false);
  };

  const handlePayAllWrapper = async () => {
    setIsProcessing(true);
    try {
      await handlePayAll(
        debtData,
        clientDetails,
        totalDebt,
        setOperationResult,
        setShowOperationPopup,
        generatePaymentReceiptContent
      );
    } catch (error) {
      console.error("Error en el pago total:", error);
    }
    setIsProcessing(false);
  };

  // Estos manejadores abren el popup de confirmación utilizando el nuevo diseño.
  const openConfirmTotal = () => {
    setPaymentType("total");
    setShowPaymentConfirmation(true);
  };

  const openConfirmPrevious = () => {
    setPaymentType("previous");
    setShowPaymentConfirmation(true);
  };

  // Función que se ejecuta al confirmar el pago desde el popup.
  // Según el tipo de pago, se llama a handlePayAllWrapper o handlePayPreviousBalance.
  const handleConfirmPayment = async () => {
    if (paymentType === "total") {
      await handlePayAllWrapper();
    } else {
      await handlePayPreviousBalance();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50 p-4">
        <div className="text-blue-600 text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <p className="text-lg font-semibold">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 p-4">
        <div className="text-red-600 text-center">
          <FiX className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#0072ce] to-[#003087] p-24 flex flex-col justify-center"
      style={{ height: "1802px", width: "1080px" }}
    >
      <div className="bg-white rounded-xl shadow-lg p-12 mb-4 h-[1700px] space-y-2">
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleLogout}
            className="p-4 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors"
          >
            Volver
          </button>
        </div>
        <header className="mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-110" />
        </header>
        {clientDetails && (
          <div className="mb-8 py-1 border-b pb-4 text-2xl font-bold text-gray-900">
            <div className="flex justify-center text-4xl">
              <p className="text-blue-900">{clientDetails.RAZON_SOCIAL}</p>
            </div>
            <div className="flex justify-center">
              <p>{clientDetails.DIR_NIVEL_AGRUPACION_1_EMPALME}</p>
            </div>
            <div className="flex justify-center">
              <p>NRO. SERVICIO:&nbsp;</p>
              <p>{clientDetails.NUMERO_SERVICIO}</p>
            </div>
          </div>
        )}

        {/* Botones de pago con la nueva funcionalidad de confirmación */}
        <div className="flex py-4 px-5 rounded-lg justify-center items-center">
          {/* <span className="text-green-600">
            <p className="text-2xl font-semibold">Saldo Total:</p>
            <p className="text-3xl font-bold">
              ${totalDebt.toLocaleString("es-ES")}
            </p>
          </span> */}
          <span className="flex justify-center items-center">
            <button
              onClick={openConfirmTotal}
              className="rounded-lg bg-blue-500 transition-colors text-4xl px-8 h-15 text-white"
            >Pagar Saldo Total: ${totalDebt.toLocaleString("es-ES")}
              {/* <FiCheckCircle className="text-white animate-bounce" /> */}
            </button>
          </span>
        </div>

        <div className="flex py-4 px-5 rounded-lg justify-center items-center">
          {/* <span className="text-green-600">
            <p className="text-2xl font-semibold">Saldo Anterior:</p>
            <p className="text-3xl font-bold">
              ${totalPreviousDebt.toLocaleString("es-ES")}
            </p>
          </span> */}
          <span className="flex">
            <button
              onClick={openConfirmPrevious}
              className="rounded-lg bg-blue-500 transition-colors text-4xl px-8 h-15 text-white"
            >Pagar Saldo Anterior: ${totalPreviousDebt.toLocaleString("es-ES")}
              {/* <FiCheckCircle className="text-white animate-bounce" /> */}
            </button>
          </span>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleExport}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiDownload className="w-7 h-7 text-gray-600" />
          </button>
          {/* <button
            onClick={handleReset}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiRefreshCw className="w-7 h-7 text-gray-600" />
          </button> */}
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-blue-700">
                Detalle de Documentos
              </p>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center"
            >
              {showDetails ? (
                <FiChevronUp className="w-5 h-5" />
              ) : (
                <FiChevronDown className="w-5 h-5" />
              )}
              <span className="ml-2">
                {showDetails ? "Ocultar Detalles" : "Mostrar Detalles"}
              </span>
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-4 max-h-[750px] overflow-y-auto">
            {debtData.map((debt, index) => (
              <div
                key={debt.NUMFACTUR}
                className={`p-4 rounded-lg transition-all ${
                  index === debtData.length - 1 ? "bg-gray-200" : "bg-gray-50"
                } border border-gray-200`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800">
                      {format(new Date(debt.FECHA_MOVIMIENTO), "EEEE, d 'de' MMMM yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                  {/* <button
                    onClick={() => handleViewInvoice(debt.NUMFACTUR)}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  >
                    Ver Boleta
                  </button> */}
                </div>
                {index === debtData.length - 3 && (
                  <div className="flex justify-end">
                    <span className="px-2 py-1 rounded-full text-sm bg-amber-100 text-amber-700">
                      Pago mínimo para Reposición
                    </span>
                  </div>
                )}
                <div className="pl-8">
                  <div className="flex items-center justify-between">
                    <span>
                      <p className="text-lg font-semibold text-gray-800">
                        ${parseFloat(debt.SALDO).toLocaleString("es-ES")}
                      </p>
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        debt.ESTADO_DEUDA === "DV"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {debt.ESTADO_DEUDA === "DV"
                        ? "Deuda Vencida"
                        : "Deuda Vigente"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 flex">
                    <p>Número de Factura:&nbsp;</p>
                    <p>{debt.NUMFACTUR}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Popup isOpen={showPopup} onClose={closePopup} title="Ver Boleta">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
          </div>
        )}
        <iframe
          src={invoiceUrl}
          className="w-full h-11/12"
          onLoad={handleIframeLoad}
        ></iframe>
      </Popup>

      <Modal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        title="Pago"
        message={paymentModalMessage}
        isSuccess={paymentModalMessage === "Pago realizado con éxito"}
      />

      {/* <Popup
        isOpen={showOperationPopup}
        onClose={handleCloseOperationPopup}
        title="Operación"
      >
        <div className="flex justify-center mb-8 mt-4">
          {operationResult.success ? (
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex flex-col items-center space-y-6">
                <div className="bg-green-50 p-4 rounded-full">
                  <img
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3"
                    alt="Company Logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                  ¡Operación Exitosa!
                </h2>
                <div className="relative">
                  <FiCheckCircle className="w-24 h-24 text-green-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaCreditCard className="w-10 h-10 text-green-400" />
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-2xl font-semibold text-green-700">
                    ¡Correcto!
                  </p>
                  <div className="space-y-2">
                    <p className="text-xl text-gray-600 text-center">
                      {operationResult.message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex flex-col items-center space-y-6">
                <div className="bg-red-50 p-4 rounded-full">
                  <img
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3"
                    alt="Company Logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                  ¡Operación Fallida!
                </h2>
                <div className="relative">
                  <FaTimesCircle className="w-24 h-24 text-red-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaCreditCard className="w-10 h-10 text-red-400" />
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-2xl font-semibold text-red-700">
                    ¡Incorrecto!
                  </p>
                  <div className="space-y-2">
                    <p className="text-xl text-gray-600 text-center">
                      {operationResult.message}
                    </p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
                  <p className="text-red-700 text-center">
                    Error: {operationResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Popup> */}

      {/* {isProcessing && (
        <Popup isOpen={true} onClose={() => {}} title="Procesando Pago">
          <div className="flex flex-col items-center space-y-6 p-8">
            <div className="bg-blue-50 p-4 rounded-full">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3"
                alt="Company Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Procesando Pago
            </h2>
            <div className="relative">
              <AiOutlineLoading3Quarters className="w-24 h-24 text-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FaCreditCard className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <p className="text-2xl font-semibold text-gray-700">
                Procesando su pago...
              </p>
              <div className="space-y-2">
                <p className="text-xl text-gray-600">
                  Por favor, mantenga su tarjeta en el terminal de pago
                </p>
                <p className="text-xl text-gray-600">
                  No retire la tarjeta hasta que se complete la transacción
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse rounded-full" />
            </div>
          </div>
        </Popup>
      )} */}

      {/* Popup con el nuevo diseño para confirmar el pago */}
      <PaymentConfirmationModal
        isOpen={showPaymentConfirmation}
        onlogout={handleLogout}
        onClose={() => setShowPaymentConfirmation(false)}
        onConfirm={handleConfirmPayment}
        amount={
          paymentType === "total"
            ? "$" + totalDebt.toLocaleString("es-ES")
            : "$" + totalPreviousDebt.toLocaleString("es-ES")
        }
        paymentType={paymentType}
        operationResult={operationResult}
      />
    </div>
  );
};

export default Cuenta;
