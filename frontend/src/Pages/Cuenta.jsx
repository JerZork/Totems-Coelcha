import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiX, FiDownload, FiFilter, FiRefreshCw, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { format } from "date-fns";
import logo from "../assets/logoCoelcha.png";

const mockDebtData = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  month: format(new Date(2024, index, 1), "MMMM yyyy"),
  totalDebt: Math.floor(Math.random() * 10000) + 1000,
  status:  "Pendiente",
  entries: [
    { description: "Credit Card", amount: Math.floor(Math.random() * 1000) + 500 },
    { description: "Personal Loan", amount: Math.floor(Math.random() * 2000) + 1000 },
    { description: "Utilities", amount: Math.floor(Math.random() * 300) + 100 }
  ]
}));

const Cuenta = () => {
  const navigate = useNavigate();
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleMonthSelection = (monthId) => {
    setSelectedMonths((prev) => {
      if (prev.includes(monthId)) {
        return prev.filter((id) => id <= monthId);
      } else {
        const cascadingMonths = mockDebtData
          .filter((debt) => debt.id <= monthId)
          .map((debt) => debt.id);
        return [...new Set([...prev, ...cascadingMonths])];
      }
    });
  };

  const totalSelectedDebt = useMemo(() => {
    return mockDebtData
      .filter((debt) => selectedMonths.includes(debt.id))
      .reduce((acc, curr) => acc + curr.totalDebt, 0);
  }, [selectedMonths]);

  const totalDebt = useMemo(() => {
    return mockDebtData.reduce((acc, curr) => acc + curr.totalDebt, 0);
  }, []);

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
    // Aquí puedes agregar la lógica para cerrar sesión, como limpiar tokens, etc.
    navigate("/home");
  };

  const handlePayAll = () => {
    alert("Pagando todo!");
  };

  const handlePaySelected = () => {
    alert("Pagando meses seleccionados!");
  };

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
    <div className="min-h-screen bg-blue-200 p-24 flex flex-col justify-center" style={{ height: "1802px", width: "1080px" }}>
      <div className="bg-white rounded-xl shadow-lg p-12 mb-4 h-6/7">
        <header className="mb-6">
          <img src={logo} alt="Logo" className="mx-auto" />
        </header>
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
              onClick={handlePaySelected}
              className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors"
            >
              Pagar Seleccionados
            </button>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center"
          >
            {showDetails ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
            <span className="ml-2">{showDetails ? "Ocultar Detalles" : "Mostrar Detalles"}</span>
          </button>
        </div>

        {showDetails && (
          <div className="space-y-4 max-h-[850px] overflow-y-auto">
            {mockDebtData.map((debt) => (
              <div
                key={debt.id}
                className={`p-4 rounded-lg transition-all ${
                  selectedMonths.includes(debt.id)
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                } border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedMonths.includes(debt.id)}
                      onChange={() => handleMonthSelection(debt.id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-800">{debt.month}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      debt.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {debt.status}
                  </span>
                </div>
                <div className="pl-8">
                  <p className="text-lg font-semibold text-gray-800">
                    ${debt.totalDebt.toLocaleString()}
                  </p>
                  <div className="mt-2 space-y-1">
                    {debt.entries.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>{entry.description}</span>
                        <span>${entry.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cuenta;