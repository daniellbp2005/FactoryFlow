import * as dbModule from '../config/database.js';

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

export async function buscarPorEmail(email) {
  const [linhas] = await pool.query(
    'SELECT id, nome, cpf, cargo, email , senha, perfil, criado_em FROM usuarios WHERE email = ?',
    [email]
  );
  return linhas[0] || null;
}

export async function criar({ nome, cpf, cargo , email, senha, perfil = 'funcionario'}) {
  const sql = 'INSERT INTO usuarios (nome, cpf, cargo, email , senha, perfil) VALUES ( ?, ?, ?, ?, ?, ?)';
  const [resultado] = await pool.query(sql, [nome, cpf, cargo, email, senha, perfil]);
  return {
    id: resultado.insertId,
    nome,
    cpf,
    cargo,
    email,
    senha,
    perfil
  };
}
