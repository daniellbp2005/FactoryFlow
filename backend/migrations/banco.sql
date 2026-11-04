CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL DEFAULT 'funcionario',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pendente',
    prazo DATETIME NULL,
    tempo_estimado INT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maquinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(125) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'Disponível'
);

CREATE TABLE IF NOT EXISTS relatorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarefa_id INT NOT NULL,
    usuario_id INT NOT NULL,
    resultado VARCHAR(30) NOT NULL,
    observacoes TEXT,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_relatorio_tarefa
        FOREIGN KEY (tarefa_id)
        REFERENCES tarefas(id),

    CONSTRAINT fk_relatorio_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id),

    CONSTRAINT uq_relatorio_tarefa_usuario
        UNIQUE (tarefa_id, usuario_id)
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
