import { Router } from 'express';

import FornecedorController from '../controller/FornecedorController';

const router = new Router();

router.get('/fornecedores/listar', FornecedorController.listarTodos);
router.get('/fornecedores/cadastrar', FornecedorController.iniciarFormularioFornecedor);
router.get('/fornecedores/cadastrar/:id', FornecedorController.iniciarFormularioFornecedor);

router.get('/api/fornecedores', FornecedorController.buscarTodos);
router.get('/api/fornecedor/:id', FornecedorController.buscarPorId);
router.post('/api/fornecedores', FornecedorController.salvarFornecedor);
router.put('/api/fornecedores/:id', FornecedorController.editarFornecedor);
router.delete('/api/fornecedores/:id', FornecedorController.removerFornecedor);

export default router;
