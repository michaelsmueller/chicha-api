const bcrypt = require('bcrypt');

const bcryptSalt = parseInt(process.env.BCRYPT_SALT, 10);

const compareSync = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
}

const hashPassword = (password) => {
	const salt = bcrypt.genSaltSync(bcryptSalt);
	return bcrypt.hashSync(password, salt);
}

module.exports = {
  compareSync,
	hashPassword,
};
