const express = require('express');
const bcrypt = require('bcrypt');

const { checkUsernameAndPasswordNotEmpty } = require('../middlewares');

const User = require('../models/User');

const bcryptSalt = 10;

const router = express.Router();

router.post('/', checkUsernameAndPasswordNotEmpty, async (req, res, next) => {
	const { username, password } = res.locals.auth;
	try {
		const user = await User.findOne({ username });
		if (user) {
			return res.status(409).json({ code: 'username-not-unique' });
		}

		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashed_password = bcrypt.hashSync(password, salt);

		const newUser = await User.create({ username, hashed_password });
		req.session.currentUser = newUser;
		return res.status(201).json(newUser);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
