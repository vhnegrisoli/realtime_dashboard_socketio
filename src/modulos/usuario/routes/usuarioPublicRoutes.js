import { Router } from 'express';

import UsuarioController from '../controllers/UsuarioController';

const router = new Router();

router.post('/api/usuarios', UsuarioController.salvarUsuario);

export default router;
