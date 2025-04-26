import jwt from "jsonwebtoken";

export function autentificar(req, res, next) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated!");
    error["statusCode"] = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, "SANFIWebToken");
  } catch (err) {
    err["statusCode"] = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated!");
    error["statusCode"] = 401;
    throw error;
  }

  req.isLoggedIn = true;
  req.nombre = decodedToken.nombre;
  req.id_usuario = decodedToken.userId;
  req.email = decodedToken.email;
  req.permisos = decodedToken.permisos;
  req.isAdmin = decodedToken.isAdmin;
  req.isFormador = decodedToken.isFormador;
  req.isContacto = decodedToken.isContacto;
  req.isImpulsor = decodedToken.isImpulsor;

  next();
}

export function isAdmin(req, res, next) {
  if (!req.isAdmin) {
    const error = new Error("Not authenticated!");
    error["statusCode"] = 401;
    throw error;
  }
  next();
}
