import * as dbModule from '../config/database.js'
import Maquina from "../models/Maquinas.js"

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

function hidratarMaquina(linha) {
  if (!linha) return null;
  return new Maquina(linha);
}

// 1. Listagem com paginação parametrizada
export async function listar({ limite, offset }) {
  const limiteNum = Number.parseInt(limite, 10);
  const offsetNum = Number.parseInt(offset, 10);

  const [linhas] = await pool.query(
    'SELECT * FROM maquinas ORDER BY id LIMIT ? OFFSET ?',
    [limiteNum, offsetNum]
  );

  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM maquinas');

  return {
    produtos: linhas.map(hidratarMaquina),
    total: Number(total)
  };
}

export async function buscarPorId(id) {
  const [linhas] = await pool.query('SELECT * FROM maquinas WHERE id = ?', [id]);
  if (linhas.length === 0) return null;
  return hidratarMaquina(linhas[0]);
}