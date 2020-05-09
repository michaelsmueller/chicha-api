const express = require('express');
const bcrypt = require('bcrypt');
const { checkUsernameAndPasswordNotEmpty } = require('../middlewares');
const User = require('../models/User');

const bcryptSalt = 10;
const router = express.Router();

router.get('/whoami', (req, res, next) => {
	if (req.session.currentUser) {
		res.status(200).json(req.session.currentUser);
	} else {
		res.status(401).json({ code: 'unauthorized' });
	}
});

router.post('/signin', checkUsernameAndPasswordNotEmpty, async (req, res, next) => {
	const { username, password } = res.locals.auth;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ code: 'not-authorized' });
		}
		if (bcrypt.compareSync(password, user.hashed_password)) {
			req.session.currentUser = user;
			return res.json(user);
		}
		return res.status(401).json({ code: 'not-authorized' });
	} catch (error) {
		next(error);
	}
});

router.get('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			next(err);
		}
		return res.status(204).send();
	});
});

module.exports = router;
