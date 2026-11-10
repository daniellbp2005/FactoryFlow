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
  const sql = 'INSERT INTO tarefas (codigo, titulo, descricao, setor, prioridade, status, periodo, turno_prazo, prazo, tempo_estimado, iniciado_em, finalizado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const valores = [produto.codigo, produto.titulo, produto.descricao, produto.setor, produto.prioridade, produto.status, produto.periodo, produto.turno_prazo, produto.prazo, produto.tempo_estimado, produto.iniciado_em, produto.finalizado_em];
  const [resultado] = await pool.query(sql, valores);
  return { ...produto, id: resultado.insertId};
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