import * as AuthService from '../services/usuarioService.js';

function responderErro(erro, res, next) {
  if (erro instanceof TypeError) {
    return res.status(422).json({ sucesso: false, erro: erro.message });
  }
  if (erro.status === 409) {
    return res.status(409).json({ sucesso: false, erro: erro.message });
  }
  if (erro.status === 401) {
    return res.status(401).json({ sucesso: false, erro: erro.message });
  }
  if (erro.status === 404) {
    return res.status(404).json({ sucesso: false, erro: erro.message });
  }
  return next(erro);
}

export async function registrar(req, res, next) {
  try {
    console.log("PERFIL SOLICITADO:", req.body.perfil);
    console.log("USUÁRIO AUTENTICADO:", req.usuario);
    const usuario = await AuthService.registrar(req.body, req.usuario);
    return res.status(201).json({ sucesso: true, dados: usuario });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}

export async function login(req, res, next) {
  // Ensure request body is parsed as JSON; handle cases where body arrives as raw string
  let payload = req.body;
  console.log('Login payload raw:', payload);
  if (payload && typeof payload !== 'object') {
    console.log('Payload not object, attempting parse');
  }
  // Ensure email and senha are present
  const email = payload?.email;
  const senha = payload?.senha;
  console.log('Login email:', email, 'senha:', senha);
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      // Fallback: parse simple key:value pairs separated by commas
      const obj = {};
      payload.split(',').forEach(pair => {
        const [key, val] = pair.split(':');
        if (key && val) {
          obj[key.trim()] = val.trim();
        }
      });
      payload = obj;
    }
  }
  // At this point payload should be an object { email, senha }
  try {
    // Log payload for debugging
console.log('Login payload:', payload);
const sessao = await AuthService.login({ email, senha });
    return res.status(200).json({ sucesso: true, dados: sessao });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}

export async function obterPerfil(req, res, next) {
  try {
    const usuario = await AuthService.obterPerfil(req.usuario.id);
    return res.status(200).json({ sucesso: true, dados: usuario });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}


export async function listar(req, res, next) {
  try {
    const resultado = await AuthService.listar(req.query);
    return res.status(200).json({
      sucesso: true,
      dados: resultado.usuarios,
      paginacao: resultado.paginacao
    });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const usuario = await AuthService.buscarPorId(req.params.id);
    return res.status(200).json({ sucesso: true, dados: usuario });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}