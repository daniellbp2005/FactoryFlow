export function errorHandler(error, req, res, next) {
  console.error("[Erro Backend]:", error);

  const resposta = {
    sucesso: false,
    message: "Erro interno no servidor",
  };

  // Em desenvolvimento, expõe a causa raiz para facilitar o diagnóstico
  if (process.env.NODE_ENV !== "production") {
    resposta.detalhes = error.message || error.toString() || String(error);
    resposta.codigo = error.code;
    resposta.endereco = error.address;
    resposta.porta = error.port;
  }

  res.status(500).json(resposta);
}
