import { AppDataSource } from "../config/configBD.js";

export const getPagos = async (nroServicio) => {
    console.log('nroServicio: antes de entrara a la consulta', nroServicio);
    
    const setServicioQuery = `SET @servicio=${nroServicio};`;
    const selectQuery = `
    SELECT
        T.NUMERO_SERVICIO, T.NUMFACTUR, T.FECHA_MOVIMIENTO, (SUM(T.DEBE) - SUM(T.HABER)) AS SALDO,
        IF(((TO_DAYS(NOW()) - TO_DAYS(T.FECHA_MOVIMIENTO)) > 27), 'DV', 'DPV') AS ESTADO_DEUDA
    FROM
    (
        SELECT
            cuentas_corrientes.NUMERO_SERVICIO AS NUMERO_SERVICIO,
            documentos.NUMERO_DOCUMENTO AS NUMFACTUR,
            cuentas_corrientes.FECHA_MOVIMIENTO AS FECHA_MOVIMIENTO,
            SUM(cuentas_corrientes.DEBE) AS DEBE, 0 AS HABER
        FROM
            cuentas_corrientes
        INNER JOIN documentos ON cuentas_corrientes.CODIGO_DOCUMENTO = documentos.CODIGO_DOCUMENTO
        WHERE
            cuentas_corrientes.NUMERO_SERVICIO = @servicio
        GROUP BY
            documentos.NUMERO_DOCUMENTO
        HAVING
            (SUM(cuentas_corrientes.DEBE) - SUM(cuentas_corrientes.HABER)) > 0
        UNION
        SELECT
            recaudacion_pagos.NUMSOC, recaudacion_pagos.NUMFACTUR, recaudacion_pagos.FECHA, 0 AS DEBE, SUM(recaudacion_pagos.HABER1) AS HABER
        FROM recaudacion_pagos
        LEFT JOIN (
            SELECT cuentas_corrientes.NUMERO_SERVICIO, MAX(cuentas_corrientes.FECHA_MOVIMIENTO) AS FECHA FROM cuentas_corrientes
            WHERE cuentas_corrientes.ID_OPERACION = 5
            GROUP BY cuentas_corrientes.NUMERO_SERVICIO
        ) PAGO_ULT
        ON PAGO_ULT.NUMERO_SERVICIO = recaudacion_pagos.NUMSOC
        WHERE
            recaudacion_pagos.FECHA > IF(ISNULL(PAGO_ULT.FECHA), '2000-01-01 00:00:00', PAGO_ULT.FECHA)
            AND recaudacion_pagos.NUMSOC = @servicio AND recaudacion_pagos.operacion_pago = 'pago'
        GROUP BY recaudacion_pagos.NUMFACTUR
    ) AS T
    GROUP BY T.NUMFACTUR
    HAVING (SUM(T.DEBE) - SUM(T.HABER)) > 0;
    `;

    console.log('termino de la consulta');
    try {
        await AppDataSource.query(setServicioQuery);
        const result = await AppDataSource.query(selectQuery);
        return result;
    } catch (error) {
        console.error('Error en la consulta sql', error);
        throw new Error('Error executing query');
    }
};