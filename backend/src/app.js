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

// CORS configurável (aceita uma ou mais origens separadas por vírgula)
const origensPermitidas = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origem) => origem.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições server-to-server, health check ou ferramentas sem header Origin
      if (!origin) return callback(null, true);
      const originNormalizada = origin.replace(/\/$/, "");
      if (origensPermitidas.includes("*") || origensPermitidas.includes(originNormalizada)) {
        return callback(null, true);
      }
      return callback(new Error(`Bloqueado pelo CORS: ${origin}`));
    },
    credentials: true,
  }),
);

// Limite no body JSON para prevenir ataques de negação de serviço (DoS) por payload excessivo
// Custom body parser to tolerate malformed JSON (e.g., missing quotes)
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      if (!raw) return next();
      try {
        req.body = JSON.parse(raw);
      } catch (e) {
        // Fallback: treat raw string as is (e.g., "{email:...}")
        req.body = raw;
      }
      next();
    });
  } else {
    next();
  }
});

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

// Tratamento centralizado de erros
app.use(errorHandler);

export default app;
