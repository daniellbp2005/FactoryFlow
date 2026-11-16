import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler } from "./middlewares/errorHandler.js";
import { equipamentoRouter } from "./routes/equipamentoRouter.js";
import healthRoutes from "./routes/healthRoutes.js";
import { maqRouter } from "./routes/maqRoutes.js";
import { relatoriosRouter } from "./routes/relatoriosRouter.js";
import { tarefasRouter } from "./routes/tarefasRoutes.js";
import { usuariosRouter } from "./routes/usuarioRouter.js";

const app = express();

// Defesa em Profundidade: Helmet para headers HTTP seguros
app.use(helmet());

// CORS restrito ao Frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  }),
);

// Limite no body JSON para prevenir ataques de negação de serviço (DoS) por payload excessivo
app.use(express.json({ limit: "100kb" }));

app.get("/", (request, response) => {
  response.json({
    message: "API FactoryFlow ativa e protegida",
  });
});

// Rotas públicas de diagnóstico e autenticação
app.use("/api/health", healthRoutes);
app.use("/api/usuarios", usuariosRouter);
app.use("/usuarios", usuariosRouter); // Compatibilidade retroativa

// Rotas operacionais protegidas por autenticação JWT
app.use("/api/maquinas", maqRouter);
app.use("/api/tarefas", tarefasRouter);
app.use("/api/equipamentos", equipamentoRouter);
app.use("/api/relatorios", relatoriosRouter);
app.use("/usuarios", usuariosRouter);

// Tratamento centralizado de erros
app.use(errorHandler);

export default app;
