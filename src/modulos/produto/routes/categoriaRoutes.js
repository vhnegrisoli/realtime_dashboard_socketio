import { Router } from "express";

import CategoriaController from "../controller/CategoriaController";

const router = new Router();

router.get("/categorias", CategoriaController.buscarCategorias);
router.get("/categorias/nova", CategoriaController.iniciarFormularioCategoria);
router.post("/categorias/salvar", CategoriaController.salvarCategoria);

router.get("/api/categorias", CategoriaController.buscarCategoriasApi);

export default router;
