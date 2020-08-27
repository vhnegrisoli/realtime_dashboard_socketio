import { Router } from "express";

import ProdutoController from "../controller/ProdutoController";

const router = new Router();

router.get("/produtos/listar", ProdutoController.listarTodos);
router.get("/produtos/cadastrar", ProdutoController.iniciarFormularioProduto);
router.get(
  "/produtos/cadastrar/:id",
  ProdutoController.iniciarFormularioProduto
);

router.get("/api/produtos", ProdutoController.buscarTodos);
router.get("/api/produto/:id", ProdutoController.buscarProduto);
router.post("/api/produtos", ProdutoController.salvarProduto);
router.put("/api/produtos/:id", ProdutoController.editarProduto);
router.delete("/api/produtos/:id", ProdutoController.removerProduto);

export default router;
