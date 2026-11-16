import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.js';
import * as UsuarioModel from '../models/UsuarioModel.js';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registrar({ nome, email, senha, cpf, cargo, perfil } = {}, autorRequisicao = null) {
  const nomeLimpo = typeof nome === 'string' ? nome.trim() : '';
  const emailLimpo = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cpfLimpo = typeof cpf === 'string' ? cpf.trim().toLowerCase() : '';
  const cargoLimpo = typeof cargo === 'string' ? cargo.trim().toLowerCase() : '';

  if (nomeLimpo.length < 3) {
    throw new TypeError('Nome deve ter no mínimo 3 caracteres.');
  }
  if (!cpfLimpo) {
    throw new TypeError('CPF é obrigatório.');
  }
  if (!cargoLimpo) {
    throw new TypeError('Cargo é obrigatório.');
  }
  if (!REGEX_EMAIL.test(emailLimpo)) {
    throw new TypeError('Informe um e-mail válido.');
  }
  if (
    typeof senha !== 'string' ||
    senha.length < 8 ||
    !/[a-z]/.test(senha) ||
    !/[A-Z]/.test(senha) ||
    !/\d/.test(senha) ||
    !/[^A-Za-z0-9]/.test(senha)
  ) {
    throw new TypeError('A senha deve ter no mínimo 8 caracteres, contendo maiúscula, minúscula, número e símbolo.');
  }

  const usuarioExistente = await UsuarioModel.buscarPorEmail(emailLimpo);
  if (usuarioExistente) {
    const erro = new Error('E-mail já cadastrado.');
    erro.status = 409;
    throw erro;
  }

  // Prevenção de Escalada de Privilégio (BFLA):
  // Usuários só podem ser registrados como 'administrador' se a requisição for feita por um administrador autenticado.
  let perfilSeguro = 'funcionario';
  if (perfil && perfil.toLowerCase() === 'administrador') {
    if (autorRequisicao && autorRequisicao.perfil === 'administrador') {
      perfilSeguro = 'administrador';
    }
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  return await UsuarioModel.criar({
    nome: nomeLimpo,
    email: emailLimpo,
    senha: senhaHash,
    cpf: cpfLimpo,
    cargo: cargoLimpo,
    perfil: perfilSeguro,
  });
}

export async function login({ email, senha } = {}) {
  const emailLimpo = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const usuario = REGEX_EMAIL.test(emailLimpo) ? await UsuarioModel.buscarPorEmail(emailLimpo) : null;
  const senhaValida = usuario ? await bcrypt.compare(senha || '', usuario.senha) : false;

  if (!usuario || !senhaValida) {
    const erro = new Error('Credenciais inválidas.');
    erro.status = 401;
    throw erro;
  }

  const token = jwt.sign(
    { perfil: usuario.perfil },
    authConfig.jwtSecret,
    { subject: String(usuario.id), expiresIn: authConfig.jwtExpiresIn }
  );

  return {
    token,
    tipo: 'Bearer',
    expiraEm: authConfig.jwtExpiresIn,
    usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
  };
}

export async function obterPerfil(id) {
  const usuario = await UsuarioModel.buscarPorId(id);
  if (!usuario) {
    const erro = new Error('Usuário não encontrado.');
    erro.status = 404;
    throw erro;
  }
  return usuario;
}
