const express = require('express');
const Vote = require('../models/Vote');
const Event = require('../models/Event');
const User = require('../models/User');
const { ObjectID } = require('mongodb');

const router = express.Router();

// create vote
router.post('/', async (req, res, next) => {
	const { eventId, direction } = req.body;
	const { currentUser: { _id: userId } } = req.session;
	try {
		const newVote = await Vote.create({ voter: ObjectID(userId), event: ObjectID(eventId), direction });

		await Event.findByIdAndUpdate(eventId, { $inc: { votes: direction } });
		await User.findByIdAndUpdate(userId, { $inc: { points: 1 } });

		const { creator: creatorId } = await Event.findById(eventId).select({ _id: 0, creator: 1 });
		const creator = await User.findById(creatorId);
		if (creator) await User.findByIdAndUpdate(creatorId, { $inc: { points: direction } });

		return res.status(200).json({ code: 'vote-created', newVote });
	} catch (error) {
		next(error);
	}
})

// read (get) vote
router.get('/', async (req, res, next) => {
	const { currentUser: { _id: voter } } = req.session;
	try {
		const votes = await Vote.find({ voter });
		return res.json({ code: 'votes-read', votes });
	} catch (error) {
		next(error);
	}
});

// update (change) vote
router.put('/:id', async (req, res, next) => {
	const { id } = req.params;
	const { eventId, direction } = req.body;
	try {
		await Vote.findByIdAndUpdate(id, { direction });
		await Event.findByIdAndUpdate(eventId, { $inc: { votes: 2 * direction } });

		const { creator: creatorId } = await Event.findById(eventId).select({ _id: 0, creator: 1 });
		const creator = await User.findById(creatorId);
		if (creator) await User.findByIdAndUpdate(creatorId, { $inc: { points: 2 * direction } });

		return res.status(201).json({ code: 'vote-changed', direction });
	} catch (error) {
		next(error);
	}
});

// delete (remove) vote
router.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	const { eventid: eventId, direction } = req.query;
	const { currentUser: { _id: userId } } = req.session;
	try {
		await Vote.findByIdAndDelete(id);

		await Event.findByIdAndUpdate(eventId, { $inc: { votes: direction } });
		await User.findByIdAndUpdate(userId, { $inc: { points: -1 } });

		const { creator: creatorId } = await Event.findById(eventId).select({ _id: 0, creator: 1 });
		const creator = await User.findById(creatorId);
		if (creator) await User.findByIdAndUpdate(creatorId, { $inc: { points: direction } });

		return res.status(200).json({ code: 'vote-removed', id });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
