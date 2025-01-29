import { checkClienteExiste } from "../Services/clienteDetalle.service.js";

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