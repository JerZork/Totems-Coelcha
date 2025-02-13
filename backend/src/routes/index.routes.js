"use strict"
import { Router } from 'express';
import cuentapago from './cuenta.routes.js';
import { verificarCliente, obtenerNroser } from '../controllers/cliente.controller.js';
import { insertarAbono } from '../controllers/pagos.controller.js';
import { LogUsuario } from '../controllers/login.controller.js';

const router = Router();

router
    .use('/cuenta', cuentapago)
    .get('/verificar/:nroServicio', verificarCliente)
    .get('/obtenerServicio/:nroFactura', obtenerNroser)
    .post('/abono', insertarAbono)


    .get('/', (req, res) => {
        res.send('Servidor funcionando correctamente');
    })

    .post('/login',LogUsuario );

export default router;