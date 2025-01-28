import { getPagos } from "../Services/pagos.service.js";

export const obtenerPagos = async (req, res) => {
    try {
        console.log('Obteniendo pagos');
        const nroservice = req.params.nroservice;
        const data = await getPagos(nroservice);
        console.log('Pagos obtenidos', data);
        res.status(200).json(data);

    } catch (error) {
        console.error('Error al obtener pagos', error);
        res.status(500).json({ message: 'Error al obtener pagos' });

    }


}