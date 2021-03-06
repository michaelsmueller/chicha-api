const express = require('express');
const User = require('../models/User');
const Offer = require('../models/Offer');
const encrypt = require('../helpers/encrypt');
const { ObjectID } = require('mongodb');
const { checkUserModifyingSelf, checkUsernameNotEmpty, checkUsernameAndPasswordNotEmpty } = require('../middlewares');

const router = express.Router();

router.post('/', checkUsernameAndPasswordNotEmpty, async (req, res, next) => {
	const { username, password } = res.locals.auth;
	try {
		const user = await User.findOne({ username });
		if (user) return res.status(409).json({ code: 'username-not-unique' });
		const hashed_password = encrypt.hashPassword(password);
		const newUser = await User.create({ username, hashed_password });
		req.session.currentUser = newUser;
		return res.status(201).json(newUser);
	} catch (error) {
		next(error);
	}
});

router.get('/heavies', async (req, res, next) => {
	try {
		const heavies = await User.find().sort({ 'points': -1 });
		return res.json({ code: 'heavies-read', heavies });
	} catch (error) {
		next(error);
	}
});

router.get('/find', async (req, res, next) => {
	const { coupon: couponId } = req.query;
	try {
		const user = await User
			.findOne({ 'coupons._id': ObjectID(couponId) })
			.populate('coupons.offer');
		const { _id: userId } = user;
		const coupon = user.coupons.find((coupon) => coupon._id.toString() === couponId);
		return res.json({ code: 'user-found', userId, coupon });
	} catch (error) {
		next(error);
	}
});

router.get('/coupons/find', async (req, res, next) => {
	const { partner: partnerId } = req.query;
	try {
		const partnerOffers = await Offer.find({ creator: partnerId });
		const partnerOfferIds = partnerOffers.map((offer) => ObjectID(offer._id));
		const redeemedCoupons = await User.aggregate([
			{ $unwind: { path: '$coupons' } },
			{ $match: { 'coupons.status': 'redeemed', 'coupons.offer': { $in: partnerOfferIds } } },
			{ $lookup: { from: 'offers', localField: 'coupons.offer', foreignField: '_id', as: 'coupons.offer' } },
			{ $unwind: { path: '$coupons.offer' } },
			{ $sort: { 'coupons.redeemedOn': -1 } },
		]);
		return res.json({ code: 'coupons-found', redeemedCoupons });
	} catch (error) {
		next(error);
	}
});

router.get('/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id).populate('coupons.offer')
		return res.json({ code: 'user-read', user });
	} catch (error) {
		next(error);
	}
});

router.put('/:id', checkUserModifyingSelf, checkUsernameNotEmpty, async (req, res, next) => {
	const { id } = req.params;
	const { user, user: { password } } = res.locals;
	if (password) user.hashed_password = encrypt.hashPassword(password);
	try {
		await User.findByIdAndUpdate(id, user);
		return res.status(201).json({ code: 'user-updated', user });
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', checkUserModifyingSelf, async (req, res, next) => {
	const { id } = req.params;
	try {
		await User.findByIdAndDelete(id);
		return res.status(200).json({ code: 'event-deleted', id });
	} catch (error) {
		next(error);
	}
});

router.patch('/:id/coupons/:couponid', async (req, res, next) => {
	const { id: _id, couponid: couponId } = req.params;
	try {
		await User.updateOne(
			{ _id, 'coupons._id': couponId },
			{ 'coupons.$.status': 'redeemed', 'coupons.$.redeemedOn': new Date() },
		);
		return res.status(201).json({ code: 'coupon-redeemed', couponId });
	} catch (error) {
		next(error);
	}
});

router.patch('/:id/coupons', checkUserModifyingSelf, async (req, res, next) => {
	const { id } = req.params;
	const offer = req.body;
	try {
		await User.findByIdAndUpdate(id, {
				$inc: { balance: -1 * offer.cost },
				$push: { coupons: { offer } },
			});
		return res.status(201).json({ code: 'coupon-added', offer });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
