const express = require('express');
const { checkURLNotEmpty } = require('../middlewares');
const { getAndReturnEvent } = require('../helpers/fb');
const Event = require('../models/Event');

const router = express.Router();

router.post('/', checkURLNotEmpty, async (req, res, next) => {
	const { url } = res.locals.event;
  const { currentUser  } = req.session;
	console.log('received url', url);
	// console.log('currentUser', currentUser);
	try {
		const event = await getAndReturnEvent(url);
		return res.status(201).json({ code: 'event-created', event });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
