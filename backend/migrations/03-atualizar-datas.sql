-- ==============================================================================
-- FACTORYFLOW: ATUALIZAÇÃO DE DATAS E HORÁRIOS PARA TAREFAS E RELATÓRIOS
-- Datas alinhadas com a semana atual (Novembro/2026):
-- - Hoje: 16/11/2026
-- - Amanhã: 17/11/2026
-- - Esta Semana: 18/11/2026, 19/11/2026, 20/11/2026
-- - Atrasada: 14/11/2026
-- Horários completos (início e fim) para evitar "-:- - -:-" na interface
-- ==============================================================================

USE api_flow;

INSERT IGNORE INTO tarefas_usuarios (tarefa_id, usuario_id) VALUES (10, 1);

-- 1. ATUALIZAÇÃO DAS TAREFAS
UPDATE tarefas SET 
  prazo = '2026-11-16 12:00:00',
  iniciado_em = '2026-11-16 08:00:00',
  finalizado_em = '2026-11-16 10:30:00',
  criado_em = '2026-11-16 07:30:00'
WHERE id = 1;

UPDATE tarefas SET 
  prazo = '2026-11-16 14:00:00',
  iniciado_em = '2026-11-16 09:15:00',
  finalizado_em = '2026-11-16 11:45:00',
  criado_em = '2026-11-16 08:00:00'
WHERE id = 2;

UPDATE tarefas SET 
  prazo = '2026-11-16 17:00:00',
  iniciado_em = '2026-11-16 13:00:00',
  finalizado_em = '2026-11-16 16:30:00',
  criado_em = '2026-11-16 08:30:00'
WHERE id = 3;

UPDATE tarefas SET 
  prazo = '2026-11-16 18:00:00',
  iniciado_em = '2026-11-16 14:00:00',
  finalizado_em = '2026-11-16 17:15:00',
  criado_em = '2026-11-16 09:00:00'
WHERE id = 4;

UPDATE tarefas SET 
  prazo = '2026-11-17 12:30:00',
  iniciado_em = '2026-11-17 08:30:00',
  finalizado_em = '2026-11-17 12:00:00',
  criado_em = '2026-11-16 10:00:00'
WHERE id = 5;

UPDATE tarefas SET 
  prazo = '2026-11-17 17:30:00',
  iniciado_em = '2026-11-17 13:30:00',
  finalizado_em = '2026-11-17 17:00:00',
  criado_em = '2026-11-16 10:30:00'
WHERE id = 6;

UPDATE tarefas SET 
  prazo = '2026-11-18 12:00:00',
  iniciado_em = '2026-11-18 09:00:00',
  finalizado_em = '2026-11-18 11:30:00',
  criado_em = '2026-11-16 11:00:00'
WHERE id = 7;

UPDATE tarefas SET 
  prazo = '2026-11-19 17:00:00',
  iniciado_em = '2026-11-19 14:00:00',
  finalizado_em = '2026-11-19 16:45:00',
  criado_em = '2026-11-16 11:30:00'
WHERE id = 8;

UPDATE tarefas SET 
  prazo = '2026-11-20 12:00:00',
  iniciado_em = '2026-11-20 08:00:00',
  finalizado_em = '2026-11-20 11:15:00',
  criado_em = '2026-11-16 13:00:00'
WHERE id = 9;

UPDATE tarefas SET 
  prazo = '2026-11-14 11:00:00',
  iniciado_em = '2026-11-14 10:00:00',
  finalizado_em = '2026-11-14 12:30:00',
  criado_em = '2026-11-13 14:00:00'
WHERE id = 10;

-- 2. ATUALIZAÇÃO DOS RELATÓRIOS
UPDATE relatorios SET criado_em = '2026-11-16 10:35:00' WHERE id = 1;
UPDATE relatorios SET criado_em = '2026-11-16 11:50:00' WHERE id = 2;
UPDATE relatorios SET criado_em = '2026-11-16 16:35:00' WHERE id = 3;
UPDATE relatorios SET criado_em = '2026-11-16 17:20:00' WHERE id = 4;
UPDATE relatorios SET criado_em = '2026-11-17 12:05:00' WHERE id = 5;
UPDATE relatorios SET criado_em = '2026-11-17 17:05:00' WHERE id = 6;
UPDATE relatorios SET criado_em = '2026-11-18 11:35:00' WHERE id = 7;
UPDATE relatorios SET criado_em = '2026-11-19 16:50:00' WHERE id = 8;
UPDATE relatorios SET criado_em = '2026-11-20 11:20:00' WHERE id = 9;
UPDATE relatorios SET criado_em = '2026-11-14 12:35:00' WHERE id = 10;
