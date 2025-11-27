const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'Honey@8309';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password hash for Honey@8309:', hash);
}

hashPassword();
