import { Router } from "express";

import CategoriaController from "../controller/CategoriaController";

const router = new Router();

router.get("/categorias/listar", CategoriaController.buscarCategorias);
router.get("/categorias/nova", CategoriaController.iniciarFormularioCategoria);

router.get("/api/categorias", CategoriaController.buscarTodasCategorias);
router.post("/api/categorias", CategoriaController.salvarCategoria);

export default router;
