export const RESULTADOS_RELATORIO = Object.freeze({
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  COM_RESSALVAS: 'Com Ressalvas',
  INCOMPLETO: 'Incompleto',
  PENDENTE: 'Pendente',
});

const RESULTADOS_VALIDOS = Object.values(RESULTADOS_RELATORIO);

/**
 * Normaliza o resultado para ser tolerante a variações salvas no banco
 * (minúsculas, sem acento, variações de texto), evitando travar requisições de leitura (GET).
 */
function normalizarResultado(resultado) {
  if (!resultado || typeof resultado !== 'string') return RESULTADOS_RELATORIO.APROVADO;
  const limpo = resultado.trim();
  if (!limpo) return RESULTADOS_RELATORIO.APROVADO;

  if (RESULTADOS_VALIDOS.includes(limpo)) return limpo;

  const semAcento = limpo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (semAcento === 'aprovado' || semAcento === 'aprovada' || semAcento === 'sucesso' || semAcento === 'ok') {
    return RESULTADOS_RELATORIO.APROVADO;
  }
  if (semAcento === 'reprovado' || semAcento === 'reprovada' || semAcento === 'falha') {
    return RESULTADOS_RELATORIO.REPROVADO;
  }
  if (semAcento === 'com ressalvas' || semAcento === 'ressalvas' || semAcento === 'com_ressalvas') {
    return RESULTADOS_RELATORIO.COM_RESSALVAS;
  }
  if (semAcento === 'incompleto' || semAcento === 'incompleta') {
    return RESULTADOS_RELATORIO.INCOMPLETO;
  }
  if (semAcento === 'pendente' || semAcento === 'em analise' || semAcento === 'em_analise') {
    return RESULTADOS_RELATORIO.PENDENTE;
  }

  // Tolerância para dados legados ou customizados já salvos no banco
  return limpo;
}

export default class Relatorio {
  /**
   * Representa um Relatório no sistema FactoryFlow.
   * Conforme schema do banco de dados (tabela `relatorios`):
   * - id: INT AUTO_INCREMENT PRIMARY KEY
   * - tarefa_id: INT NOT NULL (FK para tarefas)
   * - usuario_id: INT NOT NULL (FK para usuarios)
   * - resultado: VARCHAR(30) NOT NULL
   * - observacoes: TEXT NULL
   * - criado_em: DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
   *
   * @param {Object} dados
   * @param {number} [dados.id] - Identificador único do relatório
   * @param {number} dados.tarefa_id - ID da tarefa associada (aceita também tarefaId)
   * @param {number} dados.usuario_id - ID do usuário responsável (aceita também usuarioId)
   * @param {string} [dados.resultado='Aprovado'] - Resultado final da execução
   * @param {string} [dados.observacoes] - Observações ou anotações técnicas
   * @param {Date|string} [dados.criado_em] - Data/hora de geração do relatório
   */
  constructor({
    id,
    tarefa_id,
    tarefaId,
    usuario_id,
    usuarioId,
    resultado = RESULTADOS_RELATORIO.APROVADO,
    observacoes = null,
    criado_em = null,
  } = {}) {
    // 1. Validação do ID: se informado, deve ser inteiro positivo
    if (id !== undefined && id !== null) {
      const idNum = Number(id);
      if (!Number.isInteger(idNum) || idNum <= 0) {
        throw new TypeError('ID deve ser um inteiro positivo');
      }
      this.id = idNum;
    } else {
      this.id = null;
    }

    // 2. Validação do tarefa_id (aceita tarefa_id ou tarefaId)
    const tarefaRecebida = tarefa_id ?? tarefaId;
    if (tarefaRecebida === undefined || tarefaRecebida === null || tarefaRecebida === '') {
      throw new TypeError('tarefa_id é obrigatório');
    }
    const tarefaIdNum = Number(tarefaRecebida);
    if (!Number.isInteger(tarefaIdNum) || tarefaIdNum <= 0) {
      throw new TypeError('tarefa_id deve ser um inteiro positivo');
    }
    this.tarefa_id = tarefaIdNum;

    // 3. Validação do usuario_id (aceita usuario_id ou usuarioId)
    const usuarioRecebido = usuario_id ?? usuarioId;
    if (usuarioRecebido === undefined || usuarioRecebido === null || usuarioRecebido === '') {
      throw new TypeError('usuario_id é obrigatório');
    }
    const usuarioIdNum = Number(usuarioRecebido);
    if (!Number.isInteger(usuarioIdNum) || usuarioIdNum <= 0) {
      throw new TypeError('usuario_id deve ser um inteiro positivo');
    }
    this.usuario_id = usuarioIdNum;

    // 4. Validação e normalização do Resultado (VARCHAR 30 NOT NULL)
    const resultadoNormalizado = normalizarResultado(resultado);
    if (resultadoNormalizado.length > 30) {
      throw new RangeError('Resultado não pode exceder 30 caracteres');
    }
    this.resultado = resultadoNormalizado;

    // 5. Validação das Observações (TEXT NULL)
    if (observacoes !== undefined && observacoes !== null && observacoes !== '') {
      if (typeof observacoes !== 'string') {
        throw new TypeError('Observações devem ser um texto');
      }
      this.observacoes = observacoes.trim();
    } else {
      this.observacoes = null;
    }

    // 6. Data de criação
    if (criado_em) {
      const dataCriacao = new Date(criado_em);
      this.criado_em = Number.isNaN(dataCriacao.getTime()) ? null : dataCriacao;
    } else {
      this.criado_em = null;
    }
  }

  // --- Métodos de Consulta de Estado ---

  estaAprovado() {
    return this.resultado === RESULTADOS_RELATORIO.APROVADO;
  }

  estaReprovado() {
    return this.resultado === RESULTADOS_RELATORIO.REPROVADO;
  }

  temRessalvas() {
    return this.resultado === RESULTADOS_RELATORIO.COM_RESSALVAS;
  }

  estaIncompleto() {
    return this.resultado === RESULTADOS_RELATORIO.INCOMPLETO;
  }

  estaPendente() {
    return this.resultado === RESULTADOS_RELATORIO.PENDENTE;
  }

  // --- Métodos de Negócio e Transição ---

  aprovar() {
    this.resultado = RESULTADOS_RELATORIO.APROVADO;
    return this;
  }

  reprovar() {
    this.resultado = RESULTADOS_RELATORIO.REPROVADO;
    return this;
  }

  marcarComRessalvas() {
    this.resultado = RESULTADOS_RELATORIO.COM_RESSALVAS;
    return this;
  }

  marcarIncompleto() {
    this.resultado = RESULTADOS_RELATORIO.INCOMPLETO;
    return this;
  }

  alterarResultado(novoResultado) {
    const normalizado = normalizarResultado(novoResultado);
    if (!RESULTADOS_VALIDOS.includes(normalizado)) {
      throw new TypeError(
        `Resultado inválido. Resultados permitidos: ${RESULTADOS_VALIDOS.join(', ')}`
      );
    }
    this.resultado = normalizado;
    return this;
  }

  adicionarObservacao(texto) {
    if (typeof texto !== 'string' || texto.trim() === '') {
      throw new TypeError('Observação deve ser um texto válido');
    }
    if (this.observacoes) {
      this.observacoes += `\n${texto.trim()}`;
    } else {
      this.observacoes = texto.trim();
    }
    return this;
  }

  /**
   * Retorna os dados puros para serialização JSON ou persistência.
   */
  toJSON() {
    return {
      id: this.id,
      tarefa_id: this.tarefa_id,
      usuario_id: this.usuario_id,
      resultado: this.resultado,
      observacoes: this.observacoes,
      criado_em: this.criado_em,
    };
  }
}

