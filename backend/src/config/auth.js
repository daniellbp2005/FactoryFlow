const envSecret = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

if (!envSecret && isProduction) {
  throw new Error("ERRO CRÍTICO DE SEGURANÇA: JWT_SECRET obrigatório em ambiente de produção!");
}

export const authConfig = {
  jwtSecret: envSecret || "factoryflow_dev_secret_trocar_em_producao_123!#",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "2h",
};

