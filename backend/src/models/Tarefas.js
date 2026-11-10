export const STATUS_TAREFA = Object.freeze({
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
  PAUSADA: 'Pausada',
});

export const PRIORIDADES_TAREFA = Object.freeze({
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa',
});

export const PERIODOS_TEMPO = Object.freeze({
  DIA: 'Dia',
  SEMANA: 'Semana',
  MES: 'Mês',
});

export const TURNOS_PRAZO = Object.freeze({
  DIA: 'Dia',
  TARDE: 'Tarde',
  NOITE: 'Noite',
  INDEFINIDO: 'Indefinido',
});

const STATUS_VALIDOS = Object.values(STATUS_TAREFA);
const PRIORIDADES_VALIDAS = Object.values(PRIORIDADES_TAREFA);
const PERIODOS_VALIDOS = Object.values(PERIODOS_TEMPO);
const TURNOS_VALIDOS = Object.values(TURNOS_PRAZO);

/**
 * Normaliza o status para ser tolerante a variações salvas no banco
 * evitando travar requisições de listagem (GET).
 */
function normalizarStatus(status) {
  if (!status || typeof status !== 'string') return STATUS_TAREFA.PENDENTE;
  const limpo = status.trim();
  if (!limpo) return STATUS_TAREFA.PENDENTE;

  if (STATUS_VALIDOS.includes(limpo)) return limpo;

  const semAcento = limpo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (semAcento === 'pendente') return STATUS_TAREFA.PENDENTE;
  if (
    semAcento === 'em andamento' ||
    semAcento === 'em_andamento' ||
    semAcento === 'andamento'
  ) {
    return STATUS_TAREFA.EM_ANDAMENTO;
  }
  if (
    semAcento === 'concluida' ||
    semAcento === 'concluido' ||
    semAcento === 'finalizada' ||
    semAcento === 'finalizado'
  ) {
    return STATUS_TAREFA.CONCLUIDA;
  }
  if (semAcento === 'cancelada' || semAcento === 'cancelado') {
    return STATUS_TAREFA.CANCELADA;
  }
  if (semAcento === 'pausada' || semAcento === 'pausado') {
    return STATUS_TAREFA.PAUSADA;
  }

  return limpo;
}

/**
 * Normaliza a prioridade para valores padronizados (Alta, Média, Baixa)
 */
function normalizarPrioridade(prioridade) {
  if (!prioridade || typeof prioridade !== 'string') return PRIORIDADES_TAREFA.MEDIA;
  const limpo = prioridade.trim();
  if (!limpo) return PRIORIDADES_TAREFA.MEDIA;

  if (PRIORIDADES_VALIDAS.includes(limpo)) return limpo;

  const semAcento = limpo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (semAcento === 'alta' || semAcento === 'urgente') return PRIORIDADES_TAREFA.ALTA;
  if (semAcento === 'media' || semAcento === 'normal') return PRIORIDADES_TAREFA.MEDIA;
  if (semAcento === 'baixa') return PRIORIDADES_TAREFA.BAIXA;

  return PRIORIDADES_TAREFA.MEDIA;
}

/**
 * Normaliza o período de planejamento (Dia, Semana, Mês)
 */
function normalizarPeriodo(periodo) {
  if (!periodo || typeof periodo !== 'string') return PERIODOS_TEMPO.SEMANA;
  const limpo = periodo.trim();
  if (!limpo) return PERIODOS_TEMPO.SEMANA;

  if (PERIODOS_VALIDOS.includes(limpo)) return limpo;

  const semAcento = limpo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (semAcento === 'dia' || semAcento === 'diario') return PERIODOS_TEMPO.DIA;
  if (semAcento === 'semana' || semAcento === 'semanal') return PERIODOS_TEMPO.SEMANA;
  if (semAcento === 'mes' || semAcento === 'mensal') return PERIODOS_TEMPO.MES;

  return PERIODOS_TEMPO.SEMANA;
}

/**
 * Normaliza o turno do prazo (Dia, Tarde, Noite, Indefinido)
 */
function normalizarTurnoPrazo(turno) {
  if (!turno || typeof turno !== 'string') return TURNOS_PRAZO.INDEFINIDO;
  const limpo = turno.trim();
  if (!limpo) return TURNOS_PRAZO.INDEFINIDO;

  if (TURNOS_VALIDOS.includes(limpo)) return limpo;

  const semAcento = limpo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (semAcento === 'dia' || semAcento === 'manha') return TURNOS_PRAZO.DIA;
  if (semAcento === 'tarde') return TURNOS_PRAZO.TARDE;
  if (semAcento === 'noite') return TURNOS_PRAZO.NOITE;
  if (semAcento === 'indefinido' || semAcento === 'qualquer') return TURNOS_PRAZO.INDEFINIDO;

  return TURNOS_PRAZO.INDEFINIDO;
}

export default class Tarefa {
  /**
   * Representa uma Ordem de Serviço / Tarefa no sistema FactoryFlow.
   * Conforme schema atualizado do banco de dados (tabela `tarefas`):
   * - id: INT AUTO_INCREMENT PRIMARY KEY
   * - codigo: VARCHAR(20) UNIQUE NOT NULL (ex: 'OP-2847')
   * - titulo: VARCHAR(150) NOT NULL
   * - descricao: TEXT NOT NULL
   * - setor: VARCHAR(50) NOT NULL DEFAULT 'Geral'
   * - prioridade: VARCHAR(10) NOT NULL DEFAULT 'Média'
   * - status: VARCHAR(30) NOT NULL DEFAULT 'Pendente'
   * - periodo: VARCHAR(15) NOT NULL DEFAULT 'Semana' (Dia, Semana, Mês)
   * - turno_prazo: VARCHAR(20) NOT NULL DEFAULT 'Indefinido' (Dia, Tarde, Noite, Indefinido)
   * - prazo: DATETIME NULL
   * - tempo_estimado: DECIMAL(5,2) NOT NULL (em Horas)
   * - iniciado_em: DATETIME NOT NULL
   * - finalizado_em: DATETIME NOT NULL
   * - criado_em: DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
   */
  constructor({
    id,
    codigo,
    order, // alias aceito do frontend
    titulo,
    nome, // alias aceito
    descricao,
    setor = 'Geral',
    prioridade,
    priority, // alias aceito do frontend
    status,
    estado, // alias aceito
    periodo,
    tempo, // alias aceito
    turno_prazo,
    prazo_turno, // alias aceito
    prazo = null,
    tempo_estimado = 0,
    iniciado_em = null,
    finalizado_em = null,
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

    // 2. Validação do Código Único da Tarefa (ex: 'OP-2847')
    const codigoRecebido = codigo ?? order;
    if (codigoRecebido !== undefined && codigoRecebido !== null && String(codigoRecebido).trim() !== '') {
      const codigoLimpo = String(codigoRecebido).trim().toUpperCase();
      if (codigoLimpo.length > 20) {
        throw new RangeError('Código não pode exceder 20 caracteres');
      }
      this.codigo = codigoLimpo;
    } else {
      this.codigo = null; // Será gerado automaticamente pelo service se não fornecido
    }

    // 3. Validação do Título (VARCHAR 150 NOT NULL)
    const tituloRecebido = titulo ?? nome;
    if (typeof tituloRecebido !== 'string' || tituloRecebido.trim() === '') {
      throw new TypeError('Título é obrigatório');
    }
    const tituloLimpo = tituloRecebido.trim();
    if (tituloLimpo.length > 150) {
      throw new RangeError('Título não pode exceder 150 caracteres');
    }
    this.titulo = tituloLimpo;

    // 4. Validação da Descrição (TEXT NOT NULL)
    if (descricao !== undefined && descricao !== null) {
      if (typeof descricao !== 'string') {
        throw new TypeError('Descrição deve ser um texto');
      }
      this.descricao = descricao.trim();
    } else {
      this.descricao = '';
    }

    // 5. Validação do Setor (VARCHAR 50 NOT NULL)
    if (setor !== undefined && setor !== null && String(setor).trim() !== '') {
      const setorLimpo = String(setor).trim();
      if (setorLimpo.length > 50) {
        throw new RangeError('Setor não pode exceder 50 caracteres');
      }
      this.setor = setorLimpo;
    } else {
      this.setor = 'Geral';
    }

    // 6. Prioridade (Alta, Média, Baixa)
    this.prioridade = normalizarPrioridade(prioridade ?? priority);

    // 7. Status Operacional (Pendente, Em Andamento, Concluída, Cancelada, Pausada)
    this.status = normalizarStatus(status ?? estado);

    // 8. Período / Área de Tempo (Dia, Semana, Mês)
    this.periodo = normalizarPeriodo(periodo ?? tempo);

    // 9. Turno do Prazo (Dia, Tarde, Noite, Indefinido)
    this.turno_prazo = normalizarTurnoPrazo(turno_prazo ?? prazo_turno);

    // 10. Validação do Prazo (DATETIME / Date)
    if (prazo !== undefined && prazo !== null && prazo !== '') {
      const dataPrazo = new Date(prazo);
      if (Number.isNaN(dataPrazo.getTime())) {
        throw new TypeError('Prazo deve ser uma data válida');
      }
      this.prazo = dataPrazo;
    } else {
      this.prazo = null;
    }

    // 11. Tempo Estimado (em HORAS - DECIMAL(5,2) NOT NULL)
    if (tempo_estimado !== undefined && tempo_estimado !== null && tempo_estimado !== '') {
      const tempoNum = Number(tempo_estimado);
      if (Number.isNaN(tempoNum) || tempoNum < 0) {
        throw new TypeError('Tempo estimado deve ser um número não negativo (em horas)');
      }
      this.tempo_estimado = Number(tempoNum.toFixed(2));
    } else {
      this.tempo_estimado = 0.0;
    }

    // 12. Data/hora de início real (DATETIME NOT NULL)
    if (iniciado_em !== undefined && iniciado_em !== null && iniciado_em !== '') {
      const dataInicio = new Date(iniciado_em);
      if (Number.isNaN(dataInicio.getTime())) {
        throw new TypeError('Data de início (iniciado_em) deve ser uma data válida');
      }
      this.iniciado_em = dataInicio;
    } else {
      this.iniciado_em = new Date();
    }

    // 13. Data/hora de conclusão real (DATETIME NOT NULL)
    if (finalizado_em !== undefined && finalizado_em !== null && finalizado_em !== '') {
      const dataFim = new Date(finalizado_em);
      if (Number.isNaN(dataFim.getTime())) {
        throw new TypeError('Data de conclusão (finalizado_em) deve ser uma data válida');
      }
      this.finalizado_em = dataFim;
    } else {
      this.finalizado_em = new Date();
    }

    // 14. Data de criação no sistema
    if (criado_em) {
      const dataCriacao = new Date(criado_em);
      this.criado_em = Number.isNaN(dataCriacao.getTime()) ? new Date() : dataCriacao;
    } else {
      this.criado_em = new Date();
    }
  }

  // --- Métodos de Consulta de Estado ---

  estaPendente() {
    return this.status === STATUS_TAREFA.PENDENTE;
  }

  estaEmAndamento() {
    return this.status === STATUS_TAREFA.EM_ANDAMENTO;
  }

  estaConcluida() {
    return this.status === STATUS_TAREFA.CONCLUIDA;
  }

  estaCancelada() {
    return this.status === STATUS_TAREFA.CANCELADA;
  }

  estaPausada() {
    return this.status === STATUS_TAREFA.PAUSADA;
  }

  ePrioridadeAlta() {
    return this.prioridade === PRIORIDADES_TAREFA.ALTA;
  }

  // --- Métodos de Transição de Estado e Regras de Negócio ---

  iniciar() {
    if (this.status === STATUS_TAREFA.CONCLUIDA) {
      throw new Error('Tarefa já concluída não pode ser iniciada novamente');
    }
    if (this.status === STATUS_TAREFA.CANCELADA) {
      throw new Error('Tarefa cancelada não pode ser iniciada');
    }
    this.status = STATUS_TAREFA.EM_ANDAMENTO;
    this.iniciado_em = new Date();
    return this;
  }

  concluir() {
    if (this.status === STATUS_TAREFA.CANCELADA) {
      throw new Error('Tarefa cancelada não pode ser concluída');
    }
    this.status = STATUS_TAREFA.CONCLUIDA;
    this.finalizado_em = new Date();
    return this;
  }

  pausar() {
    if (this.status !== STATUS_TAREFA.EM_ANDAMENTO) {
      throw new Error('Apenas tarefas em andamento podem ser pausadas');
    }
    this.status = STATUS_TAREFA.PAUSADA;
    return this;
  }

  cancelar() {
    if (this.status === STATUS_TAREFA.CONCLUIDA) {
      throw new Error('Tarefa já concluída não pode ser cancelada');
    }
    this.status = STATUS_TAREFA.CANCELADA;
    return this;
  }

  alterarPrioridade(novaPrioridade) {
    this.prioridade = normalizarPrioridade(novaPrioridade);
    return this;
  }

  alterarStatus(novoStatus) {
    const normalizado = normalizarStatus(novoStatus);
    if (!STATUS_VALIDOS.includes(normalizado)) {
      throw new TypeError(
        `Novo status inválido. Status permitidos: ${STATUS_VALIDOS.join(', ')}`
      );
    }
    this.status = normalizado;
    return this;
  }

  /**
   * Retorna os dados puros para serialização JSON ou persistência.
   */
  toJSON() {
    return {
      id: this.id,
      codigo: this.codigo,
      titulo: this.titulo,
      descricao: this.descricao,
      setor: this.setor,
      prioridade: this.prioridade,
      status: this.status,
      periodo: this.periodo,
      turno_prazo: this.turno_prazo,
      prazo: this.prazo,
      tempo_estimado: this.tempo_estimado,
      iniciado_em: this.iniciado_em,
      finalizado_em: this.finalizado_em,
      criado_em: this.criado_em,
    };
  }
}
