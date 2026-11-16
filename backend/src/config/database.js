import "dotenv/config";
import mysql from "mysql2/promise";

let poolInstance = null;

export function criarPool() {
  if (!poolInstance) {
    const host = process.env.DB_HOST || "127.0.0.1";
    const port = Number(process.env.DB_PORT || 3309);
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASSWORD || "";
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

export async function checkDatabaseConnection() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows[0]?.ok === 1;
}

