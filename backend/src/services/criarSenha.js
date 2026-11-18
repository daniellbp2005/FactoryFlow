import bcrypt from 'bcryptjs';

console.log(await bcrypt.hash("Admin@12345", 10));