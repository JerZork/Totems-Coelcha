import { getPagos } from "../Services/pagos.service.js";
import {getClienteDetalle} from '../Services/clienteDetalle.service.js';

export const obtenerPagos = async (req, res) => {
    try {
   
        const nroservice = req.params.nroservice;
        
        const data = await getPagos(nroservice);
        const detalle= await getClienteDetalle(nroservice);
       
        res.status(200).json({detalle:detalle, pagos: data});

    } catch (error) {
        console.error('Error al obtener pagos', error);
        res.status(500).json({ message: 'Error al obtener pagos' });

    }


}

