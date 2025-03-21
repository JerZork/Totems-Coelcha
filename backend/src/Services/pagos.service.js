import { AppDataSource } from "../config/configBD.js";
import Recaudacion_Pagos  from '../entity/recaudacion_pagos.entity.js';

export const getPagos = async (nroServicio) => {


    const setServicioQuery = `SET @servicio=${nroServicio};`;
    const selectQuery = `

SELECT
    T.NUMERO_SERVICIO,
    T.NUMFACTUR,
    T.FECHA_MOVIMIENTO AS FECHA_MOVIMIENTO,  -- Se eliminó MAX() para obtener la fecha deseada
    SUM(T.DEBE) - SUM(T.HABER) AS SALDO,
    IF(DATEDIFF(CURRENT_DATE(), T.FECHA_MOVIMIENTO) > 27, 'DV', 'DPV') AS ESTADO_DEUDA -- Se eliminó MAX() también aquí para coherencia
FROM (
    -- Subconsulta de cuentas corrientes (sin cambios)
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

    -- Subconsulta de pagos (sin cambios)
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


    try {



        const result = await AppDataSource.query(selectQuery, [nroServicio, nroServicio, nroServicio]);
        console.log('result:', result);
        return result;
    } catch (error) {
        console.error('Error en la consulta sql', error);
        throw new Error('Error executing query');
    }
};





export const insertarAbono = async (data) => {
    try {
        const abonoRepository = AppDataSource.getRepository(Recaudacion_Pagos);

        const { id, tipo, monto, rut_depositante, nro_cheque, banco, cta_cte, fecha_cheque, glosa, NUMSOC, NUMFACTUR,
            FECHA, DEBE1, HABER1, operacion_pago, usuario, fecha_actual, 
            fecha_deshacer, usuario_que_deshizo, Sucursal, Tipo_Documento, re_id, CARGA_FACTURACION, PLANILLA_NUM,
            Monto_Cupon, CODIGO_DOCUMENTO, RUT_TITULAR, SOCIO_CLIENTE, 
            ID_AGRUPACION_CONTABLE, CODIGO_AUTORIZACION, IDENTIFICADOR } = data;

        const newAbono = abonoRepository.create({
            id,
            tipo,
            monto,
            rut_depositante,
            nro_cheque,
            banco,
            cta_cte,
            fecha_cheque,
            glosa,
            NUMSOC,
            NUMFACTUR,
            FECHA,
            DEBE1,
            HABER1,
            operacion_pago,
            usuario,
            fecha_actual,
            fecha_deshacer,
            usuario_que_deshizo,
            Sucursal,
            Tipo_Documento,
            re_id,
            CARGA_FACTURACION,
            PLANILLA_NUM,
            Monto_Cupon,
            CODIGO_DOCUMENTO,
            RUT_TITULAR,
            SOCIO_CLIENTE,
            ID_AGRUPACION_CONTABLE,
            CODIGO_AUTORIZACION,
            IDENTIFICADOR
        });

        await abonoRepository.save(newAbono);


        return newAbono;

    } catch (error) {
        console.error('Error insertando el Abono', error);
        throw new Error('Error executing query');
    }
}