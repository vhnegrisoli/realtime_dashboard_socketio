import { Router } from 'express';

import CategoriaController from '../controller/CategoriaController';

const router = new Router();

router.get('/categorias/listar', CategoriaController.buscarCategorias);
router.get('/categorias/cadastrar', CategoriaController.iniciarFormularioCategoria);
router.get('/categorias/cadastrar/:id', CategoriaController.iniciarFormularioCategoria);

router.get('/api/categorias', CategoriaController.buscarTodasCategorias);
router.get('/api/categoria/:id', CategoriaController.buscarCategoria);
router.post('/api/categorias', CategoriaController.salvarCategoria);
router.put('/api/categorias/:id', CategoriaController.editarCategoria);
router.delete('/api/categorias/:id', CategoriaController.removerCategoria);

export default router;
