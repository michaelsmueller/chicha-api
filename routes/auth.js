const express = require('express');
const { checkUsernameAndPasswordNotEmpty } = require('../middlewares');
const User = require('../models/User');
const encrypt = require('../helpers/encrypt');

const router = express.Router();

router.get('/whoami', (req, res,) => {
	if (req.session.currentUser) {
		res.status(200).json(req.session.currentUser);
		res.locals.currentUser = req.session.currentUser;
		console.log('whoami, logged in, req.session', req.session);
		console.log('whoami logged inin, res.locals', res.locals);
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
		if (encrypt.compareSync(password, user.hashed_password)) {
			req.session.currentUser = user;
			res.locals.currentUser = req.session.currentUser;
			console.log('signed in, req.session', req.session);
			console.log('signed in, res.locals', res.locals);
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
