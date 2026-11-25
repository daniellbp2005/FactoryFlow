import express from "express";
import * as maqController from "../controllers/maqController.js";
import { autenticar, autorizarPerfis } from "../middlewares/authMiddleware.js";

export const maqRouter = express.Router();

// Todas as rotas de máquinas agora exigem autenticação
maqRouter.use(autenticar);

maqRouter.get("/", maqController.listar);
maqRouter.get("/:id", maqController.buscarPorId);
maqRouter.post("/", autorizarPerfis("administrador"), maqController.criar);
maqRouter.put("/:id", maqController.atualizar);
maqRouter.delete("/:id", autorizarPerfis("administrador"), maqController.excluir);

// Operador solicita máquina – atribui máquina ao usuário autenticado
maqRouter.post("/:id/atribuir", maqController.atribuir);
