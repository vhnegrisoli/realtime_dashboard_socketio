import { Router } from "express";

import DashboardController from "../controller/DashboardController";

const router = new Router();

const controller = DashboardController;

router.get("/", controller.redirecionarParaDashboard);
router.get("/dashboard", controller.iniciarDashboard);
router.get("/reiniciar-dados", controller.reiniciarDados);
router.post("/atualizar-dados", controller._atualizarDados);
router.post("/novos-dados", controller.novosDados);
router.post(
  "/api/dashboard/inserir-dados-iniciais",
  controller.inserirDadosIniciais
);
router.get(
  "/api/dashboard/cards",
  DashboardController.recuperarIndicadoresDosCards
);
router.get("/api/dashboard/indicadores", DashboardController.getIndicadores);

export default router;
