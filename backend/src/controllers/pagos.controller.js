import { getPagos } from "../Services/pagos.service.js";
import {ConCliente, getClienteDetalle} from '../Services/clienteDetalle.service.js';
import { insertarAbono as insertarAbonoService } from '../Services/pagos.service.js';

export const obtenerPagos = async (req, res) => {
    try {
   
        const nroservice = req.body.nroservice;
        
        const data = await getPagos(nroservice);
        const detalle= await getClienteDetalle(nroservice);
       
        res.status(200).json({detalle:detalle, pagos: data});

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
        console.log('data:', body);
        const fecha_actual = new Date();
        console.log('fecha_actual:', fecha_actual);

        const detalle= await ConCliente(body.NUMSOC);
        console.log('detalle:', detalle);
        const data = {
            tipo: "W",
            monto: body.monto,
            glosa: body.glosa,
            NUMSOC: body.NUMSOC,
            NUMFACTUR:body.NUMFACTUR,
            FECHA:fecha_actual,
            DEBE1: 0,
            HABER1: body.monto,
            operacion_pago: "pago",
            usuario: body.usuario,
            Tipo_Documento:"B",
            Sucursal: body.Sucursal,
            re_id: null,
            CODIGO_DOCUMENTO:COD_DOC(body.NUMSOC, body.NUMFACTUR), 
            RUT_TITULAR:detalle[0].RUT_CLIENTE,
            SOCIO_CLIENTE:detalle[0].SOCIO_CLIENTE,        
            ID_AGRUPACION_CONTABLE:body.ID_AGRUPACION_CONTABLE,
            CODIGO_AUTORIZACION: body.CODIGO_AUTORIZACION,
            IDENTIFICADOR: body.IDENTIFICADOR
            

        };
        console.log('data:', data);

        
        const newAbono = await insertarAbonoService(data);
        res.status(201).json({
            message: 'Abono insertado correctamente',
            abono: newAbono
        });
    } catch (error) {
        console.error('Error al insertar el abono:', error);
        res.status(500).json({
            message: 'Error al insertar el abono',
            error: error.message
        });
    }
};
