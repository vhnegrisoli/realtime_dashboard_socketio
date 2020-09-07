import { Router } from "express";

import UsuarioController from "../controllers/UsuarioController";

const router = new Router();

router.post("/api/usuarios", UsuarioController.salvarUsuario);
router.get(
  "/usuarios/cadastrar",
  UsuarioController.inicializarFormularioUsuario
);

export default router;
