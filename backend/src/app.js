import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler } from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/healthRoutes.js";
import { maqRouter } from "./routes/maqRoutes.js";
import { tarefasRouter } from "./routes/tarefasRoutes.js";
import { equipamentoRouter } from "./routes/equipamentoRouter.js"
import { relatoriosRouter } from "./routes/relatoriosRouter.js"

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  }),
);
app.use(express.json());

app.get("/", (request, response) => {
  response.json({
    message: "API do projeto base",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/maquinas", maqRouter);
app.use("/api/tarefas", tarefasRouter);
app.use("/api/equipamentos", equipamentoRouter);
// app.use("/api/relatorios", relatoriosRouter);

app.use(errorHandler);

export default app;
