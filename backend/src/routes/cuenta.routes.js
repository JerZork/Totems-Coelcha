import { Router } from "express";
import { obtenerPagos } from "../controllers/pagos.controller.js";

const router = Router();

router
    .get('/:nroservice', obtenerPagos);

export default router;