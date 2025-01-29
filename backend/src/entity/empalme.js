import { EntitySchema } from "typeorm";

const Empalme = new EntitySchema({
    name: 'empalmes',
    columns: {
        NUMERO_SERVICIO: {
            type: 'int',
            primary: true,
            comment: 'Numero único que identifica al servicio de suministro de energía'
        },
        FECHA_CONEXION: {
            type: 'date',
            nullable: true,
            comment: 'Fecha en que se conecta el empalme a la red de distribución'
        },
        FECHA_ALTA_EMPALME: {
            type: 'date',
            nullable: true,
            comment: 'Fecha en que el propietario se hace de la propiedad del empalme'
        },
        FECHA_BAJA_EMPALME: {
            type: 'date',
            nullable: true,
            comment: 'Fecha de retiro del empalme'
        },
        TIPO_ACOMETIDA: {
            type: 'varchar',
            length: 1,
            nullable: true,
            comment: 'Describe si el empalme es aéreo o subterráneo A=AEREA Y S=SUBTERRANEA'
        },
        AMPERES_TTCC: {
            type: 'int',
            default: 0,
            comment: 'Amperes de los transformadores de corriente instalados en el equipo de medida'
        },
        VOLTAJE_TTPP: {
            type: 'int',
            default: 0,
            comment: 'Voltaje de transformadores de potencial en equipo compacto de medida'
        },
        CONSTANTE_TRANSFORMACION_MEDIDA: {
            type: 'int',
            default: 1,
            comment: 'Constante Resultante de Transformadores de Corrientes y de Voltaje'
        },
        CODIGO_VNR_EMPALME: {
            type: 'varchar',
            length: 15,
            nullable: true,
            comment: 'Código VNR del empalme'
        },
        CANTIDAD_FASES: {
            type: 'int',
            comment: 'Cantidad de fases del empalme'
        },
        FASE_CONEXION: {
            type: 'varchar',
            length: 5,
            default: '',
            comment: 'Describe la fase de conexión del empalme (++R, ++S, ++T, RST)'
        },
        AMPERES_AUTOMATICO: {
            type: 'int',
            default: 0,
            comment: 'Corresponde a la capacidad máxima del automático (bt) o fusible aéreo (mt)'
        },
        NUMERO_POSTE: {
            type: 'int',
            default: 0,
            comment: 'Nº del poste al que se conecta el empalme'
        },
        NUMERO_SUBESTACION: {
            type: 'int',
            default: 0,
            comment: 'Número de la subestación al que se conecta el empalme'
        },
        ID_ALIMENTADOR: {
            type: 'int',
            comment: 'Identificador del alimentador que corresponde al sistema de facturación'
        },
        ID_SECTOR_LECTURA: {
            type: 'int',
            comment: 'Identificador del sector de lectura del empalme'
        },
        ID_SECTOR_CORTE: {
            type: 'int',
            comment: 'Identificador del sector de corte del empalme'
        },
        ID_SECTOR_COBRANZA: {
            type: 'int',
            comment: 'Identificador del sector de cobranza'
        },
        POTENCIA_INSTALADA: {
            type: 'decimal',
            precision: 11,
            scale: 2,
            comment: 'Potencia instalada en el empalme (KVA)'
        },
        POTENCIA_HABILITADA: {
            type: 'decimal',
            precision: 11,
            scale: 2,
            comment: 'Potencia habilitada en el empalme según automático instalado'
        },
        ID_MOVIMIENTO_CONEXION_TIPO_ACTUAL: {
            type: 'int',
            comment: 'Almacena el último tipo de movimiento de corte y reposición'
        },
        ID_CIUDADSECTOR_EMPALME: {
            type: 'int',
            comment: 'Identificador del sector de la ciudad del empalme'
        },
        ID_DIR_NIVEL_AGRUPACION_1_EMPALME: {
            type: 'int',
            comment: 'Identificador del primer nivel de agrupación del empalme'
        },
        DIR_NIVEL_AGRUPACION_1_EMPALME: {
            type: 'varchar',
            length: 80,
            comment: 'Descripción del primer nivel de agrupación del empalme'
        },
        ID_DIR_NIVEL_AGRUPACION_2_EMPALME: {
            type: 'int',
            nullable: true,
            comment: 'Identificador del segundo nivel de agrupación del empalme'
        },
        DIR_NIVEL_AGRUPACION_2_EMPALME: {
            type: 'varchar',
            length: 80,
            nullable: true,
            comment: 'Descripción del segundo nivel de agrupación del empalme'
        },
        ID_DIR_NIVEL_AGRUPACION_3_EMPALME: {
            type: 'int',
            nullable: true,
            comment: 'Identificador del tercer nivel de agrupación del empalme'
        },
        DIR_NIVEL_AGRUPACION_3_EMPALME: {
            type: 'varchar',
            length: 80,
            nullable: true,
            comment: 'Descripción del tercer nivel de agrupación del empalme'
        },
        ID_COMUNA_EMPALME: {
            type: 'int',
            comment: 'Identificador de la comuna donde está instalado el empalme'
        },
        ID_AGRUPACION_CONTABLE: {
            type: 'int',
            comment: 'Identificador de la agrupación contable'
        },
        NUMERO_SERVICIO_ANTERIOR: {
            type: 'int',
            nullable: true,
            comment: 'Número de servicio anterior en el sistema de facturación'
        },
        ID_MEDIDOR: {
            type: 'int',
            nullable: true,
            comment: 'Identificador del medidor'
        },
        ENCUESTABLE: {
            type: 'varchar',
            length: 2,
            default: 'NO',
            comment: 'Identifica si el empalme es encuestable'
        },
        CUOTA_MORTUORIA: {
            type: 'varchar',
            length: 2,
            default: 'NO',
            comment: 'Indica si el empalme aplica cuota mortuoria al facturar'
        },
        APLICA_SECTOR_COBRANZA: {
            type: 'varchar',
            length: 2,
            default: 'NO',
            comment: 'Indica si el empalme aplica cobro por sector de cobranza'
        },
        ID_SUBALIMENTADOR: {
            type: 'varchar',
            length: 5,
            nullable: true,
            comment: 'ID que identifica a qué subalimentador pertenece el servicio'
        },
        RAZON_SOCIAL: {
            type: 'varchar',
            length: 100,
            nullable: true,
            comment: 'Razón social asociada al empalme'
        },
        ELECTRODEPENDIENTE: {
            type: 'varchar',
            length: 2,
            default: 'NO',
            comment: 'Identificador de si el servicio es electrodependiente'
        },
        LECTURA_POTENCIA: {
            type: 'varchar',
            length: 2,
            nullable: true,
            comment: 'Indica si el servicio requiere lectura de potencia'
        },
        CLIENTE_SUMINISTRO_CRITICO: {
            type: 'varchar',
            length: 2,
            nullable: true,
            comment: 'Identifica si el servicio es de suministro crítico'
        },
        CLASIFICACION_CLIENTE_SUMINISTRO_CRITICO: {
            type: 'varchar',
            length: 100,
            nullable: true,
            comment: 'Identifica el tipo de suministro crítico'
        },
        ClIENTE_NETBILLING: {
            type: 'varchar',
            length: 2,
            default: 'NO',
            comment: 'Indica si el cliente es de netbilling'
        }
    },
    indices: [
        {
            name: 'NUMERO_SERVICIO',
            columns: ['NUMERO_SERVICIO']
        },
        {
            name: 'ID_ALIMENTADOR',
            columns: ['ID_ALIMENTADOR']
        },
        {
            name: 'ID_SECTOR_LECTURA',
            columns: ['ID_SECTOR_LECTURA']
        },
        {
            name: 'ID_SECTOR_CORTE',
            columns: ['ID_SECTOR_CORTE']
        },
        {
            name: 'ID_SECTOR_COBRANZA',
            columns: ['ID_SECTOR_COBRANZA']
        },
        {
            name: 'CODIGO_VNR_EMPALME',
            columns: ['CODIGO_VNR_EMPALME']
        },
        {
            name: 'ID_MOVIMIENTO_CONEXION_TIPO_ACTUAL',
            columns: ['ID_MOVIMIENTO_CONEXION_TIPO_ACTUAL']
        },
        {
            name: 'ID_AGRUPACION_CONTABLE',
            columns: ['ID_AGRUPACION_CONTABLE']
        },
        {
            name: 'ID_COMUNA_EMPALME',
            columns: ['ID_COMUNA_EMPALME']
        }
    ],
    relations: {
        CODIGO_VNR_EMPALME: {
            type: 'many-to-one',
            target: 'empalmes_codigos_vnr',
            joinColumn: { name: 'CODIGO_VNR_EMPALME' },
            onDelete: 'CASCADE'
        },
        ID_SECTOR_LECTURA: {
            type: 'many-to-one',
            target: 'sector_lectura',
            joinColumn: { name: 'ID_SECTOR_LECTURA' },
            onDelete: 'CASCADE'
        },
        ID_SECTOR_CORTE: {
            type: 'many-to-one',
            target: 'sector_corte',
            joinColumn: { name: 'ID_SECTOR_CORTE' },
            onDelete: 'CASCADE'
        },
        ID_SECTOR_COBRANZA: {
            type: 'many-to-one',
            target: 'sector_cobranza',
            joinColumn: { name: 'ID_SECTOR_COBRANZA' },
            onDelete: 'CASCADE'
        },
        ID_ALIMENTADOR: {
            type: 'many-to-one',
            target: 'alimentadores',
            joinColumn: { name: 'ID_ALIMENTADOR' },
            onDelete: 'CASCADE'
        },
        ID_AGRUPACION_CONTABLE: {
            type: 'many-to-one',
            target: 'agrupacion_contable',
            joinColumn: { name: 'ID_AGRUPACION_CONTABLE' },
            onDelete: 'CASCADE'
        }
    }
});

export default Empalme;