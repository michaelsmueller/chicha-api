const checkIfLoggedIn = (req, res, next) => {
	if (req.session.currentUser) {
		next();
	} else {
		res.status(401).json({ code: 'unauthorized' });
	}
};

const checkUsernameAndPasswordNotEmpty = (req, res, next) => {
	const { username, password } = req.body;
	if (username !== '' && password !== '') {
		res.locals.auth = req.body;
		next();
	} else {
		res.status(422).json({ code: 'validation' });
	}
};

const checkNameNotEmpty = (req, res, next) => {
	const { data: { name } } = req.body;
	if (name !== '') {
		res.locals.data = req.body;
		next();
	} else {
		res.status(422).json({ code: 'validation' });
	}
};

const checkURLNotEmpty = (req, res, next) => {
	const { url } = req.body;
	if (url !== '') {
		res.locals.event = req.body;
		next();
	} else {
		res.status(422).json({ code: 'validation' });
	}
};

module.exports = {
	checkIfLoggedIn,
	checkNameNotEmpty,
	checkURLNotEmpty,
	checkUsernameAndPasswordNotEmpty,
};
