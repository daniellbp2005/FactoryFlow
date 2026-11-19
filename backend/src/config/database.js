import "dotenv/config";
import mysql from "mysql2/promise";

let poolInstance = null;

export function criarPool() {
  if (!poolInstance) {
    const host = process.env.DB_HOST || "127.0.0.1";
    const port = Number(process.env.DB_PORT || 3306);
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASSWORD || "senai@123";
    const database = process.env.DB_NAME || "api_flow";

    console.log(`[Database Config]: Conectando em ${user}@${host}:${port}/${database}`);

    poolInstance = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return poolInstance;
}

export const pool = criarPool();

export async function executarMigracoes() {
  try {
    const [cols] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'maquinas' AND COLUMN_NAME = 'usuario_id'"
    );
    if (cols.length === 0) {
      await pool.query(
        "ALTER TABLE maquinas ADD COLUMN usuario_id INT NULL, ADD CONSTRAINT fk_maquinas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)"
      );
      console.log("[Migration]: Coluna usuario_id adicionada à tabela maquinas com sucesso.");
    }
  } catch (err) {
    // Silencioso se o banco ainda não estiver pronto ou se já existir
  }
}

// Executa em segundo plano se a conexão for bem sucedida
executarMigracoes();

export async function checkDatabaseConnection() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  await executarMigracoes();
  return rows[0]?.ok === 1;
}

