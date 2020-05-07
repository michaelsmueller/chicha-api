const checkIfLoggedIn = (req, res, next) => {
	console.log('checkIfLoggedIn req.session', req.session);
	if (req.session.currentUser) {
		next();
	} else {
		res.status(401).json({ code: 'unauthorized' });
	}
};

const checkUsernameAndPasswordNotEmpty = (req, res, next) => {
	const { username, password } = req.body;
	console.log('checkUsernameAndPasswordNotEmpty');
	
	if (username !== '' && password !== '') {
		res.locals.auth = req.body;
		next();
	} else {
		res.status(422).json({ code: 'validation' });
	}
};

module.exports = {
	checkIfLoggedIn,
	checkUsernameAndPasswordNotEmpty,
};
