import { EntitySchema } from "typeorm";

const Recaudacion_Pagos = new EntitySchema({
    name: 'recaudacion_pagos',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
            comment: 'Identificador único de cada nuevo registro agregado a la recaudación de pagos'
        },
        tipo: {
            type: 'char',
            length: 1,
            nullable: true,
            comment: 'e=efectivo, c=cheque m=multiples doc cheq, n=multiples doc efectivo, N=Transbank, f=Abono saldo a favor de cliente, w=Webservice, b=Trajeta debito, a=Tarjeta crédito, d=Deposito Directo, v=Convenio, s=Convenio x subsidio, k=Cupón subsidio, t=Traspaso'
        },
        monto: {
            type: 'int',
            nullable: true
        },
        rut_depositante: {
            type: 'varchar',
            length: 10,
            nullable: true
        },
        nro_cheque: {
            type: 'varchar',
            length: 11,
            nullable: true
        },
        banco: {
            type: 'varchar',
            length: 25,
            nullable: true
        },
        cta_cte: {
            type: 'varchar',
            length: 25,
            nullable: true
        },
        fecha_cheque: {
            type: 'date',
            nullable: true
        },
        glosa: {
            type: 'varchar',
            length: 250,
            nullable: true
        },
        NUMSOC: {
            type: 'int',
            nullable: true
        },
        NUMFACTUR: {
            type: 'int',
            nullable: true
        },
        FECHA: {
            type: 'datetime',
            nullable: true
        },
        DEBE1: {
            type: 'int',
            nullable: true
        },
        HABER1: {
            type: 'int',
            nullable: true
        },
        operacion_pago: {
            type: 'varchar',
            length: 15,
            nullable: true
        },
        usuario: {
            type: 'varchar',
            length: 30,
            nullable: true
        },
        fecha_actual: {
            type: 'datetime',
            nullable: false,
            default: '0000-00-00 00:00:00'
        },
        fecha_deshacer: {
            type: 'datetime',
            nullable: true
        },
        usuario_que_deshizo: {
            type: 'varchar',
            length: 30,
            nullable: true
        },
        Sucursal: {
            type: 'varchar',
            length: 40,
            nullable: true
        },
        Tipo_Documento: {
            type: 'char',
            length: 1,
            nullable: true
        },
        re_id: {
            type: 'int',
            nullable: true
        },
        CARGA_FACTURACION: {
            type: 'datetime',
            nullable: true
        },
        PLANILLA_NUM: {
            type: 'int',
            nullable: true
        },
        Monto_Cupon: {
            type: 'int',
            nullable: true
        },
        CODIGO_DOCUMENTO: {
            type: 'varchar',
            length: 20,
            nullable: true,
            comment: 'campo con codigo unico de documento'
        },
        RUT_TITULAR: {
            type: 'varchar',
            length: 10,
            nullable: true
        },
        SOCIO_CLIENTE: {
            type: 'char',
            length: 1,
            nullable: true
        },
        ID_AGRUPACION_CONTABLE: {
            type: 'int',
            nullable: true
        },
        CODIGO_AUTORIZACION: {
            type: 'int',
            nullable: true
        },
        IDENTIFICADOR: {
            type: 'varchar',
            length: 30,
            nullable: true,
            comment: 'LARGO DEL CAMPO 30 INDICADO POR EL SUBJERENTE DE TI, 21-12-2022'
        }
    },
    indices: [
        {
            name: 'id',
            columns: ['id'],
            unique: true
        },
        {
            name: 'PLANILLA',
            columns: ['FECHA', 'Sucursal']
        },
        {
            name: 'DOCUMENTO',
            columns: ['NUMSOC', 'NUMFACTUR', 'Tipo_Documento']
        },
        {
            name: 'pagos_idx1',
            columns: ['re_id']
        },
        {
            name: 'NUMSOC',
            columns: ['NUMSOC']
        },
        {
            name: 'CODIGO_AUTORIZACION',
            columns: ['CODIGO_AUTORIZACION']
        },
        {
            name: 'IDENTIFICADOR',
            columns: ['IDENTIFICADOR']
        },
        {
            name: 'CODIGO_DOCUMENTO',
            columns: ['CODIGO_DOCUMENTO']
        }
    ]
});

export default Recaudacion_Pagos;