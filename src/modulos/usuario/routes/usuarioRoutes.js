import { Router } from 'express';

import UsuarioController from '../controllers/UsuarioController';

const router = new Router();

router.put('/api/usuarios/:id', UsuarioController.editarUsuario);
router.get('/api/usuarios', UsuarioController.buscarTodosUsuarios);
router.get('/api/usuarios/:id', UsuarioController.buscarUsuarioPorId);

export default router;
