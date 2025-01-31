import { checkClienteExiste } from "../Services/clienteDetalle.service.js";
import { obtenerConBoleta } from "../Services/clienteDetalle.service.js";

export const verificarCliente = async (req, res) => {
    try {
        console.log('Verificando existencia de cliente');
        const nroServicio = req.params.nroServicio;
        
        const existe = await checkClienteExiste(nroServicio);
        console.log('Existencia de cliente verificada', existe);
        
        if (existe) {
            res.status(200).json({ message: 'True' });
        } else {
            res.status(404).json({ message: 'False' });
        }

    } catch (error) {
        console.error('Error al verificar existencia de cliente', error);
        res.status(500).json({ message: 'Error al verificar existencia de cliente' });
    }
}

export const obtenerNroser = async (req, res) => {
    try {
        console.log('Obteniendo nroser');
        const nroFactura = req.params.nroFactura;
        
        const nroser = await obtenerConBoleta(nroFactura);
        console.log('Nroser obtenido', nroser);
        
        res
            .status(200)
            .send(nroser);

    } catch (error) {
        console.error('Error al obtener nroser', error);
        res.status(500).json({ message: 'Error al obtener numero de servicio' });
    }
}