import { Router } from 'express';

import AuthController from '../controllers/AuthController';

const router = new Router();

router.get('/login', AuthController.iniciarLogin);
router.post('/auth/token', AuthController.auth);
router.post('/auth/check_token', AuthController.checkToken);

export default router;
