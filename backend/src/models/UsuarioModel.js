import * as dbModule from '../config/database.js';

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

function hidratar(linha) {
  if (!linha) return null;
  return { ...linha};
}

export async function buscarPorEmail(email) {
  const [linhas] = await pool.query(
    'SELECT id, codigo, nome, cpf, cargo, turno, ativo, email, senha, perfil, criado_em FROM usuarios WHERE email = ?',
    [email]
  );
  return linhas[0] || null;
}

export async function criar({ codigo, nome, cpf, cargo, turno, email, senha, perfil = "funcionario"}) {
  const sql = 'INSERT INTO usuarios (codigo, nome, cpf, cargo, turno, email, senha, perfil) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)';
  const [resultado] = await pool.query(sql, [codigo, nome, cpf, cargo, turno, email, senha, perfil]);
  return {
    id: resultado.insertId,
    codigo,
    nome,
    cpf,
    cargo,
    turno,
    email,
    senha,
    perfil
  };
}

export async function listar({ limite, offset }) {
  const limiteNum = Number.parseInt(limite, 10);
  const offsetNum = Number.parseInt(offset, 10);

  const [linhas] = await pool.query(
    'SELECT id, nome, email, codigo, cargo, turno, ativo, perfil FROM usuarios ORDER BY id LIMIT ? OFFSET ?',
    [limiteNum, offsetNum]
  );

  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');

  return {
    usuarios: linhas.map(hidratar),
    total: Number(total)
  };
}

export async function buscarPorId(id) {
  const [linhas] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  if (linhas.length === 0) return null;
  return hidratar(linhas[0]);
}

export async function excluir(id) {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    await conexao.query(
      'UPDATE maquinas SET usuario_id = NULL WHERE usuario_id = ?',
      [id]
    );
    await conexao.query(
      'DELETE FROM tarefas_usuarios WHERE usuario_id = ?',
      [id]
    );
    await conexao.query(
      'DELETE FROM relatorios WHERE usuario_id = ?',
      [id]
    );

    const [resultado] = await conexao.query(
      'DELETE FROM usuarios WHERE id = ?',
      [id]
    );

    await conexao.commit();
    return resultado.affectedRows > 0;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}
