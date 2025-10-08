import { Request, Response } from "express";
import Usuarios from "../models/usuarios";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { directusLogin, patchUserMagicFields } from "../models/directus";

const SECRET = process.env.MAGIC_JWT_SECRET!;
const TTL_MIN = +(process.env.MAGIC_JWT_TTL_MIN || 10);

export class usuarioController {
  static async getUsuarioById(req: Request, res: Response) {
    const idSolicitado = req.body.id_usuario;
    const usuario = await Usuarios.getUsuarioById(idSolicitado);
    res.send(usuario[0]);
  }

  //GESTION DE MAGIC LINK:
  static async crearMagicLink(req: Request, res: Response) {
    try {
      const { email, password, userId } = req.body ?? {};
      if (!email || !password)
        res.status(400).json({ error: "email/password required" });

      const jti = crypto.randomUUID();
      const token = jwt.sign({ sub: email, pw: password, jti }, SECRET, {
        algorithm: "HS256",
      });

      // 2) Guardar magic link en el usuario
      const url = `${process.env.APP_URL}/magic?token=${encodeURIComponent(token)}`;

      await patchUserMagicFields(userId, { url });

      res.json({ url });
    } catch (e: any) {
      res.status(500).json({ error: "issue_failed", message: e.message });
    }
  }

  static async consumirMagicLink(req: Request, res: Response) {
    try {
      console.log("Consuming magic link with body:", req.body);
      const { token } = req.body ?? {};

      if (!token) res.status(400).json({ error: "token required" });

      const payload = jwt.verify(token, SECRET) as {
        sub: string;
        pw: string;
        jti: string;
      };

      console.log("Decoded JWT payload:", payload);

      const data = await directusLogin(payload.sub, payload.pw);
      res.json({ tokens: data, email: payload.sub, pass: payload.pw });
    } catch (e: any) {
      console.error("Error consuming magic link:", e);
      res.status(400).json({ error: "invalid_or_expired", message: e.message });
    }
  }
}
