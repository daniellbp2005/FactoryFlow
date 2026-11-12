import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UsuarioModel from '../models/UsuarioModel.js';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const jwtSecret = process.env.JWT_SECRET || 'chave-padrao-desenvolvimento';

export async function registrar({ codigo, nome, cpf, cargo, turno, email, senha, perfil } = {}) {
  const nomeLimpo = typeof nome === 'string' ? nome.trim() : '';
  const emailLimpo = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cpfLimpo = typeof cpf === 'string' ? cpf.trim().toLowerCase() : '';
  const cargoLimpo = typeof cargo === 'string' ? cargo.trim().toLowerCase() : '';
  const turnoLimpo = typeof turno === 'string' ? turno.trim() : '';

  const codigoLimpo = (typeof codigo === 'string' && codigo.trim())
    ? codigo.trim().toUpperCase()
    : `FUNC-${Date.now().toString().slice(-4)}`;

  if (nomeLimpo.length < 3) {
    throw new TypeError('Nome deve ter no mínimo 3 caracteres.');
  }
  if (!cpfLimpo) {
    throw new TypeError('CPF é obrigatório.');
  }
  if (!cargoLimpo) {
    throw new TypeError('Cargo é obrigatório.');
  }
  if (!turnoLimpo) {
    throw new TypeError('Turno é obrigatório.');
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

  const senhaHash = await bcrypt.hash(senha, 10);
  return await UsuarioModel.criar({
    nome: nomeLimpo,
    email: emailLimpo,
    senha: senhaHash,
    cpf: cpfLimpo,
    cargo: cargoLimpo,
    turno: turnoLimpo,
    codigo: codigoLimpo,
    perfil: perfil || 'funcionario'
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
    jwtSecret,
    { subject: String(usuario.id), expiresIn: '2h' }
  );

  return {
    token,
    tipo: 'Bearer',
    expiraEm: '2h',
    usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil }
  };
}

export async function listar({ pagina = 1, limite = 10 } = {}) {
  const paginaNum = Number(pagina);
  const limiteNum = Number(limite);

  if (!Number.isInteger(paginaNum) || paginaNum <= 0) {
    throw new TypeError('Página deve ser um número inteiro positivo.');
  }
  if (!Number.isInteger(limiteNum) || limiteNum < 1 || limiteNum > 100) {
    throw new TypeError('Limite deve ser um inteiro entre 1 e 100.');
  }

  const offset = (paginaNum - 1) * limiteNum;
  const { usuarios, total } = await UsuarioModel.listar({ limite: limiteNum, offset });

  return {
    usuarios,
    paginacao: {
      pagina: paginaNum,
      limite: limiteNum,
      total,
      totalPaginas: Math.ceil(total / limiteNum)
    }
  };
}

export async function buscarPorId(idRecebido) {
  const id = validarId(idRecebido);
  const usuario = await UsuarioModel.buscarPorId(id);
  if (!usuario) {
    throw new Error(`Usuário ${id} não encontrado.`);
  }
  return usuario;
}

function validarId(idRecebido) {
  const id = Number(idRecebido);
  if (!Number.isInteger(id) || id <= 0) {
    throw new TypeError('ID deve ser um número inteiro positivo.');
  }
  return id;
}