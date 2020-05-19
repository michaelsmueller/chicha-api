const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		username: { type: String, required: true, unique: true, trim: true },
		hashed_password: { type: String, required: true },
		image: { type: String, default: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png' },
		bio: { type: String },
		url: { type: String },
		points: { type: Number, default: 0 },
		balance: { type: Number, default: 0 },
		vouchers: [ { type: Schema.Types.ObjectId, ref: 'Offer' } ],
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
