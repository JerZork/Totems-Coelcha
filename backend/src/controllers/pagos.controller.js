import { getPagos } from "../Services/pagos.service.js";
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
    console.log('en backend1111111');
    try {
        console.log('en backend');

        const body = req.body;
        console.log('Cuerpo de la petición:', body);

        if (!Array.isArray(body)) {
            return res.status(400).json({
                message: 'Error: Se esperaba un array de pagos en el cuerpo de la petición.'
            });
        }

        const response = await loginGetNet();

        const response_venta = await Venta(response, body[0].idTerminal, body[0].serialNumber, body[0].amount, body[0].ticketNumber, body[0].saleType, body[0].employeeId, body[0].customId);

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
  
        let response_operacion;
        await delay(7000)
        do {
             // Espera 2 segundos (2000 milisegundos)
            response_operacion = await respuesta_operacion(response_venta.data.data.idPosTxs, response, body[0].idTerminal, body[0].serialNumber, body[0].customId);
            await delay(2000);
            
            console.log('1111111111111111111111111111111111111111');
           console.log(response_operacion.data.code);
        } while (response_operacion.data.code == 2);


        if (response_operacion.data.data.response.responseCode== 0) {
            console.log('Transacción exitosa');
            const fecha_actual = new Date();
            let resultadosInsercion = [];

            for (const pago of body) {
                console.log('Procesando pago:', pago);
                try {
                    const detalle = await ConCliente(pago.NUMSOC);

                    //INSERCION A BASE DE DATOS
                    const data = {
                        tipo: "W",
                        monto: pago.monto,
                        glosa: pago.glosa,
                        NUMSOC: pago.NUMSOC,
                        NUMFACTUR: pago.NUMFACTUR,
                        FECHA: fecha_actual,
                        DEBE1: 0,
                        HABER1: pago.monto,
                        operacion_pago: "pago",
                        usuario: pago.usuario,
                        Tipo_Documento: "B",
                        Sucursal: pago.Sucursal,
                        re_id: null,
                        CODIGO_DOCUMENTO: COD_DOC(pago.NUMSOC, pago.NUMFACTUR),
                        RUT_TITULAR: detalle[0].RUT_CLIENTE,
                        SOCIO_CLIENTE: detalle[0].SOCIO_CLIENTE,
                        ID_AGRUPACION_CONTABLE: pago.ID_AGRUPACION_CONTABLE,
                        CODIGO_AUTORIZACION: pago.CODIGO_AUTORIZACION,
                        IDENTIFICADOR: pago.IDENTIFICADOR,
                    };
                    const newAbono = await insertarAbonoService(data);
                    resultadosInsercion.push({ success: true, abono: newAbono });

                } catch (error) {
                    console.log('Error al insertar el abono:');
                    return res.status(500).json({
                        message: 'Error al insertar los abonos',
                        error: error.message


                    });
                }
            }

            res.status(201).json({
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
        console.error('Error general al insertar los abonos:',);
        return res.status(500).json({
            message: 'Error al insertar los abonos',
            error: error.message
        });
    }
};
