const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const { ObjectID } = require('mongodb');
const { checkEventNameNotEmpty, checkEventURLNotEmpty } = require('../middlewares');
const { getEventData, getEventId } = require('../helpers/fb');
const { awardUser } = require('../helpers/awardPoints');

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
	const { currentUser, currentUser: { _id: userId }  } = req.session;
	const { url } = res.locals.event;
	try {
		const eventId = getEventId(url).toString();
		const existingEvent = await Event.findOne({ 'data.id' : eventId } );
		if (existingEvent) return res.status(409).json({ code: 'event-exists', event: existingEvent });
		else {
			const data = await getEventData(url)
			console.log('Facebook event data returned', data);
			const _id = new ObjectID();
			await Event.create({ _id, creator: currentUser, data });
			awardUser(userId, 10);
			return res.status(201).json({ code: 'event-created', event: data, _id });
		}
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	const { currentUser: { _id: userId } } = req.session;
	try {
		await Event.findByIdAndDelete(id);
		await User.findByIdAndUpdate(userId, { $inc: { points: -10 } });
		return res.status(200).json({ code: 'event-deleted', id });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
