const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema(
	{
		creator: { type: Schema.Types.ObjectId, ref: 'User' },
		votes: { type: Number, default: 0 },
		data: {
			id: { type: String },
			name: { type: String, required: true },
			cover: { source: { type: String, default: 'https://www.cowgirlcontractcleaning.com/wp-content/uploads/sites/360/2018/05/placeholder-img-3.jpg' } },
			attending_count: { type: Number },
			interested_count: { type: Number },
			start_time: { type: Date },
			end_time: { type: Date},
			description: { type: String },
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
	},
	{ autoIndex: false },
);

eventSchema.index({ '$**': 'text' });

const Event = mongoose.model('Event', eventSchema);

Event.on('index', (error) => {
	if (error) console.log('Error creating index:', error.message);
});

module.exports = Event;
