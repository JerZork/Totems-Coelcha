// frontend/src/utils/paymentUtils.js
import { PostAbonos } from "../services/abono.service.js";

export const handlePayAll = async (debtData, clientDetails, totalDebt, setOperationResult, setShowOperationPopup, generatePaymentReceiptContent) => {
  
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  let agrupacion;
  if (clientDetails.NUMERO_SERVICIO<50000){
     agrupacion = 1;
  }else{
     agrupacion = 2;
  }

  try {
    const payload = debtData.map(debt => ({
      monto: debt.SALDO,
      glosa: "Pago TOTEM WS por sistema",
      NUMSOC: clientDetails.NUMERO_SERVICIO,
      NUMFACTUR: debt.NUMFACTUR,
      usuario: user.NombreUsuario,
      Sucursal: user.Sucursal,  
      ID_AGRUPACION_CONTABLE: agrupacion,
      idTerminal: 80000382,  //cambiar
      serialNumber: "232UKD8Y7539",  //cambiar
      amount: totalDebt, // Se mantiene el monto total para cada pago según tu indicación
      ticketNumber: "1235", //cambiar
      saleType: 0, //consultar
      employeeId: 1,  //consultar
      customId: "000011111222222", //consultar
    }));
    console.log("5555555555555555555555555555555555555555555555555555555555");
    const response=await PostAbonos(payload);
    console.log("6666666666666666666666666666666666666666666666666666666666");  
    console.log(response);
    
    setOperationResult({ success: true, message: "Pago realizado con éxito" });
    setShowOperationPopup(true);
    generatePaymentReceiptContent(clientDetails, debtData, totalDebt);
  } catch (error) {
    const errorMessage = error.message || "Error al realizar el pago";
    setOperationResult({ success: false, message: errorMessage });
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