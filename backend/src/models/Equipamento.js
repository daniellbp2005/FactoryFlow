export const ESTADOS_EQUIPAMENTO = Object.freeze({
  PRONTO: 'Pronto',
  EM_USO: 'Em Uso',
  EM_MANUTENCAO: 'Em Manutenção',
  DEFEITUOSO: 'Defeituoso',
  INDISPONIVEL: 'Indisponível',
});

const ESTADOS_VALIDOS = Object.values(ESTADOS_EQUIPAMENTO);

/**
 * Normaliza o estado para ser tolerante a variações salvas no banco
 * (minúsculas, sem acento, dados pré-existentes), evitando quebrar consultas GET.
 */
function normalizarEstado(estado) {
  if (!estado || typeof estado !== 'string') return ESTADOS_EQUIPAMENTO.PRONTO;
  const limpo = estado.trim();
  if (!limpo) return ESTADOS_EQUIPAMENTO.PRONTO;

  if (ESTADOS_VALIDOS.includes(limpo)) return limpo;

  const semAcento = limpo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (semAcento === 'pronto' || semAcento === 'disponivel') return ESTADOS_EQUIPAMENTO.PRONTO;
  if (
    semAcento === 'em uso' ||
    semAcento === 'em_uso' ||
    semAcento === 'operando'
  ) {
    return ESTADOS_EQUIPAMENTO.EM_USO;
  }
  if (
    semAcento === 'em manutencao' ||
    semAcento === 'em_manutencao' ||
    semAcento === 'manutencao'
  ) {
    return ESTADOS_EQUIPAMENTO.EM_MANUTENCAO;
  }
  if (
    semAcento === 'defeituoso' ||
    semAcento === 'danificado' ||
    semAcento === 'quebrado'
  ) {
    return ESTADOS_EQUIPAMENTO.DEFEITUOSO;
  }
  if (semAcento === 'indisponivel' || semAcento === 'inativo') {
    return ESTADOS_EQUIPAMENTO.INDISPONIVEL;
  }

  // Tolerância para status pré-existentes no banco sem travar a API
  return limpo;
}

export default class Equipamento {
  /**
   * Representa um Equipamento no sistema FactoryFlow.
   * Conforme schema do banco de dados (tabela `equipamentos`):
   * - id: INT AUTO_INCREMENT PRIMARY KEY
   * - nome: VARCHAR(100) NOT NULL
   * - marca: VARCHAR(50) NOT NULL
   * - funcao: VARCHAR(100)
   * - estado: VARCHAR(30) NOT NULL DEFAULT 'Pronto'
   *
   * @param {Object} dados
   * @param {number} [dados.id] - Identificador único
   * @param {string} dados.nome - Nome/descrição do equipamento (máx. 100 caracteres)
   * @param {string} dados.marca - Fabricante/marca (máx. 50 caracteres)
   * @param {string} [dados.funcao] - Função ou finalidade (máx. 100 caracteres)
   * @param {string} [dados.estado='Pronto'] - Estado operacional atual
   */
  constructor({
    id,
    nome,
    marca,
    funcao = null,
    estado = ESTADOS_EQUIPAMENTO.PRONTO,
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

    // 2. Validação do Nome (VARCHAR 100 NOT NULL)
    if (typeof nome !== 'string' || nome.trim() === '') {
      throw new TypeError('Nome é obrigatório');
    }
    const nomeLimpo = nome.trim();
    if (nomeLimpo.length > 100) {
      throw new RangeError('Nome não pode exceder 100 caracteres');
    }
    this.nome = nomeLimpo;

    // 3. Validação da Marca (VARCHAR 50 NOT NULL)
    if (typeof marca !== 'string' || marca.trim() === '') {
      throw new TypeError('Marca é obrigatória');
    }
    const marcaLimpa = marca.trim();
    if (marcaLimpa.length > 50) {
      throw new RangeError('Marca não pode exceder 50 caracteres');
    }
    this.marca = marcaLimpa;

    // 4. Validação da Função (VARCHAR 100 NULL)
    if (funcao !== undefined && funcao !== null && funcao !== '') {
      if (typeof funcao !== 'string') {
        throw new TypeError('Função deve ser um texto');
      }
      const funcaoLimpa = funcao.trim();
      if (funcaoLimpa.length > 100) {
        throw new RangeError('Função não pode exceder 100 caracteres');
      }
      this.funcao = funcaoLimpa;
    } else {
      this.funcao = null;
    }

    // 5. Estado operacional (normalizado e tolerante a dados do banco)
    this.estado = normalizarEstado(estado);
  }

  // --- Métodos de Consulta de Estado ---

  estaPronto() {
    return this.estado === ESTADOS_EQUIPAMENTO.PRONTO;
  }

  estaEmUso() {
    return this.estado === ESTADOS_EQUIPAMENTO.EM_USO;
  }

  estaEmManutencao() {
    return this.estado === ESTADOS_EQUIPAMENTO.EM_MANUTENCAO;
  }

  estaDefeituoso() {
    return this.estado === ESTADOS_EQUIPAMENTO.DEFEITUOSO;
  }

  estaIndisponivel() {
    return this.estado === ESTADOS_EQUIPAMENTO.INDISPONIVEL;
  }

  // --- Métodos de Transição de Estado e Regras de Negócio ---

  alocarParaUso() {
    if (this.estado === ESTADOS_EQUIPAMENTO.EM_MANUTENCAO) {
      throw new Error('Equipamento em manutenção não pode ser alocado para uso');
    }
    if (this.estado === ESTADOS_EQUIPAMENTO.DEFEITUOSO) {
      throw new Error('Equipamento defeituoso não pode ser colocado em uso');
    }
    if (this.estado === ESTADOS_EQUIPAMENTO.INDISPONIVEL) {
      throw new Error('Equipamento indisponível não pode ser alocado');
    }
    this.estado = ESTADOS_EQUIPAMENTO.EM_USO;
    return this;
  }

  liberar() {
    this.estado = ESTADOS_EQUIPAMENTO.PRONTO;
    return this;
  }

  enviarParaManutencao() {
    this.estado = ESTADOS_EQUIPAMENTO.EM_MANUTENCAO;
    return this;
  }

  marcarDefeituoso() {
    this.estado = ESTADOS_EQUIPAMENTO.DEFEITUOSO;
    return this;
  }

  desativar() {
    this.estado = ESTADOS_EQUIPAMENTO.INDISPONIVEL;
    return this;
  }

  alterarEstado(novoEstado) {
    const normalizado = normalizarEstado(novoEstado);
    if (!ESTADOS_VALIDOS.includes(normalizado)) {
      throw new TypeError(
        `Novo estado inválido. Estados permitidos: ${ESTADOS_VALIDOS.join(', ')}`
      );
    }
    this.estado = normalizado;
    return this;
  }

  /**
   * Retorna os dados puros para serialização JSON ou persistência.
   */
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      marca: this.marca,
      funcao: this.funcao,
      estado: this.estado,
    };
  }
}
