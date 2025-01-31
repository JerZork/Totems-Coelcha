import axios from 'axios';

export async function getDetallePagos(nroServicio) {
    try {
        console.log('entrando a getDetallePagos');
        const response = await axios.get(`http://192.168.1.157:3001/api/cuenta/${nroServicio}`);

        return response.data;
    } catch (error) {
        console.error('Error en la consulta sql', error);
        throw new Error('Error executing query');
    }
}

export async function checkClienteExiste(nroServicio) {
    try {
        console.log('entrando a getDetallePagos');
        const response = await axios.get(`http://192.168.1.157:3001/api/verificar/${nroServicio}`);


        return response.data;
    } catch (error) {
        console.error('Error en la consulta sql', error);
        throw new Error('Error executing query');
    }
}

export async function getNroService(nroBoleta) {
    try {
        
        const response = await axios.get(`http://192.168.1.157:3001/api/obtenerServicio/${nroBoleta}`);
        return response.data;
    }
    catch (error) {
        console.error('Error en la consulta sql', error);
        throw new Error('Error executing query');
    }
}