import Equipamento from '../models/Equipamento.js'
import * as EquipamentoModel from '../models/EquipamentoModels.js';

export async function listar({ pagina = 1, limite = 10 } = {}) {
    const paginaNum = Number(pagina);
    const limiteNum = Number(limite);

    if (!Number.isInteger(paginaNum) || paginaNum <= 0) {
        throw new TypeError('Página deve ser um número inteiro positivo.');
    }
    if (!Number.isInteger(limiteNum) || limiteNum < 1 || limiteNum > 100) {
        throw new TypeError('Limite deve ser um inteiro entre 1 e 100.');
    }

    const offset = (paginaNum - 1) * limiteNum;
    const { produtos, total } = await EquipamentoModel.listar({ limite: limiteNum, offset });

    return {
        produtos,
        paginacao: {
            pagina: paginaNum,
            limite: limiteNum,
            total,
            totalPaginas: Math.ceil(total / limiteNum)
        }
    };
}

export async function buscarPorId(idRecebido) {
  const id = validarId(idRecebido);
  const produto = await EquipamentoModel.buscarPorId(id);
  if (!produto) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
  return produto;
}

function validarId(idRecebido) {
  const id = Number(idRecebido);
  if (!Number.isInteger(id) || id <= 0) {
    throw new TypeError('ID deve ser um número inteiro positivo.');
  }
  return id;
}

export async function criar(dados) {
  const produtoDominio = new Equipamento({ id: 1, ...dados });
  return await EquipamentoModel.criar(produtoDominio);
}

export async function atualizar(idRecebido, dados) {
  const id = validarId(idRecebido);
  const produtoDominio = new Equipamento({ id, ...dados });
  const atualizou = await EquipamentoModel.atualizar(id, produtoDominio);
  if (!atualizou) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
  return await EquipamentoModel.buscarPorId(id);
}

export async function excluir(idRecebido) {
  const id = validarId(idRecebido);
  const removeu = await EquipamentoModel.excluir(id);
  if (!removeu) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
}
