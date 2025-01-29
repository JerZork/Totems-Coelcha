import { AppDataSource } from "../config/configBD.js";

export const getClienteDetalle = async (nroServicio) => {
    console.log('nroServicio: antes de entrar a la consulta', nroServicio);
    
    const selectQuery = `
SELECT NUMERO_SERVICIO, DIR_NIVEL_AGRUPACION_1_EMPALME, RAZON_SOCIAL 
FROM empalmes e
WHERE e.NUMERO_SERVICIO = ?;
    `;
    console.log('termino consulta clienteDetalle');
    try {
        const result = await AppDataSource.query(selectQuery, [nroServicio]);
        return result;
        
    } catch (error) {
        console.log('Error en consultar cliente detalle ', error);
        throw new Error('Error en consultar cliente detalle ');
        
    }

}

export const checkClienteExiste = async (nroServicio) => {
    console.log('nroServicio: antes de verificar existencia', nroServicio);
    
    const selectQuery = `
SELECT COUNT(*) as count
FROM empalmes e
WHERE e.NUMERO_SERVICIO = ?;
    `;
    console.log('termino verificación de existencia de cliente');
    try {
        const result = await AppDataSource.query(selectQuery, [nroServicio]);
        return result[0].count > 0;
        
    } catch (error) {
        console.log('Error en verificar existencia de cliente ', error);
        throw new Error('Error en verificar existencia de cliente ');
        
    }
}

