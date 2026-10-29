import express from 'express';
import * as terefaController from "../controllers/tarefasController.js"

export const tarefasRouter = express.Router();

tarefasRouter.get('/', terefaController.listar);
tarefasRouter.get('/:id', terefaController.buscarPorId);
tarefasRouter.post('/', terefaController.criar);
tarefasRouter.put('/:id', terefaController.atualizar);
tarefasRouter.delete('/:id', terefaController.excluir);