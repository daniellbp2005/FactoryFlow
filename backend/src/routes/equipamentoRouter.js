import express from 'express';
import * as equipamentoController from "../controllers/equipamentoController.js"

export const equipamentoRouter = express.Router();

equipamentoRouter.get('/', equipamentoController.listar);
equipamentoRouter.get('/:id', equipamentoController.buscarPorId);
equipamentoRouter.post('/', equipamentoController.criar);
equipamentoRouter.put('/:id', equipamentoController.atualizar);
equipamentoRouter.delete('/:id', equipamentoController.excluir);