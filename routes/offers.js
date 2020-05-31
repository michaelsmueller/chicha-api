const express = require('express');
const Offer = require('../models/Offer');

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const offers = await Offer.find().sort({ cost: -1 });
		return res.json({ code: 'offers-read', offers });
	} catch (error) {
		next(error);
	}
});

router.get('/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		const offer = await Offer.findById(id);
		return res.json({ code: 'offer-read', offer });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
