import * as dbModule from '../config/database.js'
import Maquina from "../models/Maquinas.js"

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

function hidratarMaquina(linha) {
  if (!linha) return null;
  return new Maquina(linha);
}

// 1. Listagem com paginação parametrizada e operador atribuído
export async function listar({ limite, offset }) {
  const limiteNum = Number.parseInt(limite, 10);
  const offsetNum = Number.parseInt(offset, 10);

  let linhas;
  try {
    const [rows] = await pool.query(
      `SELECT 
         m.id, 
         m.nome, 
         m.estado, 
         m.usuario_id, 
         u.nome AS operador_nome, 
         u.turno AS operador_turno
       FROM maquinas m
       LEFT JOIN usuarios u ON m.usuario_id = u.id
       ORDER BY m.id LIMIT ? OFFSET ?`,
      [limiteNum, offsetNum]
    );
    linhas = rows;
  } catch (error) {
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      const [rows] = await pool.query(
        'SELECT * FROM maquinas ORDER BY id LIMIT ? OFFSET ?',
        [limiteNum, offsetNum]
      );
      linhas = rows;
    } else {
      throw error;
    }
  }

  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM maquinas');

  return {
    produtos: linhas.map(hidratarMaquina),
    total: Number(total)
  };
}

export async function buscarPorId(id) {
  let linhas;
  try {
    const [rows] = await pool.query(
      `SELECT 
         m.id, 
         m.nome, 
         m.estado, 
         m.usuario_id, 
         u.nome AS operador_nome, 
         u.turno AS operador_turno
       FROM maquinas m
       LEFT JOIN usuarios u ON m.usuario_id = u.id
       WHERE m.id = ?`,
      [id]
    );
    linhas = rows;
  } catch (error) {
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      const [rows] = await pool.query('SELECT * FROM maquinas WHERE id = ?', [id]);
      linhas = rows;
    } else {
      throw error;
    }
  }
  if (linhas.length === 0) return null;
  return hidratarMaquina(linhas[0]);
}

export async function criar(produto) {
  try {
    const sql = 'INSERT INTO maquinas (nome, estado, usuario_id) VALUES (?, ?, ?)';
    const valores = [produto.nome, produto.estado, produto.usuario_id || null];
    const [resultado] = await pool.query(sql, valores);
    return { ...produto, id: resultado.insertId };
  } catch (error) {
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      const sql = 'INSERT INTO maquinas (nome, estado) VALUES (?, ?)';
      const valores = [produto.nome, produto.estado];
      const [resultado] = await pool.query(sql, valores);
      return { ...produto, id: resultado.insertId };
    }
    throw error;
  }
}

export async function atualizar(id, produto) {
  try {
    const sql = 'UPDATE maquinas SET nome = ?, estado = ?, usuario_id = ? WHERE id = ?';
    const valores = [produto.nome, produto.estado, produto.usuario_id || null, id];
    const [resultado] = await pool.query(sql, valores);
    return resultado.affectedRows > 0;
  } catch (error) {
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      const sql = 'UPDATE maquinas SET nome = ?, estado = ? WHERE id = ?';
      const valores = [produto.nome, produto.estado, id];
      const [resultado] = await pool.query(sql, valores);
      return resultado.affectedRows > 0;
    }
    throw error;
  }
}

export async function excluir(id) {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    // Preserva os relatórios históricos e remove apenas a referência à máquina excluída.
    await conexao.query(
      'UPDATE relatorios SET maquina_id = NULL WHERE maquina_id = ?',
      [id]
    );

    const [resultado] = await conexao.query(
      'DELETE FROM maquinas WHERE id = ?',
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
