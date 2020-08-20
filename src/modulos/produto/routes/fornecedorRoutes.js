import { Router } from "express";

import FornecedorController from "../controller/FornecedorController";

const router = new Router();

router.get("/api/fornecedores", FornecedorController.buscarTodos);
router.post("/api/fornecedores/varios", FornecedorController.salvarVarios);

export default router;
