const express = require('express');
const Vote = require('../models/Vote');
const Event = require('../models/Event');
const { ObjectID } = require('mongodb');

const router = express.Router();

router.get('/', async (req, res, next) => {
	const { currentUser } = req.session;
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
		await Event.findByIdAndUpdate(eventId, { $inc: { votes: direction } });
		return res.status(200).json({ code: 'vote-created', newVote });
	} catch (error) {
		next(error);
	}
})

router.put('/:id', async (req, res, next) => {
	const { id } = req.params;
	const { eventId, direction } = req.body;
	try {
		await Vote.findByIdAndUpdate(id, { direction });
		await Event.findByIdAndUpdate(eventId, { $inc: { votes: direction } });
		return res.status(201).json({ code: 'vote-changed', direction });
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	const { eventid: eventId, direction } = req.query;
	await Event.findByIdAndUpdate(eventId, { $inc: { votes: direction } });
	try {
		await Vote.findByIdAndDelete(id);
		return res.status(200).json({ code: 'vote-removed', id });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
