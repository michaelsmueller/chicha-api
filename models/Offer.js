const mongoose = require('mongoose');

const { Schema } = mongoose;

const offerSchema = new Schema(
	{
		merchant: { type: String },
		image: { type: String },
		description: { type: String },
		point_cost: { type: Number },
	},
);

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
