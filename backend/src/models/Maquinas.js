export const ESTADOS_MAQUINA = Object.freeze({
  DISPONIVEL: 'Disponível',
  EM_OPERACAO: 'Em Operação',
  EM_MANUTENCAO: 'Em Manutenção',
  INATIVA: 'Inativa',
});

const ESTADOS_VALIDOS = Object.values(ESTADOS_MAQUINA);

export default class Maquina {
  /**
   * Representa uma Máquina no sistema FactoryFlow.
   * @param {Object} dados
   * @param {number} [dados.id] - Identificador único da máquina (opcional na criação antes do banco)
   * @param {string} dados.nome - Nome/descrição da máquina (máx. 125 caracteres)
   * @param {string} [dados.estado='Disponível'] - Estado operacional atual
   */
  constructor({ id, nome, estado = ESTADOS_MAQUINA.DISPONIVEL } = {}) {
    // Validação do ID: se informado, deve ser inteiro positivo
    if (id !== undefined && id !== null) {
      if (!Number.isInteger(id) || id <= 0) {
        throw new TypeError('ID deve ser um inteiro positivo');
      }
      this.id = id;
    } else {
      this.id = null;
    }

    // Validação do Nome (VARCHAR 125 conforme banco de dados)
    if (typeof nome !== 'string' || nome.trim() === '') {
      throw new TypeError('Nome é obrigatório');
    }
    const nomeLimpo = nome.trim();
    if (nomeLimpo.length > 125) {
      throw new RangeError('Nome não pode exceder 125 caracteres');
    }
    this.nome = nomeLimpo;

    // Validação do Estado
    if (typeof estado !== 'string' || !ESTADOS_VALIDOS.includes(estado.trim())) {
      throw new TypeError(
        `Estado inválido. Estados permitidos: ${ESTADOS_VALIDOS.join(', ')}`
      );
    }
    this.estado = estado.trim();
  }

  /**
   * Verifica se a máquina está livre para receber tarefas/operações.
   */
  estaDisponivel() {
    return this.estado === ESTADOS_MAQUINA.DISPONIVEL;
  }

  /**
   * Verifica se a máquina está atualmente em processo produtivo.
   */
  estaEmOperacao() {
    return this.estado === ESTADOS_MAQUINA.EM_OPERACAO;
  }

  /**
   * Verifica se a máquina está em manutenção ou reparo.
   */
  estaEmManutencao() {
    return this.estado === ESTADOS_MAQUINA.EM_MANUTENCAO;
  }

  /**
   * Inicia a operação da máquina.
   * Não permite operar máquinas em manutenção ou inativas.
   */
  iniciarOperacao() {
    if (this.estado === ESTADOS_MAQUINA.EM_MANUTENCAO) {
      throw new Error('Máquina em manutenção não pode entrar em operação');
    }
    if (this.estado === ESTADOS_MAQUINA.INATIVA) {
      throw new Error('Máquina inativa não pode entrar em operação');
    }
    this.estado = ESTADOS_MAQUINA.EM_OPERACAO;
    return this;
  }

  /**
   * Libera a máquina, tornando-a disponível novamente.
   */
  liberar() {
    this.estado = ESTADOS_MAQUINA.DISPONIVEL;
    return this;
  }

  /**
   * Envia a máquina para a fila de manutenção.
   */
  enviarParaManutencao() {
    this.estado = ESTADOS_MAQUINA.EM_MANUTENCAO;
    return this;
  }

  /**
   * Desativa/inativa a máquina do fluxo de produção.
   */
  desativar() {
    this.estado = ESTADOS_MAQUINA.INATIVA;
    return this;
  }

  /**
   * Altera manualmente o estado da máquina validando a transição.
   * @param {string} novoEstado
   */
  alterarEstado(novoEstado) {
    if (typeof novoEstado !== 'string' || !ESTADOS_VALIDOS.includes(novoEstado.trim())) {
      throw new TypeError(
        `Novo estado inválido. Estados permitidos: ${ESTADOS_VALIDOS.join(', ')}`
      );
    }
    this.estado = novoEstado.trim();
    return this;
  }

  /**
   * Retorna os dados puros para respostas JSON ou inserção no banco.
   */
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      estado: this.estado,
    };
  }
}

