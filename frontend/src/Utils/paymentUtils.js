// frontend/src/utils/paymentUtils.js
import { act, use } from "react";
import { PostAbonos } from "../services/abono.service.js";

export const handlePayAll = async (debtData, clientDetails, totalDebt, setOperationResult, setShowOperationPopup, generatePaymentReceiptContent) => {
  
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
 

  let hora_actual = new Date();
  hora_actual = hora_actual.getHours() + hora_actual.getMinutes() + hora_actual.getSeconds();
  const customId = user.pos_serialnumber.slice(-4) + clientDetails.NUMERO_SERVICIO + hora_actual;
  const rutDepositante = JSON.parse(sessionStorage.getItem("rutDepositante"));
  let formattedRutDepositante = rutDepositante.replace(/\./g, '');
  if (formattedRutDepositante.length > 10) {
    formattedRutDepositante = formattedRutDepositante.slice(0, 10);
  }



  let agrupacion;
  if (clientDetails.NUMERO_SERVICIO<50000){
     agrupacion = 1;
  }else{
     agrupacion = 2;
  }
  

  try {
    const trama = clientDetails.NUMERO_SERVICIO.toString().padStart(5, '0').slice(-5) + user.id_totem.toString().padStart(5, '0').slice(-5);
    
    const payload = debtData.map(debt => ({
      monto: debt.SALDO,
      glosa: "Pago TOTEM WS por sistema." + " rut ingresado en totem " + formattedRutDepositante,
      NUMSOC: clientDetails.NUMERO_SERVICIO,
      NUMFACTUR: debt.NUMFACTUR,
      usuario: user.usuario,
      Sucursal: user.sucursal,  
      ID_AGRUPACION_CONTABLE: agrupacion,
      idTerminal: user.pos_idterminal, 
      serialNumber: user.pos_serialnumber,  
      amount: totalDebt, 
      ticketNumber:trama , //cambiar
      saleType: 1, //consultar
      employeeId: user.id_totem,  
      customId: customId, //consultar
    }));

    const response=await PostAbonos(payload);

    setOperationResult({ success: true, message: "Pago realizado con éxito" });
    setShowOperationPopup(true);
    generatePaymentReceiptContent(clientDetails, debtData, totalDebt);
  } catch (error) {
    console.log(error); 
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