const express = require('express');
const bcrypt = require('bcrypt');

const { checkUsernameNotEmpty, checkUsernameAndPasswordNotEmpty } = require('../middlewares');

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
	const { user } = res.locals;
	console.log('id is', id);
	console.log('received user data', user);
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
