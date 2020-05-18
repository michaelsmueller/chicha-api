const express = require('express');
const Vote = require('../models/Vote');
const ObjectID = require('mongodb').ObjectID;

const router = express.Router();

router.get('/', async (req, res, next) => {
	const { currentUser } = req.session;
	console.log('currentUser', currentUser);
	try {
		const votes = await Vote.find();
		return res.json({ code: 'votes-read', votes });
	} catch (error) {
		next(error);
	}
});

router.post('/', async (req, res, next) => {
	const { id: eventId, direction } = req.body;
	const { currentUser: { _id: userId } } = req.session;
	try {
		await Vote.create({ voter: ObjectID(userId), event: ObjectID(eventId), direction });
		return res.status(200).json({ code: 'vote-created', direction });
	} catch (error) {
		next(error);
	}
})

module.exports = router;
