"use strict"
import { Router } from 'express'
import cuentapago from './cuenta.routes.js';


const router = Router();

router 

    .use('/cuenta', cuentapago)
    .get('/', (req, res) => {
        res.send('Servidor funcionando correctamente');
    });


export default router;