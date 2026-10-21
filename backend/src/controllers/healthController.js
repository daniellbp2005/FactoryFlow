import { checkDatabaseConnection } from "../config/database.js";

export async function healthCheck(req, res, next) {
  try {
    const databaseConnected = await checkDatabaseConnection();

    res.json({
      status: "ok",
      database: databaseConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}
