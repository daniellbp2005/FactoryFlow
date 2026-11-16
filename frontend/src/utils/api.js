export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("factoryflow_token");
  }
  return null;
}

export function setSessao(token, usuario) {
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("factoryflow_token", token);
    if (usuario) localStorage.setItem("factoryflow_usuario", JSON.stringify(usuario));
  }
}

export function getUsuarioLogado() {
  if (typeof window !== "undefined") {
    const dados = localStorage.getItem("factoryflow_usuario");
    try {
      return dados ? JSON.parse(dados) : null;
    } catch {
      return null;
    }
  }
  return null;
}

export function limparSessao() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("factoryflow_token");
    localStorage.removeItem("factoryflow_usuario");
  }
}

export async function fetchComAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const endpoint = url.startsWith("http")
    ? url
    : `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  const resposta = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (resposta.status === 401 && typeof window !== "undefined" && window.location.pathname !== "/") {
    limparSessao();
    window.location.href = "/";
  }

  return resposta;
}

