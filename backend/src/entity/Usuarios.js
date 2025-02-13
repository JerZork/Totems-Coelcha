import { EntitySchema } from 'typeorm';

const Usuarios = new EntitySchema({
    name: 'Usuarios',
    tableName: 'Usuarios',
    columns: {
        NombreUsuario: {
            type: 'varchar',
            length: 20,
            primary: true,
        },
        Password: {
            type: 'varchar',
            length: 32,
            nullable: false,
        },
        Perfil: {
            type: 'varchar',
            length: 20,
            nullable: false,
        },
        Sucursal: {
            type: 'varchar',
            length: 40,
            nullable: false,
        },
        Nombre: {
            type: 'varchar',
            length: 50,
            nullable: false,
        },
        Password2: {
            type: 'varchar',
            length: 20,
            nullable: true,
        },
        Id_Usuario: {
            type: 'int',
            nullable: true,
        },
    },
});

export default Usuarios;

