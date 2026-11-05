import * as dbModule from '../config/database.js';

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

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
    perfil
  };
}
