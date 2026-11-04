import * as dbModule from '../config/database.js';

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

// 1. Listagem com paginação e JOIN de tarefas, usuários e máquinas
export async function listar({ limite, offset }) {
  const limiteNum = Number.parseInt(limite, 10);
  const offsetNum = Number.parseInt(offset, 10);

  const [linhas] = await pool.query(
    `SELECT
      r.id,
      r.resultado,
      r.observacoes,
      r.criado_em,

      t.id AS tarefa_id,
      t.titulo AS tarefa_titulo,
      t.status AS tarefa_status,
      
      u.id AS usuario_id,
      u.nome AS usuario_nome,
      u.cargo AS usuario_cargo,

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
    resultado: linha.resultado,
    observacoes: linha.observacoes,
    criado_em: linha.criado_em,
    tarefa: {
      id: linha.tarefa_id,
      titulo: linha.tarefa_titulo,
      status: linha.tarefa_status,
    },
    usuario: {
      id: linha.usuario_id,
      nome: linha.usuario_nome,
      cargo: linha.usuario_cargo,
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
      r.resultado,
      r.observacoes,
      r.criado_em,

      t.id AS tarefa_id,
      t.titulo AS tarefa_titulo,
      t.descricao AS tarefa_descricao,
      t.status AS tarefa_status,

      u.id AS usuario_id,
      u.nome AS usuario_nome,
      u.cargo AS usuario_cargo,
      u.email AS usuario_email,

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
    resultado: item.resultado,
    observacoes: item.observacoes,
    criado_em: item.criado_em,
    tarefa: {
      id: item.tarefa_id,
      titulo: item.tarefa_titulo,
      descricao: item.tarefa_descricao,
      status: item.tarefa_status,
    },
    usuario: {
      id: item.usuario_id,
      nome: item.usuario_nome,
      cargo: item.usuario_cargo,
      email: item.usuario_email,
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

// 3. Verifica se o usuário está escalado na tarefa (tarefas_usuarios)
export async function verificarVinculoUsuarioTarefa(tarefaId, usuarioId) {
  const [linhas] = await pool.query(
    'SELECT 1 FROM tarefas_usuarios WHERE tarefa_id = ? AND usuario_id = ?',
    [tarefaId, usuarioId]
  );
  return linhas.length > 0;
}

// 4. Verifica se já existe relatório para este par (tarefa_id, usuario_id)
export async function buscarPorTarefaEUsuario(tarefaId, usuarioId) {
  const [linhas] = await pool.query(
    'SELECT id FROM relatorios WHERE tarefa_id = ? AND usuario_id = ?',
    [tarefaId, usuarioId]
  );
  return linhas[0] || null;
}

// 5. Inserir novo relatório com maquina_id
export async function criar(relatorio) {
  const sql = `
    INSERT INTO relatorios (tarefa_id, usuario_id, maquina_id, resultado, observacoes)
    VALUES (?, ?, ?, ?, ?)
  `;
  const valores = [
    relatorio.tarefa_id,
    relatorio.usuario_id,
    relatorio.maquina_id || null,
    relatorio.resultado,
    relatorio.observacoes,
  ];

  const [resultado] = await pool.query(sql, valores);
  // Retorna o relatório completo já com a máquina preenchida
  return buscarPorId(resultado.insertId);
}

// 6. Atualizar resultado, observações e opcionalmente maquina_id
export async function atualizar(id, { resultado, observacoes, maquina_id }) {
  const sql = `
    UPDATE relatorios 
    SET resultado = ?, observacoes = ?, maquina_id = COALESCE(?, maquina_id) 
    WHERE id = ?
  `;
  const [resultadoQuery] = await pool.query(sql, [resultado, observacoes, maquina_id || null, id]);
  return resultadoQuery.affectedRows > 0;
}

// 7. Excluir relatório por ID
export async function excluir(id) {
  const [resultado] = await pool.query('DELETE FROM relatorios WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}
