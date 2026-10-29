export const STATUS_TAREFA = Object.freeze({
    PENDENTE: 'Pendente',
    EM_ANDAMENTO: 'Em Andamento',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
    PAUSADA: 'Pausada',
});

const STATUS_VALIDOS = Object.values(STATUS_TAREFA);

/**
 * Normaliza o status para ser tolerante a variações salvas no banco
 * (ex: minúsculas, sem acento, espaços extras ou status pré-existentes),
 * evitando travar requisições de listagem (GET).
 */
function normalizarStatus(status) {
    if (!status || typeof status !== 'string') return STATUS_TAREFA.PENDENTE;
    const limpo = status.trim();
    if (!limpo) return STATUS_TAREFA.PENDENTE;

    // Se já for exatamente um dos valores oficiais
    if (STATUS_VALIDOS.includes(limpo)) return limpo;

    // Compara sem acentos e em minúsculas
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

    // Se o banco possuir outro status qualquer (ex: dados antigos ou testes),
    // aceita o valor original para permitir a visualização via GET sem quebrar a API
    return limpo;
}

export default class Tarefa {
    /**
     * Representa uma Tarefa no sistema FactoryFlow.
     * Conforme schema do banco de dados (tabela `tarefas`):
     * - id: INT AUTO_INCREMENT PRIMARY KEY
     * - titulo: VARCHAR(150) NOT NULL
     * - descricao: TEXT NOT NULL
     * - status: VARCHAR(30) NOT NULL DEFAULT 'Pendente'
     * - prazo: DATETIME NULL
     * - tempo_estimado: INT NULL (em minutos)
     * - criado_em: DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
     *
     * @param {Object} dados
     * @param {number} [dados.id] - Identificador único da tarefa
     * @param {string} dados.titulo - Título/resumo da tarefa (máx. 150 caracteres)
     * @param {string} [dados.nome] - Alias aceito para título
     * @param {string} dados.descricao - Descrição detalhada da tarefa
     * @param {string} [dados.status='Pendente'] - Status operacional atual
     * @param {string} [dados.estado] - Alias aceito para status
     * @param {Date|string} [dados.prazo=null] - Prazo limite para conclusão
     * @param {number} [dados.tempo_estimado=null] - Tempo estimado em minutos
     * @param {Date|string} [dados.criado_em=null] - Data/hora de registro da tarefa
     */
    constructor({
        id,
        titulo,
        nome,
        descricao,
        status,
        estado,
        prazo = null,
        tempo_estimado = null,
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

        // 2. Validação do Título (aceita titulo ou nome)
        const tituloRecebido = titulo ?? nome;
        if (typeof tituloRecebido !== 'string' || tituloRecebido.trim() === '') {
            throw new TypeError('Título é obrigatório');
        }
        const tituloLimpo = tituloRecebido.trim();
        if (tituloLimpo.length > 150) {
            throw new RangeError('Título não pode exceder 150 caracteres');
        }
        this.titulo = tituloLimpo;

        // 3. Validação da Descrição
        if (descricao !== undefined && descricao !== null) {
            if (typeof descricao !== 'string') {
                throw new TypeError('Descrição deve ser um texto');
            }
            this.descricao = descricao.trim();
        } else {
            this.descricao = '';
        }

        // 4. Normalização e definição do Status (tolerante a variações vindas do banco)
        const statusBruto = status ?? estado;
        this.status = normalizarStatus(statusBruto);



        // 5. Validação do Prazo (DATETIME / ISO string / Date)
        if (prazo !== undefined && prazo !== null && prazo !== '') {
            const dataPrazo = new Date(prazo);
            if (Number.isNaN(dataPrazo.getTime())) {
                throw new TypeError('Prazo deve ser uma data válida');
            }
            this.prazo = dataPrazo;
        } else {
            this.prazo = null;
        }

        // 6. Validação do Tempo Estimado (INT em minutos)
        if (tempo_estimado !== undefined && tempo_estimado !== null && tempo_estimado !== '') {
            const tempoNum = Number(tempo_estimado);
            if (!Number.isInteger(tempoNum) || tempoNum < 0) {
                throw new TypeError('Tempo estimado deve ser um número inteiro não negativo (em minutos)');
            }
            this.tempo_estimado = tempoNum;
        } else {
            this.tempo_estimado = null;
        }

        // 7. Data de criação
        if (criado_em) {
            const dataCriacao = new Date(criado_em);
            this.criado_em = Number.isNaN(dataCriacao.getTime()) ? null : dataCriacao;
        } else {
            this.criado_em = null;
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

    // --- Métodos de Transição de Estado e Regras de Negócio ---

    iniciar() {
        if (this.status === STATUS_TAREFA.CONCLUIDA) {
            throw new Error('Tarefa já concluída não pode ser iniciada novamente');
        }
        if (this.status === STATUS_TAREFA.CANCELADA) {
            throw new Error('Tarefa cancelada não pode ser iniciada');
        }
        this.status = STATUS_TAREFA.EM_ANDAMENTO;
        return this;
    }

    concluir() {
        if (this.status === STATUS_TAREFA.CANCELADA) {
            throw new Error('Tarefa cancelada não pode ser concluída');
        }
        this.status = STATUS_TAREFA.CONCLUIDA;
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
            titulo: this.titulo,
            descricao: this.descricao,
            status: this.status,
            prazo: this.prazo,
            tempo_estimado: this.tempo_estimado,
            criado_em: this.criado_em,
        };
    }
}
