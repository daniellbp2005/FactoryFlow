import express from 'express';
import * as usuarioController from "../controllers/usuarioController.js";

export const usuariosRouter = express.Router();

usuariosRouter.post("/login/", usuarioController.login)
usuariosRouter.post("/cadastro/", usuarioController.registrar)