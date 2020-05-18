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
	const { eventId, direction } = req.body;
	const { currentUser: { _id: userId } } = req.session;
	try {
		const newVote = await Vote.create({
			voter: ObjectID(userId),
			event: ObjectID(eventId),
			direction,
		});
		return res.status(200).json({ code: 'vote-created', newVote });
	} catch (error) {
		next(error);
	}
})

router.put('/:id', async (req, res, next) => {
	const { id } = req.params;
	const { direction } = req.body;
	try {
		await Vote.findByIdAndUpdate(id, { direction });
		return res.status(201).json({ code: 'vote-changed', direction });
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		await Vote.findByIdAndDelete(id);
		return res.status(200).json({ code: 'vote-removed', id });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
