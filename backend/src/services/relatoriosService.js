import Relatorio from '../models/Relatorios.js';
import * as RelatoriosModel from '../models/RelatoriosModels.js';

export async function listar({ pagina = 1, limite = 10 } = {}) {
  const paginaNum = Number(pagina);
  const limiteNum = Number(limite);

  if (!Number.isInteger(paginaNum) || paginaNum <= 0) {
    throw new TypeError('Página deve ser um número inteiro positivo.');
  }
  if (!Number.isInteger(limiteNum) || limiteNum < 1 || limiteNum > 100) {
    throw new RangeError('Limite deve ser um inteiro entre 1 e 100.');
  }

  const offset = (paginaNum - 1) * limiteNum;
  const { relatorios, total } = await RelatoriosModel.listar({ limite: limiteNum, offset });

  return {
    relatorios,
    paginacao: {
      pagina: paginaNum,
      limite: limiteNum,
      total,
      totalPaginas: Math.ceil(total / limiteNum),
    },
  };
}

export async function buscarPorId(idRecebido) {
  const id = validarId(idRecebido);
  const relatorio = await RelatoriosModel.buscarPorId(id);
  if (!relatorio) {
    const erro = new Error(`Relatório ${id} não encontrado.`);
    erro.status = 404;
    throw erro;
  }
  return relatorio;
}

function validarId(idRecebido) {
  const id = Number(idRecebido);
  if (!Number.isInteger(id) || id <= 0) {
    throw new TypeError('ID deve ser um número inteiro positivo.');
  }
  return id;
}

export async function criar(dados) {
  // 1. Validação de domínio pelo construtor de Relatorio
  const relatorioDominio = new Relatorio(dados);

  // 2. Validação da tabela intermediária tarefas_usuarios:
  // O usuário precisa estar escalado nesta tarefa para emitir relatório dela!
  const estaVinculado = await RelatoriosModel.verificarVinculoUsuarioTarefa(
    relatorioDominio.tarefa_id,
    relatorioDominio.usuario_id
  );
  if (!estaVinculado) {
    const erro = new Error(
      `O usuário ID ${relatorioDominio.usuario_id} não está vinculado à tarefa ID ${relatorioDominio.tarefa_id}.`
    );
    erro.status = 403; // Proibido / Sem permissão
    throw erro;
  }

  // 3. Validação de unicidade (UNIQUE na tabela relatorios):
  // Não permitir envio duplicado de relatório pelo mesmo usuário na mesma tarefa
  const jaExiste = await RelatoriosModel.buscarPorTarefaEUsuario(
    relatorioDominio.tarefa_id,
    relatorioDominio.usuario_id
  );
  if (jaExiste) {
    const erro = new Error(
      `Já existe um relatório enviado por este usuário para esta tarefa (Relatório ID ${jaExiste.id}).`
    );
    erro.status = 409; // Conflito / Duplicidade
    throw erro;
  }

  // 4. Cria e retorna o relatório completo
  return await RelatoriosModel.criar(relatorioDominio);
}

export async function atualizar(idRecebido, dados) {
  const id = validarId(idRecebido);

  // 1. Verifica se o relatório existe
  const relatorioExistente = await RelatoriosModel.buscarPorId(id);
  if (!relatorioExistente) {
    const erro = new Error(`Relatório ${id} não encontrado.`);
    erro.status = 404;
    throw erro;
  }

  // 2. Valida o novo resultado e observações usando o objeto de domínio
  const relatorioAtualizado = new Relatorio({
    id,
    tarefa_id: relatorioExistente.tarefa.id,
    usuario_id: relatorioExistente.usuario.id,
    resultado: dados.resultado ?? relatorioExistente.resultado,
    observacoes: dados.observacoes !== undefined ? dados.observacoes : relatorioExistente.observacoes,
  });

  // 3. Atualiza no banco
  await RelatoriosModel.atualizar(id, {
    resultado: relatorioAtualizado.resultado,
    observacoes: relatorioAtualizado.observacoes,
  });

  // 4. Retorna o relatório com seus dados completos e atualizados
  return await RelatoriosModel.buscarPorId(id);
}

export async function excluir(idRecebido) {
  const id = validarId(idRecebido);

  const removeu = await RelatoriosModel.excluir(id);
  if (!removeu) {
    const erro = new Error(`Relatório ${id} não encontrado.`);
    erro.status = 404;
    throw erro;
  }
}
