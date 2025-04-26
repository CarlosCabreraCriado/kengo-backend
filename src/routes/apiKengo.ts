import { Router } from "express";
import { usuarioController } from "../controllers/usuario";

const router = Router();

router.post("/getUsuarioById", usuarioController.getUsuarioById);

export default router;
