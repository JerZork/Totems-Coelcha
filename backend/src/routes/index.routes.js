"use strict"
import { Router } from 'express'
import cuentapago from './cuenta.routes.js';
import { verificarCliente } from '../controllers/cliente.controller.js';



const router = Router();

router 

    .use('/cuenta', cuentapago)
    .get('/verificar/:nroServicio', verificarCliente)

    .get('/', (req, res) => {
        res.send('Servidor funcionando correctamente');
    });


export default router;