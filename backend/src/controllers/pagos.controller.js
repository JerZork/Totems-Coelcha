import { getPagos, getReId, FehcaContable, getplanilla, crearPlanilla } from "../Services/pagos.service.js";
import { ConCliente, getClienteDetalle } from '../Services/clienteDetalle.service.js';
import { insertarAbono as insertarAbonoService } from '../Services/pagos.service.js';
import { loginGetNet, PollingGetNet, Venta, respuesta_operacion } from '../controllers/getnet.controller.js';

export const obtenerPagos = async (req, res) => {
    try {

        const nroservice = req.body.nroservice;
        const data = await getPagos(nroservice);
        const detalle = await getClienteDetalle(nroservice);

        res.status(200).json({ detalle: detalle, pagos: data });

    } catch (error) {
        console.error('Error al obtener pagos', error);
        res.status(500).json({ message: 'Error al obtener pagos' });

    }

}

const padWithZeros = (num, length) => {
    return String(num).padStart(length, '0');
};

const COD_DOC = (NUMSOC, NUMFACTUR) => {
    const paddedNUMSOC = padWithZeros(NUMSOC, 5);
    const paddedNUMFACTUR = padWithZeros(NUMFACTUR, 8);
    return `${paddedNUMSOC}BE${paddedNUMFACTUR}`;
};




export const insertarAbono = async (req, res) => {
    try {

        const body = req.body;
        console.log('Cuerpo de la petición:', body);
        if (!Array.isArray(body)) {
            return res.status(400).json({
                message: 'Error: Se esperaba un array de pagos en el cuerpo de la petición.'     //se valida que el cuerpo de la peticion sea un array
            });
        }
        const response = await loginGetNet();           //se obtiene el token de getnet, siempre que haga una transaccion con getnet debo antes obtener el token logeandome
        const response_venta = await Venta(response, body[0].idTerminal, body[0].serialNumber, body[0].amount, body[0].ticketNumber, body[0].saleType, body[0].employeeId, body[0].customId); //se realiza la venta en getnet dandole los parametros
        
        
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));         //para evitar errores se hace un delay de 7 segundos para que getnet procese la venta
        }
        let response_operacion;
        await delay(7000)
        do {
             // Espera 2 segundos (2000 milisegundos)
            response_operacion = await respuesta_operacion(response_venta.data.data.idPosTxs, response, body[0].idTerminal, body[0].serialNumber, body[0].customId); //se obtiene la respuesta de la operacion consultado el estado de la operacion cada 2 segundos
            await delay(2000);
            

        } while (response_operacion.data.code == 2);


        if (response_operacion.data.data.response.responseCode== 0) {           //si la respuesta de la operacion es 0 se procede a insertar los abonos (0 es correcto en getnet)
        // const auxiliar = 0
        //     if (auxiliar== 0) { 
            let resultadosInsercion = [];
            console.log('Transacción exitosa');
            const fecha_actual = new Date();
            const fecha_contable = await FehcaContable();       //se obtiene la fecha contable
            let numeroPlanilla = await getplanilla(fecha_contable, body[0].ID_AGRUPACION_CONTABLE  ); //se obtiene el numero de planilla si es que existe
            if (numeroPlanilla.length == 0) {   //si no existe planilla se crea una nueva
                const respuesta= await crearPlanilla(body[0].ID_AGRUPACION_CONTABLE, fecha_contable, body[0].usuario, fecha_actual); 
                numeroPlanilla = await getplanilla(fecha_contable, body[0].ID_AGRUPACION_CONTABLE ); //se obtiene el numero de planilla
            }
            const re_id= await getReId() //se obtiene el re_id para insertar en la base de datos
            for (const pago of body) {
                console.log('Procesando pago:', pago);
                try {
                    const detalle = await ConCliente(pago.NUMSOC);

                    //INSERCION A BASE DE DATOS
                    const data = {
                        tipo: "g",
                        monto: pago.monto,
                        glosa: pago.glosa,
                        NUMSOC: pago.NUMSOC,
                        NUMFACTUR: pago.NUMFACTUR,
                        FECHA: fecha_contable, 
                        DEBE1: 0,
                        HABER1: pago.monto,
                        operacion_pago: "pago",
                        usuario: pago.usuario,
                        fecha_actual: fecha_actual,
                        Tipo_Documento: "B",
                        Sucursal: pago.Sucursal,
                        re_id: re_id,
                        CODIGO_DOCUMENTO: COD_DOC(pago.NUMSOC, pago.NUMFACTUR),
                        RUT_TITULAR: detalle[0].RUT_CLIENTE,
                        SOCIO_CLIENTE: detalle[0].SOCIO_CLIENTE,
                        ID_AGRUPACION_CONTABLE: pago.ID_AGRUPACION_CONTABLE,
                        PLANILLA_NUM: numeroPlanilla,
                        
                    };
                    const newAbono = await insertarAbonoService(data);
                    resultadosInsercion.push({ success: true, abono: newAbono });
                   

                } catch (error) {
                    console.log('Error al insertar el abono:');
                    console.log(error);
                    return res.status(500).json({
                        message: 'Error al insertar los abonos',
                        error: error.message


                    });
                }
            }

            return res.status(201).json({
                message: 'Abonos insertados correctamente',
                resultados: resultadosInsercion
            });
        } else {
            console.log('Transacción fallida');
            return res.status(400).json({
                message: 'Transacción desde pos de getnet fallida'
            });
        }


    } catch (error) {
        console.error('Error general al insertar los abonos:',error);
        return res.status(500).json({
            message: 'Error al insertar los abonos',
            error: error.message
        });
    }
};



