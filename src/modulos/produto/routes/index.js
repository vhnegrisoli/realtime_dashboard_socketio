import { Router } from "express";

import DashboardController from "../controller/dashboardController";

const router = new Router();

router.get("/", DashboardController.iniciarFormulario);
router.get("/dashboard", DashboardController.iniciarDashboard);
router.post("/atualizar-dados", DashboardController.atualizarDados);
router.post("/novos-dados", DashboardController.novosDados);

export default router;
