import { EntitySchema } from "typeorm";

const Cuentas_Corrientes = new EntitySchema({
    name: 'cuentas_corrientes',
    columns: {
        ID_MOVIMIENTO: {
            type: 'int',
            primary: true,
            generated: true,
            comment: 'Identificador unico de cada nuevo registro agregado a la cuenta corriente'
        },
        ID_DOCUMENTO: {
            type: 'int',
            nullable: false,
            comment: 'Identificador Numerico del Documento afectado por el movimiento en la cuenta corriente'
        },
        CODIGO_DOCUMENTO: {
            type: 'varchar',
            length: 20,
            nullable: false,
            default: '',
            comment: 'Codigo para identificar el documento de facturacion que se generaran codigo definido por TIPO DOCUMENTO(F-B-C-D)+ TIPO IMPRESION'
        },
        NUMERO_SERVICIO: {
            type: 'int',
            nullable: false,
            default: 0,
            comment: 'Numero servicio del cliente Facturado'
        },
        FECHA_MOVIMIENTO: {
            type: 'datetime',
            nullable: false,
            default: '0000-00-00 00:00:00',
            comment: 'Fecha y hora en la que se creo el registro en cuenta corriente'
        },
        ID_OPERACION: {
            type: 'int',
            nullable: false,
            comment: 'Identificador del Tipo de Operacion que se ha registrado en cuenta corriente oper=1(NUEVA CUENTA, oper=2(NUEVO PAGO), oper=3(NUEVA NOTA CREDITO), oper=4(NUEVO TRASPASO), oper=5(NUEVO NOTA DE DEBITO), ETC'
        },
        ID_DOC_OPERACION: {
            type: 'int',
            nullable: false,
            comment: 'Corresponde al identificador único del registro que origino el movimiento en cuenta corriente. según el código de operación, ej:oper=1 => id_documento, oper=2 => id_pago_detalle, oper=3=>id_documento nota de credito, oper=4 id_traspaso_por_mayor_pago, etc'
        },
        DEBE: {
            type: 'int',
            nullable: false,
            default: 0,
            comment: 'Monto del Valro del documento de energía o documento que debe cancelar el cliente'
        },
        HABER: {
            type: 'int',
            nullable: false,
            default: 0,
            comment: 'Monto abonado por el cliente relacionado por el movimiento de un abono'
        },
        ID_USUARIO: {
            type: 'int',
            nullable: false,
            comment: 'Identificador Unico del usuario que genero el registro en cuenta corriente'
        },
        NUMERO_PLANILLA: {
            type: 'int',
            nullable: true,
            comment: 'Numero de planilla contable mediante la cual se valido el ingreso monetario a la empresa'
        },
        REGISTRO: {
            type: 'int',
            nullable: true,
            comment: 'Numero de registro de la tabla de cuentas corrientes del sistema Venerg'
        },
        GLOSA: {
            type: 'varchar',
            length: 70,
            nullable: true,
            comment: 'Glosa que describe el movimiento en cuenta corriente'
        },
        COD_DOC_OPERACION: {
            type: 'varchar',
            length: 20,
            nullable: true,
            comment: 'Corresponde al codigo de documento nemo tecnico para notas de credito'
        }
    },
    indices: [
        {
            name: 'NUMSOC',
            columns: ['NUMERO_SERVICIO']
        },
        {
            name: 'ID_DOCUMENTO',
            columns: ['ID_DOCUMENTO']
        },
        {
            name: 'ID_OPERACION',
            columns: ['ID_OPERACION']
        },
        {
            name: 'ID_USUARIO',
            columns: ['ID_USUARIO']
        },
        {
            name: 'CODIGO_DOCUMENTO',
            columns: ['CODIGO_DOCUMENTO']
        }
    ],
    relations: {
        ID_OPERACION: {
            type: 'many-to-one',
            target: 'cuentas_corrientes_operaciones',
            joinColumn: { name: 'ID_OPERACION' },
            onDelete: 'CASCADE'
        },
        ID_DOCUMENTO: {
            type: 'many-to-one',
            target: 'documentos',
            joinColumn: { name: 'ID_DOCUMENTO' },
            onDelete: 'CASCADE'
        }
    }
});

export default Cuentas_Corrientes;