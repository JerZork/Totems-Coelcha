import { AppDataSource } from "../config/configBD.js";

export const getClienteDetalle = async (nroServicio) => {
   
    
    const selectQuery = `
SELECT NUMERO_SERVICIO, DIR_NIVEL_AGRUPACION_1_EMPALME, RAZON_SOCIAL 
FROM empalmes e
WHERE e.NUMERO_SERVICIO = ?;
    `;
   
    try {
        const result = await AppDataSource.query(selectQuery, [nroServicio]);
        return result;
        
    } catch (error) {
        console.log('Error en consultar cliente detalle ', error);
        throw new Error('Error en consultar cliente detalle ');
        
    }

}

export const checkClienteExiste = async (nroServicio) => {

    
    const selectQuery = `
SELECT COUNT(*) as count
FROM empalmes e
WHERE e.NUMERO_SERVICIO = ?;
    `;
  
    try {
        const result = await AppDataSource.query(selectQuery, [nroServicio]);
        return result[0].count > 0;
        
    } catch (error) {
        console.log('Error en verificar existencia de cliente ', error);
        throw new Error('Error en verificar existencia de cliente ');
        
    }
}

export const obtenerConBoleta = async (nroServicio) => {
   
    
    const selectQuery = `
  
SELECT NUMERO_SERVICIO FROM documentos e
WHERE e.NUMERO_DOCUMENTO = ?;
    `;
 
    try {
        const result = await AppDataSource.query(selectQuery, [nroServicio]);
        return result;
        
    } catch (error) {
        console.log('Error en obtener con boleta ', error);
        throw new Error('Error en obtener con boleta ');
        
    }
}