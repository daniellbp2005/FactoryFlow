import express from "express";
import * as equipamentoController from "../controllers/equipamentoController.js";
import { autenticar, autorizarPerfis } from "../middlewares/authMiddleware.js";

export const equipamentoRouter = express.Router();

// Todas as rotas de equipamentos exigem autenticação
equipamentoRouter.use(autenticar);

equipamentoRouter.get("/", equipamentoController.listar);
equipamentoRouter.get("/:id", equipamentoController.buscarPorId);
equipamentoRouter.post("/", autorizarPerfis("administrador"), equipamentoController.criar);
equipamentoRouter.put("/:id", equipamentoController.atualizar);
equipamentoRouter.delete("/:id", autorizarPerfis("administrador"), equipamentoController.excluir);
