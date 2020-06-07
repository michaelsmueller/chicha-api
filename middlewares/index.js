const Event = require('../models/Event');

const checkIfLoggedIn = (req, res, next) => {
	if (req.session.currentUser) next();
	else res.status(401).json({ code: 'unauthorized' });
};

const checkUserCanDeleteEvent = async (req, res, next) => {
	const { currentUser: { _id: userId }  } = req.session;
	const { id: eventId } = req.params;
	try {
		const { creator } = await Event.findOne({ _id: eventId }, { creator: 1, _id: 0 });
		if (userId === creator.toString()) next();
		else res.status(401).json({ code: 'unauthorized' });
	} catch (error) {
		next(error);
	}
};

const checkUserCanUpdateEvent = (req, res, next) => {
	const { currentUser: { _id: userId }  } = req.session;
	const { creator } = req.body;
	if (userId === creator) next();
	else res.status(401).json({ code: 'unauthorized' });
};

const checkUserModifyingSelf = (req, res, next) => {
	const { currentUser: { _id: userId }  } = req.session;
	const { id } = req.params;
	if (userId === id) next();
	else res.status(401).json({ code: 'unauthorized' });
};

const checkEventNameNotEmpty = (req, res, next) => {
	const { data: { name } } = req.body;
	if (name !== '') {
		res.locals.data = req.body;
		next();
	} else res.status(422).json({ code: 'validation' });
};

const checkEventURLNotEmpty = (req, res, next) => {
	const { url } = req.body;
	if (url !== '') {
		res.locals.event = req.body;
		next();
	} else res.status(422).json({ code: 'validation' });
};

const checkUsernameNotEmpty = (req, res, next) => {
	const { username } = req.body;
	if (username !== '') {
		res.locals.user = req.body;
		next();
	} else res.status(422).json({ code: 'validation' });
};

const checkUsernameAndPasswordNotEmpty = (req, res, next) => {
	const { username, password } = req.body;
	if (username !== '' && password !== '') {
		res.locals.auth = req.body;
		next();
	} else res.status(422).json({ code: 'validation' });
};


module.exports = {
	checkIfLoggedIn,
	checkUserCanDeleteEvent,
	checkUserCanUpdateEvent,
	checkUserModifyingSelf,
	checkEventNameNotEmpty,
	checkEventURLNotEmpty,
	checkUsernameNotEmpty,
	checkUsernameAndPasswordNotEmpty,
};
