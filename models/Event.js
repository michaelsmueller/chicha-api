const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema(
	{
		creator: { type: Schema.Types.ObjectId, ref: 'User' },
		facebook_id: { type: String },
		name: { type: String },
		cover: { type: String },
		description: { type: String },
		start_time: { type: Date },
		end_time: { type: Date},
		place: {
			facebook_id: { type: String },
			name: { type: String },
			location: {
				city: { type: String },
				country: { type: String },
				latitude: { type: Number },
				longitude: { type: Number },
			}
		},
		upvotes: { type: Number },
		downvotes: { type: Number },
	},
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
