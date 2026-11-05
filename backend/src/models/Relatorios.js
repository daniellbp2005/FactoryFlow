export const CATEGORIAS_RELATORIO = Object.freeze({
  TREINAMENTO: 'Treinamento',
  DESEMPENHO: 'Desempenho',
  OCORRENCIA: 'Ocorrência',
  MANUTENCAO: 'Manutenção',
});

export const STATUS_RELATORIO = Object.freeze({
  CONCLUIDO: 'Concluído',
  EM_ANDAMENTO: 'Em andamento',
  INDISPONIVEL: 'Indisponível',
  PENDENTE: 'Pendente',
});

export const RESULTADOS_RELATORIO = Object.freeze({
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  COM_RESSALVAS: 'Com Ressalvas',
  INCOMPLETO: 'Incompleto',
  PENDENTE: 'Pendente',
});

const CATEGORIAS_VALIDAS = Object.values(CATEGORIAS_RELATORIO);
const STATUS_VALIDOS = Object.values(STATUS_RELATORIO);
const RESULTADOS_VALIDOS = Object.values(RESULTADOS_RELATORIO);

/**
 * Normaliza a categoria para valores válidos (Treinamento, Desempenho, Ocorrência, Manutenção)
 */
function normalizarCategoria(categoria) {
  if (!categoria || typeof categoria !== 'string') return CATEGORIAS_RELATORIO.MANUTENCAO;
  const limpo = categoria.trim();
  if (!limpo) return CATEGORIAS_RELATORIO.MANUTENCAO;

  if (CATEGORIAS_VALIDAS.includes(limpo)) return limpo;

  const semAcento = limpo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (semAcento === 'treinamento' || semAcento === 'capacitacao') return CATEGORIAS_RELATORIO.TREINAMENTO;
  if (semAcento === 'desempenho' || semAcento === 'produtividade') return CATEGORIAS_RELATORIO.DESEMPENHO;
  if (semAcento === 'ocorrencia' || semAcento === 'incidente' || semAcento === 'falha') return CATEGORIAS_RELATORIO.OCORRENCIA;
  if (semAcento === 'manutencao' || semAcento === 'reparo') return CATEGORIAS_RELATORIO.MANUTENCAO;

  return limpo;
}

/**
 * Normaliza o status do relatório (Concluído, Em andamento, Indisponível, Pendente)
 */
function normalizarStatus(status) {
  if (!status || typeof status !== 'string') return STATUS_RELATORIO.CONCLUIDO;
  const limpo = status.trim();
  if (!limpo) return STATUS_RELATORIO.CONCLUIDO;

  if (STATUS_VALIDOS.includes(limpo)) return limpo;

  const semAcento = limpo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (semAcento === 'concluido' || semAcento === 'finalizado') return STATUS_RELATORIO.CONCLUIDO;
  if (semAcento === 'em andamento' || semAcento === 'em_andamento' || semAcento === 'andamento' || semAcento === 'em analise') {
    return STATUS_RELATORIO.EM_ANDAMENTO;
  }
  if (semAcento === 'indisponivel' || semAcento === 'bloqueado' || semAcento === 'parado') {
    return STATUS_RELATORIO.INDISPONIVEL;
  }
  if (semAcento === 'pendente' || semAcento === 'aguardando') return STATUS_RELATORIO.PENDENTE;

  return limpo;
}

/**
 * Normaliza o resultado (Aprovado, Reprovado, Com Ressalvas, etc.)
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
  if (semAcento === 'pendente') {
    return RESULTADOS_RELATORIO.PENDENTE;
  }

  return limpo;
}

export default class Relatorio {
  /**
   * Representa um Relatório / Apontamento de Produção no sistema FactoryFlow.
   * Conforme schema atualizado do banco de dados (tabela `relatorios`):
   * - id: INT AUTO_INCREMENT PRIMARY KEY
   * - codigo: VARCHAR(30) UNIQUE NOT NULL (ex: 'REL-2026-001')
   * - tarefa_id: INT NOT NULL (FK para tarefas)
   * - usuario_id: INT NOT NULL (FK para usuarios)
   * - maquina_id: INT NULL (FK para maquinas)
   * - categoria: VARCHAR(50) NOT NULL (Treinamento, Desempenho, Ocorrência, Manutenção)
   * - status: VARCHAR(30) NOT NULL DEFAULT 'Concluído' (Concluído, Em andamento, Indisponível, Pendente)
   * - motivo: TEXT NULL (motivo de parada/interrupção ou detalhe)
   * - finalidade: VARCHAR(255) NULL (objetivo do relatório)
   * - resultado: VARCHAR(30) NOT NULL (Aprovado, Reprovado, Com Ressalvas)
   * - observacoes: TEXT NULL
   * - criado_em: DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP (registra data e hora exata)
   */
  constructor({
    id,
    codigo,
    tarefa_id,
    tarefaId,
    usuario_id,
    usuarioId,
    maquina_id,
    maquinaId,
    categoria,
    tipo, // alias aceito do frontend
    type, // alias aceito do frontend
    status,
    motivo,
    comment, // alias aceito do frontend
    finalidade,
    resultado = RESULTADOS_RELATORIO.APROVADO,
    observacoes = null,
    obs, // alias aceito
    criado_em = null,
  } = {}) {
    // 1. Validação do ID
    if (id !== undefined && id !== null) {
      const idNum = Number(id);
      if (!Number.isInteger(idNum) || idNum <= 0) {
        throw new TypeError('ID deve ser um inteiro positivo');
      }
      this.id = idNum;
    } else {
      this.id = null;
    }

    // 2. Validação do Código Único do Relatório (ex: 'REL-2026-001')
    if (codigo !== undefined && codigo !== null && String(codigo).trim() !== '') {
      const codigoLimpo = String(codigo).trim().toUpperCase();
      if (codigoLimpo.length > 30) {
        throw new RangeError('Código não pode exceder 30 caracteres');
      }
      this.codigo = codigoLimpo;
    } else {
      this.codigo = null; // Gerado automaticamente se não enviado
    }

    // 3. Validação do tarefa_id (aceita tarefa_id ou tarefaId)
    const tarefaRecebida = tarefa_id ?? tarefaId;
    if (tarefaRecebida === undefined || tarefaRecebida === null || tarefaRecebida === '') {
      throw new TypeError('tarefa_id é obrigatório');
    }
    const tarefaIdNum = Number(tarefaRecebida);
    if (!Number.isInteger(tarefaIdNum) || tarefaIdNum <= 0) {
      throw new TypeError('tarefa_id deve ser um inteiro positivo');
    }
    this.tarefa_id = tarefaIdNum;

    // 4. Validação do usuario_id (aceita usuario_id ou usuarioId)
    const usuarioRecebido = usuario_id ?? usuarioId;
    if (usuarioRecebido === undefined || usuarioRecebido === null || usuarioRecebido === '') {
      throw new TypeError('usuario_id é obrigatório');
    }
    const usuarioIdNum = Number(usuarioRecebido);
    if (!Number.isInteger(usuarioIdNum) || usuarioIdNum <= 0) {
      throw new TypeError('usuario_id deve ser um inteiro positivo');
    }
    this.usuario_id = usuarioIdNum;

    // 5. Validação do maquina_id (opcional)
    const maquinaRecebida = maquina_id ?? maquinaId;
    if (maquinaRecebida !== undefined && maquinaRecebida !== null && maquinaRecebida !== '') {
      const maquinaIdNum = Number(maquinaRecebida);
      if (!Number.isInteger(maquinaIdNum) || maquinaIdNum <= 0) {
        throw new TypeError('maquina_id deve ser um inteiro positivo');
      }
      this.maquina_id = maquinaIdNum;
    } else {
      this.maquina_id = null;
    }

    // 6. Categoria (Treinamento, Desempenho, Ocorrência, Manutenção)
    this.categoria = normalizarCategoria(categoria ?? tipo ?? type);

    // 7. Status (Concluído, Em andamento, Indisponível, Pendente)
    this.status = normalizarStatus(status);

    // 8. Motivo (TEXT NULL - justificativa de parada ou detalhe operacional)
    const motivoRecebido = motivo ?? comment;
    if (motivoRecebido !== undefined && motivoRecebido !== null && String(motivoRecebido).trim() !== '') {
      this.motivo = String(motivoRecebido).trim();
    } else {
      this.motivo = null;
    }

    // 9. Finalidade (VARCHAR 255 NULL)
    if (finalidade !== undefined && finalidade !== null && String(finalidade).trim() !== '') {
      const finalidadeLimpa = String(finalidade).trim();
      if (finalidadeLimpa.length > 255) {
        throw new RangeError('Finalidade não pode exceder 255 caracteres');
      }
      this.finalidade = finalidadeLimpa;
    } else {
      this.finalidade = null;
    }

    // 10. Resultado (Aprovado, Reprovado, Com Ressalvas)
    this.resultado = normalizarResultado(resultado);

    // 11. Observações (TEXT NULL)
    const obsRecebida = observacoes ?? obs;
    if (obsRecebida !== undefined && obsRecebida !== null && String(obsRecebida).trim() !== '') {
      this.observacoes = String(obsRecebida).trim();
    } else {
      this.observacoes = null;
    }

    // 12. Data e Hora de criação
    if (criado_em) {
      const dataCriacao = new Date(criado_em);
      this.criado_em = Number.isNaN(dataCriacao.getTime()) ? null : dataCriacao;
    } else {
      this.criado_em = null;
    }
  }

  // --- Métodos de Consulta de Estado ---

  estaConcluido() {
    return this.status === STATUS_RELATORIO.CONCLUIDO;
  }

  estaEmAndamento() {
    return this.status === STATUS_RELATORIO.EM_ANDAMENTO;
  }

  estaIndisponivel() {
    return this.status === STATUS_RELATORIO.INDISPONIVEL;
  }

  estaPendente() {
    return this.status === STATUS_RELATORIO.PENDENTE;
  }

  estaAprovado() {
    return this.resultado === RESULTADOS_RELATORIO.APROVADO;
  }

  estaReprovado() {
    return this.resultado === RESULTADOS_RELATORIO.REPROVADO;
  }

  temRessalvas() {
    return this.resultado === RESULTADOS_RELATORIO.COM_RESSALVAS;
  }

  // --- Métodos de Domínio e Transição ---

  concluir() {
    this.status = STATUS_RELATORIO.CONCLUIDO;
    return this;
  }

  marcarIndisponivel(motivoTexto) {
    this.status = STATUS_RELATORIO.INDISPONIVEL;
    if (motivoTexto && typeof motivoTexto === 'string') {
      this.motivo = motivoTexto.trim();
    }
    return this;
  }

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

  alterarCategoria(novaCategoria) {
    this.categoria = normalizarCategoria(novaCategoria);
    return this;
  }

  alterarStatus(novoStatus) {
    this.status = normalizarStatus(novoStatus);
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
      codigo: this.codigo,
      tarefa_id: this.tarefa_id,
      usuario_id: this.usuario_id,
      maquina_id: this.maquina_id,
      categoria: this.categoria,
      status: this.status,
      motivo: this.motivo,
      finalidade: this.finalidade,
      resultado: this.resultado,
      observacoes: this.observacoes,
      criado_em: this.criado_em,
    };
  }
}
