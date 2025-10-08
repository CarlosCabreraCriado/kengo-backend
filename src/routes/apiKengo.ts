import { Router } from "express";
import { usuarioController } from "../controllers/usuario";

const router = Router();

router.post("/getUsuarioById", usuarioController.getUsuarioById);

//Magic Link:
router.post("/crearMagicLink", usuarioController.crearMagicLink);
router.post("/consumirMagicLink", usuarioController.consumirMagicLink);

export default router;
