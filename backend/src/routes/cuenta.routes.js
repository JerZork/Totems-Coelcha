import { Router } from "express";
import { obtenerPagos } from "../controllers/pagos.controller.js";

const router = Router();

router
    .post('/', obtenerPagos);

export default router;