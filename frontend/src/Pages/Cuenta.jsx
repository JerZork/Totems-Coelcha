import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiCheck, FiX, FiDownload, FiFilter, FiRefreshCw, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import logo from "../assets/logoCoelcha.png";
import { getDetallePagos } from "../services/detallePagos.service.js";

const Cuenta = () => {
  const navigate = useNavigate();
  const { accessCode } = useParams();
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [debtData, setDebtData] = useState([]);
  const [clientDetails, setClientDetails] = useState(null);

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

    setSelectedMonths((prev) => {
      const newSelectedMonths = debtData
        .filter(debt => new Date(debt.FECHA_MOVIMIENTO) <= selectedDate)
        .map(debt => debt.NUMFACTUR);

      if (prev.includes(monthId)) {
        return newSelectedMonths;
      } else {
        return newSelectedMonths;
      }
    });
  };

  const totalSelectedDebt = debtData
    .filter((debt) => selectedMonths.includes(debt.NUMFACTUR))
    .reduce((acc, curr) => acc + parseFloat(curr.SALDO), 0);

  const totalDebt = debtData.reduce((acc, curr) => acc + parseFloat(curr.SALDO), 0);

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Export completed!");
    }, 1000);
  };

  const handleReset = () => {
    setSelectedMonths([]);
  };

  const handleLogout = () => {
    navigate("/home");
  };

  const handlePayAll = () => {
    alert("Pagando todo!");
  };

  const handlePaySelected = () => {
    alert("Pagando meses seleccionados!");
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
      <div className="bg-white rounded-xl shadow-lg p-12 mb-4 h-6/7">
        <header className="mb-6">
          <img src={logo} alt="Logo" className="mx-auto" />
        </header>

        {clientDetails && (
          <div className="mb-8 py-11 border-b pb-4 text-2xl font-bold text-gray-900">
                        
            <div className="flex justify-center text-4xl">
              <p></p>
              <p className="text-blue-900">{clientDetails.RAZON_SOCIAL}</p>
            </div>            
            <div className="flex justify-center">
              <p></p>
              <p>{clientDetails.DIR_NIVEL_AGRUPACION_1_EMPALME}</p>
            </div>
            <div className="flex justify-center">
              <p>NRO. SERVICIO:&nbsp;</p>
              <p> {clientDetails.NUMERO_SERVICIO}</p>
            </div>


          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cuentas Por Pagar</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiFilter className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiDownload className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiRefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Todos los Meses</p>
              <p className="text-2xl font-bold text-blue-700">
                ${totalDebt.toLocaleString()}
              </p>
            </div>
            <button
              onClick={handlePayAll}
              className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors"
            >
              Pagar Todo
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Seleccionado</p>
              <p className="text-2xl font-bold text-blue-700">
                ${totalSelectedDebt.toLocaleString()}
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
          <div className="space-y-4 max-h-[670px] overflow-y-auto">
            {debtData.map((debt, index) => (
              <div
                key={debt.NUMFACTUR}
                className={`p-4 rounded-lg transition-all ${
                  selectedMonths.includes(debt.NUMFACTUR)
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
                    <span className="font-medium text-gray-800">{format(new Date(debt.FECHA_MOVIMIENTO), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      debt.ESTADO_DEUDA === "DV"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {debt.ESTADO_DEUDA === "DV" ? "Deuda Vencida" : "Deuda Vigente"}
                  </span>
                </div>
                {index === debtData.length - 3 && (
                  <div className="flex justify-end">
                    <span className="px-2 py-1 rounded-full text-sm bg-amber-100 text-amber-700">
                      Pago mínimo para Reposicion
                    </span>
                  </div>
                )}
                <div className="pl-8">                  
                  <p className="text-lg font-semibold text-gray-800">
                    ${parseFloat(debt.SALDO).toLocaleString()}
                  </p>
                  <div className="text-sm text-gray-600" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Número de Factura</span>
                    <span>{debt.NUMFACTUR}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={handlePaySelected}
            className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors"
          >
            Pagar Seleccionados
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cuenta;