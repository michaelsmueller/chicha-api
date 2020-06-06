const express = require('express');
const Vote = require('../models/Vote');
const Event = require('../models/Event');
const User = require('../models/User');
const { ObjectID } = require('mongodb');
const { awardEventCreator, awardUser, awardVotedEvent } = require('../helpers/awardPoints');

const router = express.Router();

// create vote
router.post('/', async (req, res, next) => {
	const { eventId, direction } = req.body;
	const { currentUser: { _id: userId } } = res.locals;
	try {
		const newVote = await Vote.create({ voter: ObjectID(userId), event: ObjectID(eventId), direction });
		awardVotedEvent(eventId, direction);
		awardUser(userId, 1);
		awardEventCreator(eventId, direction);
		return res.status(200).json({ code: 'vote-created', newVote });
	} catch (error) {
		next(error);
	}
})

// read (get) vote
router.get('/', async (req, res, next) => {
	console.log('GET /votes, res.locals', res.locals);
	console.log('GET /votes, req.session', req.session);
	const { currentUser: { _id: voter } } = res.locals;
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
		awardVotedEvent(eventId, 2 * direction);
		awardEventCreator(eventId, 2 * direction);
		return res.status(201).json({ code: 'vote-changed', direction });
	} catch (error) {
		next(error);
	}
});

// delete (remove) vote
router.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	const { eventid: eventId, direction } = req.query;
	const { currentUser: { _id: userId } } = res.locals;
	try {
		await Vote.findByIdAndDelete(id);
		awardVotedEvent(eventId, direction);
		awardUser(userId, -1);
		awardEventCreator(eventId, direction);
		return res.status(200).json({ code: 'vote-removed', id });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
