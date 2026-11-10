CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,          -- NOVO: Ex: 'FUNC-001'
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    turno VARCHAR(20) NOT NULL DEFAULT 'Manhã',   -- NOVO: Manhã, Tarde, Noite, Administrativo
    ativo BOOLEAN NOT NULL DEFAULT TRUE,          -- NOVO: Ativo / Inativo
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL DEFAULT 'funcionario',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. TAREFAS
CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,              -- NOVO: Ex: 'OP-2847'
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    setor VARCHAR(50) NOT NULL DEFAULT 'Geral',      -- NOVO: Usinagem, Montagem, etc.
    prioridade VARCHAR(10) NOT NULL DEFAULT 'Média', -- NOVO: Alta, Média, Baixa
    status VARCHAR(30) NOT NULL DEFAULT 'Pendente',
    periodo VARCHAR(15) NOT NULL DEFAULT 'Semana',   -- NOVO: Dia, Semana, Mês
    turno_prazo VARCHAR(20) NOT NULL DEFAULT 'Indefinido', -- NOVO: Dia, Tarde, Noite, Indefinido
    prazo DATETIME NULL,
    tempo_estimado DECIMAL(5,2) NOT NULL,                -- AJUSTADO: Em Horas (ex: 1.50 = 1h30)
    iniciado_em DATETIME NOT NULL,                       -- NOVO: Data/hora real de início
    finalizado_em DATETIME NOT NULL,                     -- NOVO: Data/hora real de conclusão
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maquinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(125) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'Disponível'
);
-- 3. RELATÓRIOS
CREATE TABLE IF NOT EXISTS relatorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,               -- NOVO: Ex: 'REL-2026-001'
    tarefa_id INT NOT NULL,
    usuario_id INT NOT NULL,
    maquina_id INT NULL,
    categoria VARCHAR(50) NOT NULL,                  -- NOVO: Treinamento, Desempenho, Ocorrência, Manutenção
    status VARCHAR(30) NOT NULL DEFAULT 'Concluído', -- NOVO: Concluído, Em andamento, Indisponível, Pendente
    motivo TEXT NULL,                                -- NOVO: Motivo da parada/interrupção
    finalidade VARCHAR(255) NULL,                    -- NOVO: Finalidade da inspeção/relatório
    resultado VARCHAR(30) NOT NULL,                  -- Aprovado, Reprovado, Com Ressalvas
    observacoes TEXT,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Já guarda data e HORA!
    FOREIGN KEY (tarefa_id) REFERENCES tarefas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (maquina_id) REFERENCES maquinas(id)
);

CREATE TABLE IF NOT EXISTS equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    funcao VARCHAR(100),
    estado VARCHAR(30) NOT NULL DEFAULT 'Pronto'
);

CREATE TABLE IF NOT EXISTS tarefas_usuarios (  /*tabela intermadiaria*/
    tarefa_id INT NOT NULL,
    usuario_id INT NOT NULL,

    PRIMARY KEY (tarefa_id, usuario_id),

    FOREIGN KEY (tarefa_id) REFERENCES tarefas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS tarefas_equipamentos ( /*tabela intermadiaria*/
    tarefa_id INT NOT NULL,
    equipamento_id INT NOT NULL,

    PRIMARY KEY (tarefa_id, equipamento_id),

    FOREIGN KEY (tarefa_id)
        REFERENCES tarefas(id),

    FOREIGN KEY (equipamento_id)
        REFERENCES equipamentos(id)
);
