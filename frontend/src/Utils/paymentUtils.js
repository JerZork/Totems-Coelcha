// frontend/src/utils/paymentUtils.js
import { PostAbonos } from "../services/abono.service.js";

export const handlePayAll = async (debtData, clientDetails, totalDebt, setOperationResult, setShowOperationPopup, generatePaymentReceiptContent) => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  try {
    const payload = debtData.map(debt => ({
      monto: 1,
      glosa: "Pago TOTEM WS por sistema",
      NUMSOC: clientDetails.NUMERO_SERVICIO,
      NUMFACTUR: debt.NUMFACTUR,
      usuario: user.NombreUsuario,
      Sucursal: user.Sucursal,
      CODIGO_AUTORIZACION: 1,
      IDENTIFICADOR: "1",
      ID_AGRUPACION_CONTABLE: clientDetails.ID_AGRUPACION_CONTABLE
    }));

    await PostAbonos(payload);
    setOperationResult({ success: true, message: "Pago realizado con éxito" });
    setShowOperationPopup(true);
    generatePaymentReceiptContent(clientDetails, debtData, totalDebt);
  } catch (error) {
    setOperationResult({ success: false, message: "Error al realizar el pago" });
    setShowOperationPopup(true);
  }
};

export const handlePaySelected = async (selectedDebts, clientDetails, totalSelectedDebt, setOperationResult, setShowOperationPopup, generatePaymentReceiptContent) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (selectedDebts.length === 0) {
    setOperationResult({ success: false, message: "Por favor selecciona meses a pagar" });
    setShowOperationPopup(true);
    return;
  }

  try {
    const payload = selectedDebts.map(debt => ({
      monto: 1,
      glosa: "Pago TOTEM WS por sistema",
      NUMSOC: clientDetails.NUMERO_SERVICIO,
      NUMFACTUR: debt.NUMFACTUR,
      usuario: user.NombreUsuario,
      Sucursal: user.Sucursal,
      CODIGO_AUTORIZACION: 1,
      IDENTIFICADOR: "1",
      ID_AGRUPACION_CONTABLE: clientDetails.ID_AGRUPACION_CONTABLE
    }));

    await PostAbonos(payload);
    setOperationResult({ success: true, message: "Pago realizado con éxito" });
    setShowOperationPopup(true);
    generatePaymentReceiptContent(clientDetails, selectedDebts, totalSelectedDebt);
  } catch (error) {
    setOperationResult({ success: false, message: "Error al realizar el pago" });
    setShowOperationPopup(true);
  }
};