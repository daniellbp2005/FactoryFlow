import express from "express";
import * as relatoriosController from "../controllers/relatoriosController.js";
import { autenticar, autorizarPerfis } from "../middlewares/authMiddleware.js";

export const relatoriosRouter = express.Router();

// Todas as rotas de relatórios exigem autenticação
relatoriosRouter.use(autenticar);

relatoriosRouter.get("/meus", relatoriosController.listarMeus);
relatoriosRouter.get("/", relatoriosController.listar);
relatoriosRouter.get("/:id", relatoriosController.buscarPorId);
relatoriosRouter.post("/", relatoriosController.criar);
relatoriosRouter.put("/:id", relatoriosController.atualizar);
relatoriosRouter.delete("/:id", autorizarPerfis("administrador"), relatoriosController.excluir);
