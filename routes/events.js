const express = require('express');
const { checkEventNameNotEmpty, checkEventURLNotEmpty } = require('../middlewares');
const { getEventData, getEventId } = require('../helpers/fb');
const Event = require('../models/Event');
const User = require('../models/User');
const ObjectID = require('mongodb').ObjectID;

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const events = await Event.find().sort('data.start_time');
		return res.json({ code: 'events-read', events });
	} catch (error) {
		next(error);
	}
});

router.get('/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		const event = await Event.findById(id);
		return res.json({ code: 'event-read', event });
	} catch (error) {
		next(error);
	}
});

router.put('/:id', checkEventNameNotEmpty, async (req, res, next) => {
	const { id } = req.params;
	const { data } = res.locals;
	try {
		await Event.findByIdAndUpdate(id, data);
		return res.status(200).json({ code: 'event-updated', event: data });
	} catch (error) {
		next(error);
	}
});

router.post('/', checkEventURLNotEmpty, async (req, res, next) => {
	const { currentUser  } = req.session;
	const { url } = res.locals.event;
	try {
		const eventId = getEventId(url).toString();
		const existingEvent = await Event.findOne({ 'data.id' : eventId } );
		if (existingEvent) {
			return res.status(409).json({ code: 'event-exists', event: existingEvent });
		} else {
			getEventData(url)
				.then (async (data) => {
					console.log('data returned', data);
					await Event.create({ creator: currentUser, data });
					return res.status(201).json({ code: 'event-created', event: data });
				})
				.catch ((error) => {
					console.log(error);
				})
		}
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		await Event.findByIdAndDelete(id);
		return res.status(200).json({ code: 'event-deleted', id });
	} catch (error) {
		next(error);
	}
});

router.patch('/vote', async (req, res, next) => {
	const { id, direction } = req.body;
	const { currentUser  } = req.session;
	console.log(`userId ${JSON.stringify(currentUser._id)} voting event id ${id} in direction ${direction}`);
	try {
		const vote = {
			event: ObjectID(id),
			vote: direction,
		};
		console.log('voting', vote);
		// await User.findByIdAndUpdate(
		// 	{ _id: currentUser._id},
		// 	{ $push: { votes: vote } },
		// );

		// await Event.findByIdAndUpdate(id, { $inc: { votes: direction } });
		return res.status(200).json({ code: 'vote-counted', direction });
	} catch (error) {
		next(error);
	}
})

module.exports = router;
