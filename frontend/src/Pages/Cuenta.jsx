import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiX, FiDownload, FiRefreshCw, FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import logo from "../assets/LOGO_HORIZONTAL.png";
import { getDetallePagos } from "../services/detallePagos.service.js";
import { handlePayAll, handlePaySelected } from "../Utils/paymentUtils.js";
import { generatePrintableContent, generatePaymentReceiptContent } from "../Utils/printUtils.js";
import 'react-toastify/dist/ReactToastify.css';
import Popup from "../Components/popup.jsx";
import Modal from "../Components/Modal.jsx";

const Cuenta = () => {
  const navigate = useNavigate();
  const accessCode = JSON.parse(sessionStorage.getItem('nroservice'));
  const [selectedMonths, setSelectedMonths] = useState([]);
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
  const [operationResult, setOperationResult] = useState({ success: false, message: "" });

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

  const handleMonthSelection = (monthId) => {
    const selectedDebt = debtData.find(debt => debt.NUMFACTUR === monthId);
    const selectedDate = new Date(selectedDebt.FECHA_MOVIMIENTO);

    setSelectedMonths(() => {
      const newSelectedMonths = debtData
        .filter(debt => new Date(debt.FECHA_MOVIMIENTO) <= selectedDate)
        .map(debt => debt.NUMFACTUR);

      return newSelectedMonths;
    });
  };

  const handleViewInvoice = (numFactur) => {
    setInvoiceUrl(`https://www.coelcha.cl/Clientes-Online2/BuscarBoleta_sistemaRecaudacion.php?Folio=${numFactur}`);
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

  const totalSelectedDebt = debtData
    .filter((debt) => selectedMonths.includes(debt.NUMFACTUR))
    .reduce((acc, curr) => acc + parseFloat(curr.SALDO), 0);

  const totalDebt = debtData.reduce((acc, curr) => acc + parseFloat(curr.SALDO), 0);

  const handleExport = () => {
    setLoading(true);

    const selectedDebts = debtData.filter(debt =>
      selectedMonths.includes(debt.NUMFACTUR)
    );

    if (selectedDebts.length === 0) {
      alert("Por favor selecciona al menos un mes para imprimir");
      setLoading(false);
      return;
    }

    generatePrintableContent(
      clientDetails,
      selectedDebts,
      totalSelectedDebt
    );

    setLoading(false);
  };

  const handleReset = () => {
    setSelectedMonths([]);
  };

  const handleLogout = () => {
    navigate("/home");
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handlePaySelectedWrapper = () => {
    const selectedDebts = debtData.filter(debt => selectedMonths.includes(debt.NUMFACTUR));
    handlePaySelected(selectedDebts, clientDetails, totalSelectedDebt, setOperationResult, setShowOperationPopup, generatePaymentReceiptContent);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50 p-4">
        <div className="text-blue-600 text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
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
    <div className="min-h-screen bg-gradient-to-br from-[#0072ce] to-[#003087] p-24 flex flex-col justify-center" style={{ height: "1802px", width: "1080px" }}>
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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cuentas Por Pagar</h1>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Todos los Meses</p>
              <p className="text-2xl font-bold text-blue-700">
                ${totalDebt.toLocaleString('es-ES')}
              </p>
            </div>
            <button
              onClick={() => handlePayAll(debtData, clientDetails, totalDebt, setOperationResult, setShowOperationPopup, generatePaymentReceiptContent)}
              className="p-2 rounded-lg bg-green-500 hover:bg-green-600 transition-colors text-white"
            >
              Pagar Todo
            </button>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleExport}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiDownload className="w-7 h-7 text-gray-600" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiRefreshCw className="w-7 h-7 text-gray-600" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Seleccionado</p>
              <p className="text-2xl font-bold text-blue-700">
                ${totalSelectedDebt.toLocaleString('es-ES')}
              </p>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center"
            >
              {showDetails ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
              <span className="ml-2">{showDetails ? "Ocultar Detalles" : "Mostrar Detalles"}</span>
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-4 max-h-[850px] overflow-y-auto">
            {debtData.map((debt, index) => (
              <div
                key={debt.NUMFACTUR}
                className={`p-4 rounded-lg transition-all ${selectedMonths.includes(debt.NUMFACTUR)
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200"
                  } border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedMonths.includes(debt.NUMFACTUR)}
                      onChange={() => handleMonthSelection(debt.NUMFACTUR)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-800">{format(new Date(debt.FECHA_MOVIMIENTO), "EEEE, d 'de' MMMM  yyyy", { locale: es })}</span>
                  </div>
                  <button
                    onClick={() => handleViewInvoice(debt.NUMFACTUR)}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  >
                    Ver Boleta
                  </button>
                </div>
                {index === debtData.length - 3 && (
                  <div className="flex justify-end">
                    <span className="px-2 py-1 rounded-full text-sm bg-amber-100 text-amber-700">
                      Pago mínimo para Reposicion
                    </span>
                  </div>
                )}
                <div className="pl-8">
                  <div className="flex items-center justify-between">
                    <span>
                      <p className="text-lg font-semibold text-gray-800">
                        ${parseFloat(debt.SALDO).toLocaleString('es-ES')}
                      </p></span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${debt.ESTADO_DEUDA === "DV"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                        }`}
                    >
                      {debt.ESTADO_DEUDA === "DV" ? "Deuda Vencida" : "Deuda Vigente"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600" style={{ display: 'flex' }}>
                    <p>Número de Factura: &nbsp;</p>
                    <p>{debt.NUMFACTUR}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex bg-green-500/10 py-4 px-5 rounded-lg">
          <span className="text-green-600">
            <p className="text-2xl font-semibold">Confirmar Monto:</p>
            <p className="text-3xl font-bold">${totalSelectedDebt.toLocaleString('es-ES')}</p>
          </span>
          <span className="flex gap-4 ml-auto">
            <button
              onClick={handlePaySelectedWrapper}
              className="rounded-lg bg-green-500 transition-colors text-4xl px-8 h-15 text-white"
            >
              <FiCheckCircle className="text-white animate-bounce" />
            </button>
          </span>
        </div>
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

      <Popup isOpen={showOperationPopup} onClose={handleCloseOperationPopup} title="Operación">
        <div className="flex justify-center mb-8 mt-4">
          {operationResult.success ? (
            <div className="flex flex-col items-center">
              <FiCheckCircle className="w-24 h-24 text-green-600 mb-4 animate-bounce" />
              <p className="text-3xl font-semibold text-green-700">¡Correcto!</p>
              <p className="text-lg text-gray-700 mb-8 text-center">{operationResult.message}</p>
              <button onClick={handleLogout} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FiX className="w-24 h-24 text-red-600 mb-4 animate-shake" />
              <p className="text-3xl font-semibold text-red-700">¡Incorrecto!</p>
              <p className="text-lg text-gray-700 mb-8 text-center">{operationResult.message}</p>
            </div>
          )}
        </div>
      </Popup>
    </div>
  );
};

export default Cuenta;