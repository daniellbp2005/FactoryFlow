import * as dbModule from '../config/database.js'
import Equipamento from "../models/Equipamento.js"

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

function hidratarMaquina(linha) {
  if (!linha) return null;
  return new Equipamento(linha);
}

// 1. Listagem com paginação parametrizada
export async function listar({ limite, offset }) {
  const limiteNum = Number.parseInt(limite, 10);
  const offsetNum = Number.parseInt(offset, 10);

  const [linhas] = await pool.query(
    'SELECT * FROM equipamentos ORDER BY id LIMIT ? OFFSET ?',
    [limiteNum, offsetNum]
  );

  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM equipamentos');

  return {
    produtos: linhas.map(hidratarMaquina),
    total: Number(total)
  };
}

export async function buscarPorId(id) {
  const [linhas] = await pool.query('SELECT * FROM equipamentos WHERE id = ?', [id]);
  if (linhas.length === 0) return null;
  return hidratarMaquina(linhas[0]);
}

export async function criar(produto) {
  const sql = 'INSERT INTO equipamentos (nome, marca, funcao, estado) VALUES (?, ?, ?, ?)';
  const valores = [produto.nome, produto.marca, produto.funcao, produto.estado];
  const [resultado] = await pool.query(sql, valores);
  return { ...produto, id: resultado.insertId};
}

export async function atualizar(id, produto) {
  const sql = 'UPDATE equipamentos SET nome = ?, marca = ?, funcao = ?, estado = ? WHERE id = ?';
  const valores = [produto.nome, produto.marca, produto.funcao, produto.estado, id];
  const [resultado] = await pool.query(sql, valores);
  return resultado.affectedRows > 0;
}

export async function excluir(id) {
  const [resultado] = await pool.query('DELETE FROM equipamentos WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}