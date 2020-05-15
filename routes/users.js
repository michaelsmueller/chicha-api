const express = require('express');
const { checkUsernameNotEmpty, checkUsernameAndPasswordNotEmpty } = require('../middlewares');
const User = require('../models/User');
const encrypt = require('../helpers/encrypt');

const router = express.Router();

router.post('/', checkUsernameAndPasswordNotEmpty, async (req, res, next) => {
	const { username, password } = res.locals.auth;
	try {
		const user = await User.findOne({ username });
		if (user) return res.status(409).json({ code: 'username-not-unique' });
		const hashed_password = encrypt.hashPassword(password);
		const newUser = await User.create({ username, hashed_password });
		req.session.currentUser = newUser;
		return res.status(201).json(newUser);
	} catch (error) {
		next(error);
	}
});

router.get('/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		return res.json({ code: 'user-read', user });
	} catch (error) {
		next(error);
	}
});

router.put('/:id', checkUsernameNotEmpty, async (req, res, next) => {
	const { id } = req.params;
	const { user, user: { password } } = res.locals;
	if (password) user.hashed_password = encrypt.hashPassword(password);
	try {
		await User.findByIdAndUpdate(id, user);
		return res.status(201).json({ code: 'user-updated', user });
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		await User.findByIdAndDelete(id);
		return res.status(200).json({ code: 'event-deleted', id });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
