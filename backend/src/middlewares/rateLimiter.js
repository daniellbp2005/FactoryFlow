/**
 * Rate Limiter simples em memória para proteção contra Brute Force e DoS em rotas sensíveis.
 */
export function criarRateLimiter({
  janelaMs = 15 * 60 * 1000,
  limiteMax = process.env.NODE_ENV === "production" ? 10 : 1000, // Flexível em desenvolvimento
  mensagem = "Muitas requisições originadas deste IP. Tente novamente mais tarde.",
} = {}) {
  const tentativasPorIp = new Map();

  // Limpeza periódica para evitar vazamento de memória (memory leak)
  setInterval(() => {
    const agora = Date.now();
    for (const [ip, info] of tentativasPorIp.entries()) {
      if (agora - info.primeiraTentativa > janelaMs) {
        tentativasPorIp.delete(ip);
      }
    }
  }, janelaMs).unref();

  return (req, res, next) => {
    // Em desenvolvimento, se NODE_ENV não for production, permite testes frequentes
    if (process.env.NODE_ENV !== "production") {
      return next();
    }

    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1";
    const agora = Date.now();

    const info = tentativasPorIp.get(ip);

    if (!info || agora - info.primeiraTentativa > janelaMs) {
      tentativasPorIp.set(ip, {
        primeiraTentativa: agora,
        total: 1,
      });
      return next();
    }

    info.total += 1;

    if (info.total > limiteMax) {
      return res.status(429).json({
        sucesso: false,
        erro: mensagem,
        tentarAposMinutos: Math.ceil((janelaMs - (agora - info.primeiraTentativa)) / 60000),
      });
    }

    return next();
  };
}
