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

export async function buscarPorId(id) {
  const [linhas] = await pool.query('SELECT * FROM tarefas WHERE id = ?', [id]);
  if (linhas.length === 0) return null;
  return hidratarMaquina(linhas[0]);
}

export async function criar(produto) {
  const sql = 'INSERT INTO tarefas (titulo, descricao, status, prazo, tempo_estimado) VALUES ( ?, ?, ?, ?, ?)';
  const valores = [produto.titulo, produto.descricao, produto.status, produto.prazo, produto.tempo_estimido];
  const [resultado] = await pool.query(sql, valores);
  return { ...produto, id: resultado.insertId};
}

export async function atualizar(id, produto) {
  const sql = 
  `UPDATE tarefas SET 
    titulo = ?, 
    descricao = ?, 
    status = ?, 
    prazo = ?, 
    tempo_estimado = ?
    WHERE id = ?`;

  const valores = [produto.titulo, produto.descricao, produto.status, produto.prazo, produto.tempo_estimado, id];
  const [resultado] = await pool.query(sql, valores);
  return resultado.affectedRows > 0;
}

export async function excluir(id) {
  const [resultado] = await pool.query('DELETE FROM tarefas WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}