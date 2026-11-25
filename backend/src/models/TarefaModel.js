import * as dbModule from '../config/database.js'
import Terefa from "../models/Tarefas.js"

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

function hidratarMaquina(linha) {
  if (!linha) return null;
  return new Terefa(linha);
}

// 1. Listagem com paginação parametrizada
export async function listar({ limite, offset }) {
  const limiteNum = Number.parseInt(limite, 10);
  const offsetNum = Number.parseInt(offset, 10);

  const [linhas] = await pool.query(
    'SELECT * FROM tarefas ORDER BY id LIMIT ? OFFSET ?',
    [limiteNum, offsetNum]
  );

  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM tarefas');

  return {
    produtos: linhas.map(hidratarMaquina),
    total: Number(total)
  };
}

export async function listarParaRelatorio(usuarioId, { limite, offset }) {
  const limiteNum = Number.parseInt(limite, 10);
  const offsetNum = Number.parseInt(offset, 10);
  const [linhas] = await pool.query(
    `SELECT t.*
     FROM tarefas t
     INNER JOIN tarefas_usuarios tu ON tu.tarefa_id = t.id
     WHERE tu.usuario_id = ?
       AND t.status NOT IN ('Cancelada', 'Cancelado')
       AND NOT EXISTS (
         SELECT 1
         FROM relatorios r
         WHERE r.tarefa_id = t.id AND r.usuario_id = tu.usuario_id
       )
     ORDER BY t.id DESC
     LIMIT ? OFFSET ?`,
    [usuarioId, limiteNum, offsetNum]
  );
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM tarefas t
     INNER JOIN tarefas_usuarios tu ON tu.tarefa_id = t.id
     WHERE tu.usuario_id = ?
       AND t.status NOT IN ('Cancelada', 'Cancelado')
       AND NOT EXISTS (
         SELECT 1
         FROM relatorios r
         WHERE r.tarefa_id = t.id AND r.usuario_id = tu.usuario_id
       )`,
    [usuarioId]
  );

  return {
    produtos: linhas.map(hidratarMaquina),
    total: Number(total)
  };
}

export async function buscarPorId(id) {
  const [linhas] = await pool.query('SELECT * FROM tarefas WHERE id = ?', [id]);
  if (linhas.length === 0) return null;
  return hidratarMaquina(linhas[0]);
}


export async function criar(produto, emails = [], equipamentos = []) {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    // 1. Localizar os funcionários pelos e-mails
    let usuarios = [];

    if (emails.length > 0) {
      const [resultadoUsuarios] = await conexao.query(
        'SELECT id, email FROM usuarios WHERE email IN (?) AND ativo = 1',
        [emails]
      );

      if (resultadoUsuarios.length !== emails.length) {
        throw new Error('Um ou mais funcionários não foram encontrados ou estão inativos.');
      }

      usuarios = resultadoUsuarios;
    }

    // 2. Verificar se os equipamentos existem
    let equipamentosEncontrados = [];

    if (equipamentos.length > 0) {
      const [resultadoEquipamentos] = await conexao.query(
        'SELECT id FROM equipamentos WHERE id IN (?)',
        [equipamentos]
      );

      if (resultadoEquipamentos.length !== equipamentos.length) {
        throw new Error('Um ou mais equipamentos não foram encontrados.');
      }

      equipamentosEncontrados = resultadoEquipamentos;
    }

    // 3. Criar a tarefa
    const sql = `
      INSERT INTO tarefas (
        codigo, titulo, descricao, setor, prioridade,
        status, periodo, turno_prazo, prazo,
        tempo_estimado, iniciado_em, finalizado_em
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
      produto.codigo,
      produto.titulo,
      produto.descricao,
      produto.setor,
      produto.prioridade,
      produto.status,
      produto.periodo,
      produto.turno_prazo,
      produto.prazo,
      produto.tempo_estimado,
      produto.iniciado_em || null,
      produto.finalizado_em || null
    ];

    const [resultadoTarefa] = await conexao.query(sql, valores);
    const tarefaId = resultadoTarefa.insertId;

    // 4. Vincular funcionários à tarefa
    for (const usuario of usuarios) {
      await conexao.query(
        'INSERT INTO tarefas_usuarios (tarefa_id, usuario_id) VALUES (?, ?)',
        [tarefaId, usuario.id]
      );
    }

    // 5. Vincular equipamentos auxiliares à tarefa
    for (const equipamento of equipamentosEncontrados) {
      await conexao.query(
        'INSERT INTO tarefas_equipamentos (tarefa_id, equipamento_id) VALUES (?, ?)',
        [tarefaId, equipamento.id]
      );
    }

    // 6. Confirmar todas as operações
    await conexao.commit();

    return { ...produto, id: tarefaId };

  } catch (erro) {
    await conexao.rollback();
    throw erro;

  } finally {
    conexao.release();
  }
}


export async function atualizar(id, produto) {
  const sql = 
  `UPDATE tarefas SET 
    titulo = ?, 
    descricao = ?, 
    status = ?,
    setor = ?,
    prioridade = ?,
    turno_prazo = ?,
    prazo = ?,
    tempo_estimado = ?,
    periodo = ?,
    iniciado_em = ?,
    finalizado_em = ?
    WHERE id = ?`;

  const valores = [produto.titulo, produto.descricao, produto.status, produto.setor, produto.prioridade, produto.turno_prazo, produto.prazo, produto.tempo_estimado, produto.periodo, produto.iniciado_em,produto.finalizado_em, id];
  const [resultado] = await pool.query(sql, valores);
  return resultado.affectedRows > 0;
}

export async function excluir(id) {
  const [resultado] = await pool.query('DELETE FROM tarefas WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}