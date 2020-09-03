import { Router } from 'express';

import DashboardController from '../controller/dashboardController';

const router = new Router();

const controller = DashboardController;

router.get('/', controller.redirecionarParaDashboard);
router.get('/dashboard', controller.iniciarDashboard);
router.get('/reiniciar-dados', controller.reiniciarDados);
router.get('/api/dashboard/cards', DashboardController.recuperarIndicadoresDosCards);
router.get('/api/dashboard/indicadores', DashboardController.getIndicadores);

export default router;
