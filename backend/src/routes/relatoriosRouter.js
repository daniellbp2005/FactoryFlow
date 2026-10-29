import express from 'express';
import * as relatoriosController from "../controllers/relatoriosController.js"

export const relatoriosRouter = express.Router();

relatoriosRouter.get('/', relatoriosController.listar);
relatoriosRouter.get('/:id', relatoriosController.buscarPorId);
// relatoriosRouter.post('/', relatoriosController.criar);
// relatoriosRouter.put('/:id', relatoriosController.atualizar);
// relatoriosRouter.delete('/:id', relatoriosController.excluir);