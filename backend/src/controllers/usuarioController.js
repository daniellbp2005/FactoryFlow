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
    const usuario = await AuthService.registrar(req.body, req.usuario);
    return res.status(201).json({ sucesso: true, dados: usuario });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}

export async function login(req, res, next) {
  try {
    const sessao = await AuthService.login(req.body);
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

    // Proteção de Privacidade (LGPD): se o usuário logado não for administrador nem o próprio dono da conta, oculta o CPF
    if (req.usuario && req.usuario.perfil !== "administrador" && req.usuario.id !== usuario.id) {
      delete usuario.cpf;
    }

    return res.status(200).json({ sucesso: true, dados: usuario });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}