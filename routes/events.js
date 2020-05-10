const express = require('express');
const { checkURLNotEmpty } = require('../middlewares');
const { getEventData, getEventId } = require('../helpers/fb');
const Event = require('../models/Event');

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const events = await Event.find();
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

router.post('/', checkURLNotEmpty, async (req, res, next) => {
	const { currentUser  } = req.session;
	const { url } = res.locals.event;
	try {
		const eventId = getEventId(url).toString();
		const existingEvent = await Event.findOne({ 'data.id' : eventId } );
		if (existingEvent) {
			return res.status(409).json({ code: 'event-exists', event: existingEvent });
		} else {
			const data = await getEventData(url);
			await Event.create({ creator: currentUser, data });
			return res.status(201).json({ code: 'event-created', event: data });
		}
	} catch (error) {
		next(error);
	}
});

module.exports = router;
