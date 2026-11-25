import Tarefa from '../models/Tarefas.js'
import * as TarefasModel from '../models/TarefaModel.js';
import { randomUUID } from 'node:crypto';

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
  const { produtos, total } = await TarefasModel.listar({ limite: limiteNum, offset });

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
  const produto = await TarefasModel.buscarPorId(id);
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
  const {
    emails = [],
    equipamentos = [],
    ...dadosTarefa
  } = dados;

  // Validar os arrays recebidos
  if (!Array.isArray(emails) || !Array.isArray(equipamentos)) {
    throw new TypeError('E-mails e equipamentos devem ser listas.');
  }

  // Normalizar os e-mails
  const emailsNormalizados = emails.map(email => {
    if (typeof email !== 'string' || !email.trim()) {
      throw new TypeError('E-mail inválido.');
    }

    return email.trim().toLowerCase();
  });

  // Remover e-mails duplicados
  const emailsUnicos = [...new Set(emailsNormalizados)];

  // Validar os IDs dos equipamentos
  const equipamentosUnicos = [...new Set(equipamentos.map(Number))];

  if (equipamentosUnicos.some(id => !Number.isInteger(id) || id <= 0)) {
    throw new TypeError('ID de equipamento inválido.');
  }

  // Gerar código da tarefa
  const codigo = `OP-${randomUUID().replaceAll('-', '').slice(0, 16)}`;

  // Criar objeto da tarefa
  const produtoDominio = new Tarefa({
    ...dadosTarefa,
    codigo
  });

  return await TarefasModel.criar(
    produtoDominio,
    emailsUnicos,
    equipamentosUnicos
  );
}


export async function atualizar(idRecebido, dados) {
  const id = validarId(idRecebido);
  const produtoDominio = new Tarefa({ id, ...dados });
  const atualizou = await TarefasModel.atualizar(id, produtoDominio);
  if (!atualizou) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
  return await TarefasModel.buscarPorId(id);
}

export async function excluir(idRecebido) {
  const id = validarId(idRecebido);
  const removeu = await TarefasModel.excluir(id);
  if (!removeu) {
    throw new Error(`Produto ${id} não encontrado.`);
  }
}
