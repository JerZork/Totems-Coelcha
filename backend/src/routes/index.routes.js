"use strict"
import { Router } from 'express'


const router = Router();

router 
    .get('/', (req, res) => {
        res.send('Servidor funcionando correctamente');
    });


export default router;