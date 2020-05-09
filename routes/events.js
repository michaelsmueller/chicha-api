const express = require('express');
const { checkURLNotEmpty } = require('../middlewares');
const { likeEvent, getEvent } = require('../helpers/fb');
const Event = require('../models/Event');

const router = express.Router();

router.post('/', checkURLNotEmpty, async (req, res, next) => {
	const { url } = res.locals.event;
  const { currentUser  } = req.session;
	console.log('received url', url);
  // console.log('currentUser', currentUser);
	try {
		const { data } = await getEvent(url);
		console.log('eventData try 1', data);
	} catch (error) {
		try {
			await likeEvent(url);
			const { data } = await getEvent(url);
			console.log('eventData try 2', data);
			// return res.status(201).json(eventData);
		} catch (error) {
			console.log('error', error);
			next(error);
		}
	}
});

module.exports = router;
