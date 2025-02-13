import axios from 'axios';

export async function getDetallePagos(nroServicio) {
    try {
        console.log('entrando a getDetallePagos');
        const response = await axios.post(`/api/cuenta/`, { nroservice: nroServicio });
        return response.data;
    } catch (error) {
        console.error('Error en la consulta sql de obtener el detalle de pagos', error);
        throw new Error(`Error en la consulta sql de obtener el detalle de pagos: ${error.message}`);
    }
}

export async function checkClienteExiste(nroServicio) {
    try {
        console.log('entrando a checkClienteExiste');
        const response = await axios.get(`/api/verificar/${nroServicio}`);
        return response.data;
    } catch (error) {
        console.error('Error en la consulta sql de obtener existencia de cliente', error);
        throw new Error(`Error en la consulta sql de obtener existencia de cliente: ${error.message}`);
    }
}

export async function getNroService(nroBoleta) {
    try {
        const response = await axios.get(`api/obtenerServicio/${nroBoleta}`);
        return response.data;
    } catch (error) {
        console.error('Error en la consulta sql de obtener el numero de servicio', error);
        throw new Error(`Error en la consulta sql de obtener el numero de servicio: ${error.message}`);
    }
}