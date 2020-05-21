const mongoose = require('mongoose');

const { Schema } = mongoose;

const offerSchema = new Schema(
	{
		partner: { type: String },
		image: { type: String },
		description: { type: String },
		cost: { type: Number },
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
