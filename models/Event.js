const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema(
	{
		creator: { type: Schema.Types.ObjectId, ref: 'User' },
		upvotes: { type: Number },
		downvotes: { type: Number },
		data: {
			id: { type: String },
			name: { type: String, required: true },
			cover: {
				source: { type: String }
			},
			attending_count: { type: Number },
			interested_count: { type: Number },
			start_time: { type: Date },
			end_time: { type: Date},
<<<<<<< HEAD
=======
			description: { type: String },
>>>>>>> c7d03e02a095cb6b08dfc0f984f4514e6df00cb2
			ticket_uri: { type: String },
			place: {
				name: { type: String },
				location: {
					street: { type: String },
					city: { type: String },
					country: { type: String },
					latitude: { type: Number },
					longitude: { type: Number },
				},
			},
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
