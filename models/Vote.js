const mongoose = require('mongoose');

const { Schema } = mongoose;

const voteSchema = new Schema(
	{
    voter: { type: Schema.Types.ObjectId, ref: 'User' },
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    direction: { type: Number, min: -1, max: 1 },
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
