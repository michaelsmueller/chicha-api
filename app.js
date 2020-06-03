const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

require('dotenv').config();

const DB_PATH = process.env.MONGODB_URI;

mongoose
	.connect(DB_PATH, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log(`conected to ${DB_PATH}`);
	})
	.catch(error => {
		console.error('Error connecting to mongo', error);
	});

const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const eventRouter = require('./routes/events');
const voteRouter = require('./routes/votes');
const offerRouter = require('./routes/offers');

const app = express();

app.use(
	cors({
		credentials: true,
		origin: [process.env.FRONTEND_DOMAIN],
		allowedHeaders: '*',
		allowedHeaders: [ 'Accept', 'Accept-Encoding', 'Accept-Language', 'Cookie', 'Connection', 'Host', 'If-None-Match', 'Origin', 'Referer', 'User-Agent', 'X-Requested-With' ]
	})
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
			ttl: 24 * 60 * 60, // 1 day
		}),
		secret: process.env.SECRET_SESSION,
		resave: true,
		saveUninitialized: true,
		name: process.env.COOKIE_NAME,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000,
		},
	})
);

app.use((req, res, next) => {
	// console.log(`${req.method} ${req.url}`);
	console.log(`Headers: `, req.headers);
	if (req.method === 'OPTIONS') console.log('OPTIONS request', req);
	next();
});

app.use('/', authRouter);
app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/votes', voteRouter);
app.use('/offers', offerRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	res.status(404).json({ code: 'not found' });
});

app.use((err, req, res, next) => {
	// always log the error
	console.error('ERROR', req.method, req.path, err);

	// only render if the error ocurred before sending the response
	if (!res.headersSent) {
		res.status(500).json({ code: 'unexpected', error: err });
	}
});

module.exports = app;
