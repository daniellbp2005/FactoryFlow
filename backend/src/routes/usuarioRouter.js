import express from "express";
import * as usuarioController from "../controllers/usuarioController.js";
import { autenticar } from "../middlewares/authMiddleware.js";
import { criarRateLimiter } from "../middlewares/rateLimiter.js";

export const usuariosRouter = express.Router();

// Proteção contra brute force: máx 10 tentativas a cada 15 minutos por IP
const loginLimiter = criarRateLimiter({
  janelaMs: 15 * 60 * 1000,
  limiteMax: 10,
  mensagem: "Muitas tentativas de login a partir deste IP. Bloqueado temporariamente por 15 minutos.",
});

// Proteção contra spam de cadastros: máx 10 cadastros a cada 1 hora por IP
const cadastroLimiter = criarRateLimiter({
  janelaMs: 60 * 60 * 1000,
  limiteMax: 10,
  mensagem: "Limite de cadastros atingido para este IP. Tente novamente mais tarde.",
});

usuariosRouter.post("/login", loginLimiter, usuarioController.login);
usuariosRouter.post("/login/", loginLimiter, usuarioController.login);

usuariosRouter.post("/cadastro", cadastroLimiter, usuarioController.registrar);
usuariosRouter.post("/cadastro/", cadastroLimiter, usuarioController.registrar);

// Rota protegida para consultar o próprio perfil logado
usuariosRouter.get("/me", autenticar, usuarioController.obterPerfil);
usuariosRouter.get("/perfil", autenticar, usuarioController.obterPerfil);
