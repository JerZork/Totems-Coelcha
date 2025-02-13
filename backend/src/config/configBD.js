import { DataSource } from 'typeorm';
import { baseDeDatos, usuario, contrasena } from './configEnv.js';
import Recaudacion_Pagos from '../entity/recaudacion_pagos.entity.js';
import Usuarios from '../entity/Usuarios.js';



export const AppDataSource = new DataSource({
    type: 'mysql',
    host: baseDeDatos,
    username: usuario,
    password: contrasena,
    database: 'facturacion_coelcha_respaldo',
    entities: ['src/entities/**/*.js', Recaudacion_Pagos, Usuarios],

});






export async function conectarDB() {
try {
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos exitosa');
    
} catch (error) {
    console.log('Error al conectar a la base de datos', error);
    process.exit(1);
    
}

}
