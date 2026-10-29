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

INSERT INTO tarefas (titulo, descricao, status, prazo, tempo_estimado) VALUES
('Manutenção da esteira',
    'Verificar o funcionamento e realizar a manutenção preventiva da esteira transportadora.',
    'Pendente',
    '2026-11-02 14:00:00',
    120),
(
    'Inspeção do motor',
    'Inspecionar o motor industrial e verificar possíveis sinais de desgaste.',
    'Em andamento',
    '2026-11-01 16:00:00',
    90
),
(
    'Lubrificação das máquinas',
    'Realizar a lubrificação dos componentes móveis das máquinas da fábrica.',
    'Pendente',
    '2026-11-04 10:00:00',
    60
),
(
    'Reparo do compressor',
    'Identificar a causa da falha no compressor de ar e executar os reparos necessários.',
    'Em andamento',
    '2026-10-30 12:00:00',
    180
);

INSERT INTO equipamentos (nome, marca, funcao, estado)
VALUES
('Chave de Impacto', 'Bosch', 'Apertar e soltar parafusos industriais', 'Pronto'),
('Multímetro Digital', 'Fluke', 'Medir tensão, corrente e resistência elétrica', 'Pronto'),
('Soldadora Industrial', 'ESAB', 'Realizar soldagem de peças metálicas', 'Em uso'),
('Esmerilhadeira Angular', 'Makita', 'Cortar e desbastar peças metálicas', 'Pronto'),
('Macaco Hidráulico', 'Bovenau', 'Elevar máquinas e componentes pesados', 'Quebrado');