import { AppDataSource } from "../config/configBD.js";

export const getPagos = async (nroServicio) => {
    console.log('nroServicio: antes de entrara a la consulta', nroServicio);
    
    const setServicioQuery = `SET @servicio=${nroServicio};`;
    const selectQuery = `


SELECT 
    T.NUMERO_SERVICIO,
    T.NUMFACTUR,
    MAX(T.FECHA_MOVIMIENTO) AS FECHA_MOVIMIENTO,
    SUM(T.DEBE) - SUM(T.HABER) AS SALDO,
    IF(DATEDIFF(CURRENT_DATE(), MAX(T.FECHA_MOVIMIENTO)) > 27, 'DV', 'DPV') AS ESTADO_DEUDA
FROM (
    -- Subconsulta de cuentas corrientes
    SELECT 
        cc.NUMERO_SERVICIO,
        d.NUMERO_DOCUMENTO AS NUMFACTUR,
        cc.FECHA_MOVIMIENTO,
        SUM(cc.DEBE - cc.HABER) AS DEBE,
        0 AS HABER
    FROM cuentas_corrientes cc
    INNER JOIN documentos d 
        ON cc.CODIGO_DOCUMENTO = d.CODIGO_DOCUMENTO
    WHERE 
        cc.NUMERO_SERVICIO = ?
    GROUP BY d.NUMERO_DOCUMENTO
    HAVING DEBE > 0

    UNION ALL
    
    -- Subconsulta de pagos
    SELECT 
        rp.NUMSOC,
        rp.NUMFACTUR,
        rp.FECHA,
        0 AS DEBE,
        SUM(rp.HABER1) AS HABER
    FROM recaudacion_pagos rp
    LEFT JOIN (
        SELECT 
            NUMERO_SERVICIO, 
            MAX(FECHA_MOVIMIENTO) AS FECHA 
        FROM cuentas_corrientes 
        WHERE 
            ID_OPERACION = 5 
            AND NUMERO_SERVICIO = ?
        GROUP BY NUMERO_SERVICIO
    ) pu 
        ON rp.NUMSOC = pu.NUMERO_SERVICIO
    WHERE 
        rp.NUMSOC = ?
        AND rp.operacion_pago = 'pago'
        AND rp.FECHA > COALESCE(pu.FECHA, '2000-01-01')
    GROUP BY rp.NUMFACTUR
) AS T
GROUP BY T.NUMFACTUR
HAVING SALDO > 0;
    `;

    console.log('termino de la consulta');
    try {

        const result = await AppDataSource.query(selectQuery, [nroServicio, nroServicio, nroServicio]);
        return result;
    } catch (error) {
        console.error('Error en la consulta sql', error);
        throw new Error('Error executing query');
    }
};