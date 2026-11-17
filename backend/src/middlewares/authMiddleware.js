import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.js";

/**
 * Middleware de Autenticação JWT
 * Verifica se o token Bearer enviado no header Authorization é válido e não expirou.
 */
export function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      sucesso: false,
      erro: "Acesso não autorizado: header Authorization não enviado.",
    });
  }

  // Divide por espaços múltiplos para tolerância a formatação
  const partes = authHeader.trim().split(/\s+/);
  const tipo = partes[0];
  const token = partes.slice(1).join(" ").trim();

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      sucesso: false,
      erro: "Formato de token inválido. O cabeçalho deve ser 'Authorization: Bearer <seu_token>'. Verifique se a variável do seu token não está vazia.",
    });
  }

  try {
    const payload = jwt.verify(token, authConfig.jwtSecret);

    // Injeta dados do usuário na requisição para uso nos controllers e services
    req.usuario = {
      id: Number(payload.sub),
      perfil: payload.perfil,
    };

    return next();
  } catch (erro) {
    if (erro.name === "TokenExpiredError") {
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão expirada. Por favor, realize o login novamente.",
      });
    }

    return res.status(401).json({
      sucesso: false,
      erro: "Token de autenticação inválido ou corrompido.",
    });
  }
}

/**
 * Middleware de Autenticação Opcional
 * Se o token for fornecido e válido, injeta req.usuario; caso contrário, continua sem erro.
 * Útil para rotas públicas onde usuários logados podem ter privilégios adicionais (ex.: cadastro de admin).
 */
export function autenticarOpcional(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const partes = authHeader.trim().split(/\s+/);
  const tipo = partes[0];
  const token = partes.slice(1).join(" ").trim();

  if (tipo === "Bearer" && token) {
    try {
      const payload = jwt.verify(token, authConfig.jwtSecret);
      req.usuario = {
        id: Number(payload.sub),
        perfil: payload.perfil,
      };
    } catch {
      // Ignora falhas no opcional
    }
  }

  return next();
}

/**
 * Middleware de Controle de Acesso Baseado em Perfis (RBAC)
 * Exemplo de uso: autorizarPerfis('administrador')
 */
export function autorizarPerfis(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        sucesso: false,
        erro: "Usuário não autenticado.",
      });
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        sucesso: false,
        erro: `Acesso negado: perfil '${req.usuario.perfil}' não tem permissão para esta operação. Perfis autorizados: ${perfisPermitidos.join(", ")}`,
      });
    }

    return next();
  };
}
