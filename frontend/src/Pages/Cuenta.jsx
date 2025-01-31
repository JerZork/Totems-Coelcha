import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiCheck, FiX, FiDownload, FiRefreshCw, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import logo from "../assets/LOGO_HORIZONTAL.png";
import { getDetallePagos } from "../services/detallePagos.service.js";

const Cuenta = () => {
  const navigate = useNavigate();
  const { accessCode } = useParams();
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [debtData, setDebtData] = useState([]);
  const [clientDetails, setClientDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState("");

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

  const handleViewInvoice = (numFactur) => {
    setInvoiceUrl(`https://www.coelcha.cl/Clientes-Online2/BuscarBoleta_sistemaRecaudacion.php?Folio=${numFactur}`);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setInvoiceUrl("");
  };

  const totalSelectedDebt = debtData
    .filter((debt) => selectedMonths.includes(debt.NUMFACTUR))
    .reduce((acc, curr) => acc + parseFloat(curr.SALDO), 0);

  const totalDebt = debtData.reduce((acc, curr) => acc + parseFloat(curr.SALDO), 0);

  const generatePrintableContent = (clientDetails, selectedDebts, total) => {
    const printDate = new Date().toLocaleDateString('es-ES');

    const content = `
      <div id="printableContent">
        <style>
          @media print {
            @page {
             /* Cambia el tamaño del papel a A4 */
              margin: 0; /* Elimina los márgenes predeterminados */
            }
            body * {
              visibility: hidden;
            }
            #printableContent, #printableContent * {
              visibility: visible;
            }
            #printableContent {
              position: absolute;
              left: 0;
              top: 0;
              width: 100mm; /* Cambiado de 80mm a 100mm */
              font-family: 'Arial Narrow', sans-serif;
              font-size: 12px;
              margin: 0;
              padding: 2mm;
            }
            .header {
              text-align: center;
              margin-bottom: 3mm;
            }
            .logo {
              max-width: 60mm;
              height: auto;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 3mm 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              padding: 1mm 0;
              vertical-align: top;
            }
            .total {
              font-weight: bold;
              margin-top: 3mm;
            }
            button, input, .no-print {
              display: none !important;
            }
          }
        </style>
        <div class="header">
          <img src="${logo}" class="logo" alt="Logo">
          <h2>COELCHA LTDA.</h2>
          <p>Osvaldo Cruz Muñoz 160, Monte Águila</p>
          <p>${printDate}</p>
          <p>Rut: 80.238.000-3</p>
          <p>FONO: 800 123 995 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;600 4500 400 </p>

  
        </div>
        
        <div class="divider"></div>

        <table>
          <tr>
            <td colspan="2"><strong>Cliente:</strong></td>
          </tr>
          <tr>
            <td colspan="2">${clientDetails.RAZON_SOCIAL}</td>
          </tr>
          <tr>
            <td>Número de Servicio:</td>
            <td>${clientDetails.NUMERO_SERVICIO}</td>
          </tr>
        </table>

        <div class="divider"></div>

        <table>
          <tr>
            <th align="left">Fecha</th>
            <th align="right">Número de Factura</th>
            <th align="right">Valor</th>
          </tr>
          ${selectedDebts.map(debt => `
            <tr>
              <td>${format(new Date(debt.FECHA_MOVIMIENTO), "MMM/yyyy", { locale: es })}</td>
              <td align="right">${debt.NUMFACTUR}</td>
              <td align="right">$${parseFloat(debt.SALDO).toLocaleString()}</td>
            </tr>
          `).join('')}
        </table>

        <div class="divider"></div>

        <table>
          <tr>
            <td><strong>TOTAL:</strong></td>
            <td align="right"><strong>$${total.toLocaleString()}</strong></td>
          </tr>
        </table>

        <p style="text-align: center; margin-top: 5mm;">Web: www.coelcha.cl</p>
        <p style="text-align: center;">e-mail: coelcha@coelcha.cl</p>
      </div>
    `;

    const printContainer = document.createElement('div');
    printContainer.innerHTML = content;
    document.body.appendChild(printContainer);
    window.print();
    document.body.removeChild(printContainer);
  };

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
    navigate("/");
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
      <div className="bg-white rounded-xl shadow-lg p-12 mb-4 h-[1700px]">
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
                    <span className="font-medium text-gray-800">{format(new Date(debt.FECHA_MOVIMIENTO), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${debt.ESTADO_DEUDA === "DV"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    {debt.ESTADO_DEUDA === "DV" ? "Deuda Vencida" : "Deuda Vigente"}
                  </span>
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

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4">
            <div className="flex justify-end">
              <button onClick={closePopup} className="text-red-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <iframe src={invoiceUrl} className="w-full h-full" title="Invoice"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cuenta;