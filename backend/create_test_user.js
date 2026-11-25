import bcrypt from 'bcryptjs';
import * as UsuarioModel from './src/models/UsuarioModel.js';
import { criarPool } from './src/config/database.js';

async function createOrUpdateUser() {
  const email = 'usuario.teste@example.com';
  const pool = criarPool();
  const [rows] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (rows.length > 0) {
    console.log('User exists, deleting...');
    await pool.query('DELETE FROM usuarios WHERE email = ?', [email]);
    console.log('Deleted existing user');
  }
  const senhaHash = await bcrypt.hash('Teste123!', 10);
  const usuario = await UsuarioModel.criar({
    codigo: 'FUNC-TEST',
    nome: 'Teste Usuário',
    cpf: '00000000000',
    cargo: 'Operador',
    turno: 'Manhã',
    email,
    senha: senhaHash,
    perfil: 'funcionario',
  });
  console.log('User created/updated:', usuario);
}

createOrUpdateUser().catch(e => console.error(e));


