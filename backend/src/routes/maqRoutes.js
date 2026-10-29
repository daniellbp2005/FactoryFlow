import express from 'express';
import * as maqController from "../controllers/maqController.js"

export const maqRouter = express.Router();

maqRouter.get('/', maqController.listar);
maqRouter.get('/:id', maqController.buscarPorId);
maqRouter.post('/', maqController.criar);
maqRouter.put('/:id', maqController.atualizar);
maqRouter.delete('/:id', maqController.excluir);