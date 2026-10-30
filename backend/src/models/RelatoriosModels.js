import * as dbModule from '../config/database.js';

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

// 1. Listagem com paginação parametrizada e JOIN de tarefas e usuários
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
      u.cargo AS usuario_cargo
    FROM relatorios r
    LEFT JOIN tarefas t ON r.tarefa_id = t.id
    LEFT JOIN usuarios u ON r.usuario_id = u.id
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
  }));

  return {
    relatorios,
    total: Number(total),
  };
}

// 2. Buscar por ID trazendo tarefa, usuário e equipamentos da tabela intermediária
export async function buscarPorId(id) {
  const sqlRelatorio = `
    SELECT 
      r.id,
      r.resultado,
      r.observacoes,
      r.criado_em,
      r.tarefa_id,
      t.titulo AS tarefa_titulo,
      t.descricao AS tarefa_descricao,
      t.status AS tarefa_status,
      r.usuario_id,
      u.nome AS usuario_nome,
      u.cargo AS usuario_cargo,
      u.email AS usuario_email
    FROM relatorios r
    LEFT JOIN tarefas t ON r.tarefa_id = t.id
    LEFT JOIN usuarios u ON r.usuario_id = u.id
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
    equipamentosUtilizados: equipamentos,
  };
}

// 3. Verifica se o usuário está escalado na tarefa (tabela intermediária tarefas_usuarios)
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

export async function criar(relatorio) {
  const sql = `
    INSERT INTO relatorios (tarefa_id, usuario_id, resultado, observacoes)
    VALUES (?, ?, ?, ?)
  `;
  const valores = [
    relatorio.tarefa_id,
    relatorio.usuario_id,
    relatorio.resultado,
    relatorio.observacoes,
  ];

  const [resultado] = await pool.query(sql, valores);
  return buscarPorId(resultado.insertId);
}

export async function atualizar(id, { resultado, observacoes }) {
  const sql = 'UPDATE relatorios SET resultado = ?, observacoes = ? WHERE id = ?';
  const [resultadoQuery] = await pool.query(sql, [resultado, observacoes, id]);
  return resultadoQuery.affectedRows > 0;
}

export async function excluir(id) {
  const [resultado] = await pool.query('DELETE FROM relatorios WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}
