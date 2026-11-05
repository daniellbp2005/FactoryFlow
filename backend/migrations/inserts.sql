-- ==============================================================================
-- FACTORYFLOW: INSERTS DE TESTE (10 REGISTROS POR TABELA)
-- Estrutura alinhada ao novo schema de banco de dados (banco.sql)
--
-- Ordem de execução respeitando as Chaves Estrangeiras (FK):
-- 1. maquinas (10 registros)
-- 2. usuarios (10 registros - necessários para as FKs de tarefas e relatórios)
-- 3. tarefas (10 ordens de produção com código, setor, prioridade, prazos)
-- 4. equipamentos (10 ferramentas e dispositivos de apoio)
-- 5. tarefas_usuarios (tabela intermediária N:N)
-- 6. tarefas_equipamentos (tabela intermediária N:N)
-- 7. relatorios (10 relatórios com código, categoria, status, motivo e finalidade)
-- ==============================================================================

USE api_flow;

-- ==============================================================================
-- 1. MÁQUINAS (10 registros)
-- ==============================================================================
INSERT INTO maquinas (id, nome, estado) VALUES
(1,  'Torno CNC 01',                  'Disponível'),
(2,  'Fresadora Industrial 01',       'Em Operação'),
(3,  'Prensa Hidráulica 01',          'Inativa'),
(4,  'Esteira Transportadora 01',     'Em Operação'),
(5,  'Robô de Solda Kuka 01',         'Disponível'),
(6,  'Compressor de Ar Parafuso 01',  'Em Manutenção'),
(7,  'Furadeira Radial de Coluna 01', 'Disponível'),
(8,  'Centro de Usinagem 5 Eixos 01', 'Em Operação'),
(9,  'Retífica Cilíndrica 01',        'Em Manutenção'),
(10, 'Injetora Termoplástica 01',     'Inativa');

-- ==============================================================================
-- 2. USUÁRIOS (10 registros)
-- Obs: A senha para todos é 'Senha_teste_123' (hash bcrypt válido)
-- ==============================================================================
INSERT INTO usuarios (id, codigo, nome, cpf, cargo, turno, ativo, email, senha, perfil) VALUES
(1,  'FUNC-001', 'Carlos Silva',        '111.222.333-44', 'Mecânico de Manutenção',   'Manhã',         TRUE,  'carlos.silva@factoryflow.com',    '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario'),
(2,  'FUNC-002', 'Ana Paula Costa',     '222.333.444-55', 'Eletricista Industrial',    'Tarde',         TRUE,  'ana.costa@factoryflow.com',       '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario'),
(3,  'FUNC-003', 'Bruno Lima Santos',   '333.444.555-66', 'Operador de CNC',           'Noite',         TRUE,  'bruno.lima@factoryflow.com',      '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario'),
(4,  'FUNC-004', 'Mariana Alencar',     '444.555.666-77', 'Supervisora de Produção',   'Administrativo', TRUE,  'mariana.alencar@factoryflow.com', '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'administrador'),
(5,  'FUNC-005', 'Carla Souza Mendes',  '555.666.777-88', 'Operadora de Fresadora',    'Manhã',         TRUE,  'carla.souza@factoryflow.com',     '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario'),
(6,  'FUNC-006', 'Diego Rocha Barbosa', '666.777.888-99', 'Soldador TIG/MIG',          'Tarde',         TRUE,  'diego.rocha@factoryflow.com',     '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario'),
(7,  'FUNC-007', 'Fernanda Guimarães',  '777.888.999-00', 'Inspetora de Qualidade',    'Manhã',         TRUE,  'fernanda.g@factoryflow.com',      '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario'),
(8,  'FUNC-008', 'Lucas Gabriel Dias',  '888.999.000-11', 'Técnico em Automação',      'Noite',         TRUE,  'lucas.dias@factoryflow.com',      '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario'),
(9,  'FUNC-009', 'Juliana Torres Paz',  '999.000.111-22', 'Engenheira de Processos',   'Administrativo', TRUE,  'juliana.torres@factoryflow.com',  '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'administrador'),
(10, 'FUNC-010', 'Roberto Nogueira',    '000.111.222-33', 'Auxiliar de Produção',      'Manhã',         FALSE, 'roberto.n@factoryflow.com',       '$2b$10$2NM4.Mm8UAUWe0exvppUJes6YOnpoZWNZ7ly7lyFQooj7mieNtTUS', 'funcionario');

-- ==============================================================================
-- 3. TAREFAS (10 registros com códigos de OS e dados completos de produção)
-- ==============================================================================
INSERT INTO tarefas (id, codigo, titulo, descricao, setor, prioridade, status, periodo, turno_prazo, prazo, tempo_estimado, iniciado_em, finalizado_em, criado_em) VALUES
(
  1,
  'OP-2847',
  'Usinagem de Eixo de Transmissão',
  'Realizar usinagem cilíndrica de alta precisão em aço temperado conforme desenho técnico.',
  'Usinagem',
  'Alta',
  'Em Andamento',
  'Dia',
  'Manhã',
  '2026-11-05 12:00:00',
  2.50,
  '2026-11-05 08:15:00',
  NULL,
  '2026-11-05 07:30:00'
),
(
  2,
  'OP-2848',
  'Inspeção do Motor de Avanço',
  'Verificar ruídos anormais, vibração excessiva e corrente de consumo no motor elétrico.',
  'Manutenção',
  'Alta',
  'Em Andamento',
  'Dia',
  'Tarde',
  '2026-11-05 16:30:00',
  1.50,
  '2026-11-05 13:00:00',
  NULL,
  '2026-11-05 08:00:00'
),
(
  3,
  'OP-2849',
  'Manutenção Preventiva da Esteira',
  'Trocar correia de tração, alinhar roletes de guia e lubrificar mancais centrais.',
  'Montagem',
  'Média',
  'Concluída',
  'Semana',
  'Manhã',
  '2026-11-04 11:30:00',
  3.00,
  '2026-11-04 08:00:00',
  '2026-11-04 11:10:00',
  '2026-11-03 14:00:00'
),
(
  4,
  'OP-2850',
  'Reparo de Vedações do Compressor',
  'Substituir anéis de vedação tóricos e junta de cabeçote com vazamento de ar comprimido.',
  'Manutenção',
  'Alta',
  'Concluída',
  'Semana',
  'Tarde',
  '2026-11-03 17:00:00',
  2.00,
  '2026-11-03 14:30:00',
  '2026-11-03 16:45:00',
  '2026-11-03 09:00:00'
),
(
  5,
  'OP-2851',
  'Soldagem de Chassi Estrutural',
  'Soldagem robotizada de cantoneiras e travessas tubulares do chassi da cabine.',
  'Solda',
  'Alta',
  'Pendente',
  'Semana',
  'Noite',
  '2026-11-06 22:00:00',
  4.00,
  NULL,
  NULL,
  '2026-11-05 08:30:00'
),
(
  6,
  'OP-2852',
  'Fresagem de Bloco Hidráulico',
  'Usinar canais de lubrificação e sedes de válvulas na fresadora industrial.',
  'Usinagem',
  'Média',
  'Pendente',
  'Semana',
  'Manhã',
  '2026-11-07 10:00:00',
  3.50,
  NULL,
  NULL,
  '2026-11-05 08:45:00'
),
(
  7,
  'OP-2853',
  'Controle Dimensional de Lote 42',
  'Verificar rugosidade superficial e tolerâncias micrométricas das peças finalizadas.',
  'Qualidade',
  'Alta',
  'Pendente',
  'Dia',
  'Tarde',
  '2026-11-05 17:00:00',
  1.00,
  NULL,
  NULL,
  '2026-11-05 09:00:00'
),
(
  8,
  'OP-2854',
  'Calibração de Sensores de Pressão',
  'Ajustar transdutores de 4-20mA no painel de comando pneumático.',
  'Automação',
  'Baixa',
  'Pausada',
  'Mês',
  'Indefinido',
  '2026-11-15 18:00:00',
  2.00,
  '2026-11-04 15:00:00',
  NULL,
  '2026-11-02 10:00:00'
),
(
  9,
  'OP-2855',
  'Pintura Eletrostática de Painéis',
  'Aplicação de tinta a pó epóxi cinza RAL 7035 e cura em estufa a 200°C.',
  'Pintura',
  'Média',
  'Pendente',
  'Semana',
  'Tarde',
  '2026-11-08 16:00:00',
  5.00,
  NULL,
  NULL,
  '2026-11-05 09:15:00'
),
(
  10,
  'OP-2856',
  'Inspeção da Prensa Hidráulica',
  'Checagem de vazamento no pistão de 200 toneladas e análise química do óleo mineral.',
  'Manutenção',
  'Alta',
  'Cancelada',
  'Mês',
  'Dia',
  '2026-11-02 11:00:00',
  2.00,
  NULL,
  NULL,
  '2026-11-01 08:00:00'
);

-- ==============================================================================
-- 4. EQUIPAMENTOS (10 registros de ferramentas e instrumentos de apoio)
-- ==============================================================================
INSERT INTO equipamentos (id, nome, marca, funcao, estado) VALUES
(1,  'Chave de Impacto Pneumática 1/2pol', 'Bosch Industrial',   'Aperto e torque de parafusos pesados',          'Pronto'),
(2,  'Multímetro Digital True RMS',        'Fluke',              'Medição de grandezas e circuitos elétricos',    'Pronto'),
(3,  'Máquina de Solda MIG/MAG 400A',      'ESAB',               'Soldagem de chapas e conjuntos metálicos',      'Em uso'),
(4,  'Esmerilhadeira Angular 7pol',        'Makita',             'Corte e desbaste de metais ferrosos',           'Pronto'),
(5,  'Macaco Hidráulico Garrafa 15t',      'Bovenau',            'Elevação e nivelamento de bases de máquinas',   'Pronto'),
(6,  'Torquímetro de Estalo 40-200Nm',     'Gedore',             'Aperto calibrado de parafusos estruturais',     'Pronto'),
(7,  'Micrômetro Externo 0-25mm 0.001mm',  'Mitutoyo',           'Medição de diâmetros de alta precisão',         'Pronto'),
(8,  'Termovisor Infravermelho Flir E5',   'FLIR Systems',       'Análise térmica preventiva de barramentos',     'Em uso'),
(9,  'Bomba Manual de Engraxar Alta Pressão','Boza',             'Lubrificação forçada de mancais de rolamentos', 'Pronto'),
(10, 'Osciloscópio Digital 2 Canais 100MHz','Tektronix',         'Diagnóstico de formas de onda e encoders',      'Em Manutenção');

-- ==============================================================================
-- 5. TAREFAS_USUARIOS (Tabela intermediária N:N)
-- ==============================================================================
INSERT INTO tarefas_usuarios (tarefa_id, usuario_id) VALUES
(1, 3),  -- Bruno Lima na Usinagem de Eixo (OP-2847)
(2, 2),  -- Ana Paula Costa na Inspeção de Motor (OP-2848)
(3, 1),  -- Carlos Silva na Manutenção da Esteira (OP-2849)
(3, 5),  -- Carla Souza auxiliando na Manutenção da Esteira (OP-2849)
(4, 1),  -- Carlos Silva no Reparo do Compressor (OP-2850)
(5, 6),  -- Diego Rocha na Soldagem do Chassi (OP-2851)
(6, 5),  -- Carla Souza na Fresagem de Bloco (OP-2852)
(7, 7),  -- Fernanda Guimarães no Controle Dimensional (OP-2853)
(8, 8),  -- Lucas Gabriel na Calibração de Sensores (OP-2854)
(9, 10); -- Roberto Nogueira na Pintura de Painéis (OP-2855)

-- ==============================================================================
-- 6. TAREFAS_EQUIPAMENTOS (Tabela intermediária N:N)
-- ==============================================================================
INSERT INTO tarefas_equipamentos (tarefa_id, equipamento_id) VALUES
(1, 7),  -- Micrômetro Mitutoyo na Usinagem (OP-2847)
(2, 2),  -- Multímetro Fluke na Inspeção do Motor (OP-2848)
(2, 8),  -- Termovisor FLIR na Inspeção do Motor (OP-2848)
(3, 1),  -- Chave de Impacto na Esteira (OP-2849)
(3, 9),  -- Bomba de Engraxar na Esteira (OP-2849)
(4, 1),  -- Chave de Impacto no Compressor (OP-2850)
(4, 6),  -- Torquímetro Gedore no Compressor (OP-2850)
(5, 3),  -- Máquina de Solda ESAB no Chassi (OP-2851)
(6, 7),  -- Micrômetro na Fresagem de Bloco (OP-2852)
(7, 7);  -- Micrômetro no Controle Dimensional (OP-2853)

-- ==============================================================================
-- 7. RELATÓRIOS (10 registros com códigos únicos, categorias, status e motivos)
-- ==============================================================================
INSERT INTO relatorios (id, codigo, tarefa_id, usuario_id, maquina_id, categoria, status, motivo, finalidade, resultado, observacoes, criado_em) VALUES
(
  1,
  'REL-2026-001',
  3,
  1,
  4, -- Esteira Transportadora 01
  'Manutenção',
  'Concluído',
  NULL,
  'Manutenção preventiva periódica programada',
  'Aprovado',
  'Esteira alinhada, roletes lubrificados e tensão da correia aferida com sucesso. Liberada para a linha de produção.',
  '2026-11-04 11:20:15'
),
(
  2,
  'REL-2026-002',
  4,
  1,
  6, -- Compressor de Ar Parafuso 01
  'Manutenção',
  'Concluído',
  NULL,
  'Substituição de vedações com vazamento',
  'Aprovado',
  'Vedações do cabeçote trocadas. Pressão estabilizada em 8.8 bar sem quedas após 30 minutos de teste contínuo.',
  '2026-11-03 16:50:30'
),
(
  3,
  'REL-2026-003',
  1,
  3,
  1, -- Torno CNC 01
  'Desempenho',
  'Em andamento',
  NULL,
  'Acompanhamento de tolerância dimensional em lote',
  'Aprovado',
  'Primeira peça do lote com desvio dimensional de apenas 0,003mm, bem abaixo do limite permitido. Operação fluindo perfeitamente.',
  '2026-11-05 09:30:00'
),
(
  4,
  'REL-2026-004',
  2,
  2,
  8, -- Centro de Usinagem 01
  'Ocorrência',
  'Em andamento',
  'Aquecimento anormal do mancal dianteiro do motor',
  'Investigação de sobretemperatura detectada pelo operador',
  'Com Ressalvas',
  'Temperatura medida em 68°C com câmera térmica. Motor liberado em rotação reduzida enquanto aguardamos graxa sintética especial.',
  '2026-11-05 14:15:45'
),
(
  5,
  'REL-2026-005',
  8,
  8,
  2, -- Fresadora Industrial 01
  'Ocorrência',
  'Indisponível',
  'Falta de peças de reposição no almoxarifado',
  'Parada técnica por falta de sensor transdutor reserva',
  'Reprovado',
  'Sensor de 4-20mA danificado por surto de tensão. Peça não disponível no estoque da fábrica; solicitação de compra emergencial nº 849 enviada.',
  '2026-11-04 16:00:20'
),
(
  6,
  'REL-2026-006',
  5,
  6,
  5, -- Robô de Solda Kuka 01
  'Treinamento',
  'Concluído',
  NULL,
  'Capacitação prática em parametrização de trajetórias robotizadas',
  'Aprovado',
  'Operador Diego Rocha concluiu com êxito o treinamento de segurança NR-12 e está habilitado para carregar os novos programas do robô.',
  '2026-11-04 18:00:00'
),
(
  7,
  'REL-2026-007',
  10,
  4,
  3, -- Prensa Hidráulica 01
  'Ocorrência',
  'Pendente',
  'Vazamento severo de óleo hidráulico na haste do pistão',
  'Interdição temporária de segurança da prensa',
  'Reprovado',
  'Prensa interditada por segurança até a chegada da equipe de manutenção especializada do fabricante. Área devidamente isolada e sinalizada.',
  '2026-11-02 11:30:10'
),
(
  8,
  'REL-2026-008',
  7,
  7,
  1, -- Torno CNC 01
  'Desempenho',
  'Pendente',
  NULL,
  'Auditoria e laudo de calibração metrológica',
  'Com Ressalvas',
  'Calibração de ferramentas em conformity, restando apenas teste de repetibilidade com 20 amostras consecutivas.',
  '2026-11-05 10:45:00'
),
(
  9,
  'REL-2026-009',
  6,
  5,
  2, -- Fresadora Industrial 01
  'Treinamento',
  'Concluído',
  NULL,
  'Reciclagem operacional de troca rápida de ferramentas (SMED)',
  'Aprovado',
  'Tempo de setup reduzido de 45 para 18 minutos. Equipe aprovada com menção de excelência pelo supervisor.',
  '2026-11-01 17:15:20'
),
(
  10,
  'REL-2026-010',
  9,
  9,
  10, -- Injetora Termoplástica 01
  'Manutenção',
  'Indisponível',
  'Resistência de aquecimento queimada na zona 3 do canhão',
  'Reparo corretivo elétrico na zona de injeção',
  'Reprovado',
  'Resistência tubular de 2200W aberta. Máquina desenergizada e chaveada com cadeado de bloqueio LOTO.',
  '2026-11-05 08:50:00'
);
