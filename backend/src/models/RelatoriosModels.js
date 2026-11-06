import * as dbModule from '../config/database.js';

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

// 1. Listagem com paginação e JOIN de tarefas, usuários e máquinas
export async function listar({ limite, offset }) {
  const limiteNum = Number.parseInt(limite, 10);
  const offsetNum = Number.parseInt(offset, 10);

  const [linhas] = await pool.query(
    `SELECT
      r.id,
      r.codigo,
      r.categoria,
      r.status,
      r.motivo,
      r.finalidade,
      r.resultado,
      r.observacoes,
      r.criado_em,

      t.id AS tarefa_id,
      t.codigo AS tarefa_codigo,
      t.titulo AS tarefa_titulo,
      t.status AS tarefa_status,
      t.setor AS tarefa_setor,    
      t.prazo AS tarefa_prazo,    
      t.tempo_estimado AS tarefa_tempo,
      t.iniciado_em AS tarefa_iniciada,
      t.finalizado_em AS tarefa_finalizada,
      t.prioridade AS tarefa_prioridade,
      t.periodo AS tarefa_periodo,
      
      u.id AS usuario_id,
      u.codigo AS usuario_codigo,
      u.nome AS usuario_nome,
      u.cargo AS usuario_cargo,
      u.ativo AS usuario_ativo,
      u.turno AS usuario_turno,
      u.criado_em AS usuario_criado,

      m.id AS maquina_id,
      m.nome AS maquina_nome,
      m.estado AS maquina_estado
    FROM relatorios r
    LEFT JOIN tarefas t ON r.tarefa_id = t.id
    LEFT JOIN usuarios u ON r.usuario_id = u.id
    LEFT JOIN maquinas m ON r.maquina_id = m.id
    ORDER BY r.id DESC
    LIMIT ? OFFSET ?`,
    [limiteNum, offsetNum]
  );

  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM relatorios');

  const relatorios = linhas.map((linha) => ({
    id: linha.id,
    codigo: linha.codigo,
    categoria: linha.categoria,
    status: linha.status,
    motivo: linha.motivo,
    finalidade: linha.finalidade,
    resultado: linha.resultado,
    observacoes: linha.observacoes,
    criado_em: linha.criado_em,
    tarefa: {
      id: linha.tarefa_id,
      codigo: linha.tarefa_codigo,
      titulo: linha.tarefa_titulo,
      setor: linha.tarefa_setor,
      prazo: linha.tarefa_prazo,
      tempo_estimado: linha.tarefa_tempo,
      iniciado_em: linha.tarefa_iniciada,
      finalizado_em: linha.tarefa_finalizada,
      prioridade: linha.tarefa_prioridade,
      periodo: linha.tarefa_periodo,
      status: linha.tarefa_status,
    },
    usuario: {
      id: linha.usuario_id,
      codigo: linha.usuario_codigo,
      nome: linha.usuario_nome,
      cargo: linha.usuario_cargo,
      ativo: Boolean(linha.usuario_ativo),
      turno: linha.usuario_turno,
      criado_em: linha.usuario_criado,
    },
    maquina: linha.maquina_id
      ? {
          id: linha.maquina_id,
          nome: linha.maquina_nome,
          estado: linha.maquina_estado,
        }
      : null,
  }));

  return {
    relatorios,
    total: Number(total),
  };
}

// 2. Buscar por ID trazendo tarefa, usuário, máquina e equipamentos da intermediária
export async function buscarPorId(id) {
  const sqlRelatorio = `
    SELECT
      r.id,
      r.codigo,
      r.categoria,
      r.status,
      r.motivo,
      r.finalidade,
      r.resultado,
      r.observacoes,
      r.criado_em,

      t.id AS tarefa_id,
      t.codigo AS tarefa_codigo,
      t.titulo AS tarefa_titulo,
      t.status AS tarefa_status,
      t.descricao AS tarefa_descricao,
      t.setor AS tarefa_setor,    
      t.prazo AS tarefa_prazo,    
      t.tempo_estimado AS tarefa_tempo,
      t.iniciado_em AS tarefa_iniciada,
      t.finalizado_em AS tarefa_finalizada,
      t.prioridade AS tarefa_prioridade,
      t.periodo AS tarefa_periodo,
      
      u.id AS usuario_id,
      u.codigo AS usuario_codigo,
      u.nome AS usuario_nome,
      u.cargo AS usuario_cargo,
      u.email AS usuario_email,
      u.ativo AS usuario_ativo,
      u.turno AS usuario_turno,
      u.criado_em AS usuario_criado,

      m.id AS maquina_id,
      m.nome AS maquina_nome,
      m.estado AS maquina_estado
    FROM relatorios r
    LEFT JOIN tarefas t ON r.tarefa_id = t.id
    LEFT JOIN usuarios u ON r.usuario_id = u.id
    LEFT JOIN maquinas m ON r.maquina_id = m.id
    WHERE r.id = ?
  `;
  const [linhas] = await pool.query(sqlRelatorio, [id]);
  if (linhas.length === 0) return null;

  const item = linhas[0];

  // Consulta à tabela intermediária tarefas_equipamentos
  const sqlEquipamentos = `
    SELECT 
      e.id,
      e.nome,
      e.marca,
      e.funcao,
      e.estado
    FROM tarefas_equipamentos te
    JOIN equipamentos e ON te.equipamento_id = e.id
    WHERE te.tarefa_id = ?
  `;
  const [equipamentos] = await pool.query(sqlEquipamentos, [item.tarefa_id]);

  return {
    id: item.id,
    codigo: item.codigo,
    categoria: item.categoria,
    status: item.status,
    motivo: item.motivo,
    finalidade: item.finalidade,
    resultado: item.resultado,
    observacoes: item.observacoes,
    criado_em: item.criado_em,
    tarefa: {
      id: item.tarefa_id,
      codigo: item.tarefa_codigo,
      titulo: item.tarefa_titulo,
      descricao: item.tarefa_descricao,
      setor: item.tarefa_setor,
      prazo: item.tarefa_prazo,
      tempo_estimado: item.tarefa_tempo,
      iniciado_em: item.tarefa_iniciada,
      finalizado_em: item.tarefa_finalizada,
      prioridade: item.tarefa_prioridade,
      periodo: item.tarefa_periodo,
      status: item.tarefa_status,
    },
    usuario: {
      id: item.usuario_id,
      codigo: item.usuario_codigo,
      nome: item.usuario_nome,
      cargo: item.usuario_cargo,
      email: item.usuario_email,
      ativo: Boolean(item.usuario_ativo),
      turno: item.usuario_turno,
      criado_em: item.usuario_criado, 
    },
    maquina: item.maquina_id
      ? {
          id: item.maquina_id,
          nome: item.maquina_nome,
          estado: item.maquina_estado,
        }
      : null,
    equipamentosUtilizados: equipamentos,
  };
}

// Verifica se o usuário está escalado na tarefa (tarefas_usuarios)
export async function verificarVinculoUsuarioTarefa(tarefaId, usuarioId) {
  const [linhas] = await pool.query(
    'SELECT 1 FROM tarefas_usuarios WHERE tarefa_id = ? AND usuario_id = ?',
    [tarefaId, usuarioId]
  );
  return linhas.length > 0;
}

// Verifica se já existe relatório para este par (tarefa_id, usuario_id)
export async function buscarPorTarefaEUsuario(tarefaId, usuarioId) {
  const [linhas] = await pool.query(
    'SELECT id FROM relatorios WHERE tarefa_id = ? AND usuario_id = ?',
    [tarefaId, usuarioId]
  );
  return linhas[0] || null;
}

export async function criar(relatorio) {
  // Gera código único caso não venha no objeto (ex: REL-2026-9876)
  const codigo = relatorio.codigo || `REL-2026-${String(Date.now()).slice(-4)}`;
  const categoria = relatorio.categoria || 'Manutenção';
  const status = relatorio.status || 'Concluído';

  const sql = `
    INSERT INTO relatorios (
      codigo,
      tarefa_id,
      usuario_id,
      maquina_id,
      categoria,
      status,
      motivo,
      finalidade,
      resultado,
      observacoes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const valores = [
    codigo,
    relatorio.tarefa_id,
    relatorio.usuario_id,
    relatorio.maquina_id || null,
    categoria,
    status,
    relatorio.motivo || null,
    relatorio.finalidade || null,
    relatorio.resultado,
    relatorio.observacoes || null,
  ];

  const [resultado] = await pool.query(sql, valores);
  return buscarPorId(resultado.insertId);
}

export async function atualizar(id, dados) {
  const sql = `
    UPDATE relatorios 
    SET 
      codigo = COALESCE(?, codigo),
      categoria = COALESCE(?, categoria),
      status = COALESCE(?, status),
      resultado = COALESCE(?, resultado),
      finalidade = COALESCE(?, finalidade),
      observacoes = COALESCE(?, observacoes),
      motivo = COALESCE(?, motivo),
      maquina_id = COALESCE(?, maquina_id) 
    WHERE id = ?
  `;
  const valores = [
    dados.codigo || null,
    dados.categoria || null,
    dados.status || null,
    dados.resultado || null,
    dados.finalidade || null,
    dados.observacoes || null,
    dados.motivo || null,
    dados.maquina_id || null,
    id,
  ];
  const [resultadoQuery] = await pool.query(sql, valores);
  return resultadoQuery.affectedRows > 0;
}

export async function excluir(id) {
  const [resultado] = await pool.query('DELETE FROM relatorios WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}
