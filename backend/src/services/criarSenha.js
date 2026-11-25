import bcrypt from 'bcryptjs';

console.log(await bcrypt.hash("Func@12345", 10));