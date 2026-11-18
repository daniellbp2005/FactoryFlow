import bcrypt from 'bcryptjs';

console.log(await bcrypt.hash("Admin@1345", 10));