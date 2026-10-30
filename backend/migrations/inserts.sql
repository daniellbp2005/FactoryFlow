-- ==============================================================================
-- FACTORYFLOW: INSERTS PARA TESTES
-- Ordem de execução respeitando as chaves estrangeiras (FK):
-- 1. maquinas
-- 2. usuarios
-- 3. tarefas
-- 4. equipamentos
-- 5. tarefas_usuarios (tabela intermediária N:N)
-- 6. tarefas_equipamentos (tabela intermediária N:N)
-- 7. relatorios (depende de tarefas e usuarios)
-- ==============================================================================

-- 1. MÁQUINAS
INSERT INTO maquinas (nome, estado) VALUES
('Torno CNC 01', 'Disponível'),
('Fresadora Industrial 01', 'Em Operação'),
('Prensa Hidráulica 01', 'Inativa'),
('Esteira Transportadora 01', 'Em Operação'),
('Robô Industrial 01', 'Disponível'),
('Compressor de Ar 01', 'Em Manutenção'),
('Furadeira de Bancada 01', 'Disponível'),
('Máquina de Solda 01', 'Em Operação'),
('Retífica Industrial 01', 'Em Manutenção'),
('Empilhadeira 01', 'Inativa');

-- 2. USUÁRIOS
-- Obs: A senha cadastrada para todos é 'Senha_teste_123' (hash bcrypt válido)
INSERT INTO usuarios (nome, cpf, cargo, email, senha, perfil) VALUES
('Carlos Silva', '111.222.333-44', 'Mecânico Industrial', 'carlos.silva@factoryflow.com', '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario'),
('Ana Paula Souza', '222.333.444-55', 'Eletricista de Manutenção', 'ana.souza@factoryflow.com', '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario'),
('Bruno Santos', '333.444.555-66', 'Operador de Máquinas', 'bruno.santos@factoryflow.com', '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario'),
('Mariana Lima', '444.555.666-77', 'Supervisora de Produção', 'mariana.lima@factoryflow.com', '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'administrador');

-- 3. TAREFAS
INSERT INTO tarefas (titulo, descricao, status, prazo, tempo_estimado) VALUES
(
  'Manutenção da esteira',
  'Verificar o funcionamento e realizar a manutenção preventiva da esteira transportadora.',
  'Em andamento',
  '2026-11-02 14:00:00',
  120
),
(
  'Inspeção do motor industrial',
  'Inspecionar o motor industrial e verificar possíveis sinais de desgaste ou superaquecimento.',
  'Em andamento',
  '2026-11-01 16:00:00',
  90
),
(
  'Lubrificação das máquinas',
  'Realizar a lubrificação periódica dos componentes móveis das máquinas da fábrica.',
  'Pendente',
  '2026-11-04 10:00:00',
  60
),
(
  'Reparo do compressor de ar',
  'Identificar a causa da queda de pressão e substituir vedações do compressor de ar.',
  'Concluída',
  '2026-10-30 12:00:00',
  180
);

-- 4. EQUIPAMENTOS (Ferramentas e instrumentos de apoio)
INSERT INTO equipamentos (nome, marca, funcao, estado) VALUES
('Chave de Impacto Pneumática', 'Bosch', 'Apertar e soltar parafusos industriais de alto torque', 'Pronto'),
('Multímetro Digital True RMS', 'Fluke', 'Medir tensão, corrente e resistência elétrica com precisão', 'Pronto'),
('Máquina de Solda MIG/MAG', 'ESAB', 'Realizar soldagem de chapas e tubulações metálicas', 'Em uso'),
('Esmerilhadeira Angular 7pol', 'Makita', 'Cortar e desbastar peças metálicas e soldas', 'Pronto'),
('Macaco Hidráulico tipo Garrafa', 'Bovenau', 'Elevar componentes mecânicos e suportes pesados', 'Pronto');

-- 5. TAREFAS_USUARIOS (Tabela Intermediária: quem está escalado em qual tarefa)
INSERT INTO tarefas_usuarios (tarefa_id, usuario_id) VALUES
(1, 1), -- Carlos na Manutenção da esteira
(1, 2), -- Ana Paula também na Manutenção da esteira
(2, 2), -- Ana Paula na Inspeção do motor
(3, 3), -- Bruno na Lubrificação das máquinas
(4, 1); -- Carlos no Reparo do compressor

-- 6. TAREFAS_EQUIPAMENTOS (Tabela Intermediária: quais ferramentas foram usadas na tarefa)
INSERT INTO tarefas_equipamentos (tarefa_id, equipamento_id) VALUES
(1, 1), -- Chave de Impacto na Tarefa 1 (Esteira)
(1, 4), -- Esmerilhadeira na Tarefa 1 (Esteira)
(2, 2), -- Multímetro Digital na Tarefa 2 (Motor)
(4, 1), -- Chave de Impacto na Tarefa 4 (Compressor)
(4, 3); -- Máquina de Solda na Tarefa 4 (Compressor)

-- 7. RELATÓRIOS (Prestação de contas das tarefas pelos técnicos)
INSERT INTO relatorios (tarefa_id, usuario_id, resultado, observacoes) VALUES
(
  1,
  1,
  'Aprovado',
  'Esteira lubrificada, rolamentos revisados e alinhamento concluído com sucesso. Pronta para operar.'
),
(
  2,
  2,
  'Com Ressalvas',
  'Motor com aquecimento ligeiramente acima da média na fase B. Recomendada nova medição em 48h.'
),
(
  4,
  1,
  'Aprovado',
  'Compressor com nova vedação instalada. Pressão estabilizada em 8.5 bar, teste de carga realizado.'
);
