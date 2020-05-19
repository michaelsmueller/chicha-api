const Vote = require('../models/Vote');
const Event = require('../models/Event');
const User = require('../models/User');

const awardEventCreator = async (eventId, amount) => {
	const { creator: creatorId } = await Event.findById(eventId).select({ _id: 0, creator: 1 });
	const creator = await User.findById(creatorId);
	if (creator) await awardUser(creatorId, amount);
};

const awardUser = async (userId, amount) => {
	await User.findByIdAndUpdate(userId, { $inc: { points: amount } });
};

const awardVotedEvent = async (eventId, amount) => {
	await Event.findByIdAndUpdate(eventId, { $inc: { votes: amount } });
};

module.exports = {
  awardEventCreator,
  awardUser,
  awardVotedEvent,
};
