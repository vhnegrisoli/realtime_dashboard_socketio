import { Router } from "express";

import ProdutoController from "../controller/ProdutoController";

const router = new Router();

router.get("/api/produtos", ProdutoController.buscarTodos);
router.post("/api/produtos/varios", ProdutoController.salvarVarios);

export default router;
