import express from "express";
import * as terefaController from "../controllers/tarefasController.js";
import { autenticar, autorizarPerfis } from "../middlewares/authMiddleware.js";

export const tarefasRouter = express.Router();

// Todas as rotas de tarefas exigem autenticação
tarefasRouter.use(autenticar);

tarefasRouter.get("/", terefaController.listar);
tarefasRouter.get("/para-relatorio", terefaController.listarParaRelatorio);
tarefasRouter.get("/:id", terefaController.buscarPorId);
tarefasRouter.post("/", autorizarPerfis("administrador"), terefaController.criar);
tarefasRouter.put("/:id", terefaController.atualizar);
tarefasRouter.delete("/:id", autorizarPerfis("administrador"), terefaController.excluir);
