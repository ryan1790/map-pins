if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express'),
	path = require('path'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
	ejsMate = require('ejs-mate'),
	ExpressError = require('./utilities/ExpressError'),
	session = require('express-session'),
	MongoStore = require('connect-mongo').default,
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	flash = require('express-flash'),
	mongoSanitize = require('express-mongo-sanitize'),
	helmet = require('helmet');

const { mongoOptions, CSP, sessionConfig } = require('./utilities/setupOptions');
const User = require('./models/user');
const app = express();

// const mongoUrl = 'mongodb://localhost:27017/geospatial-events';
// const mongoUrl = 'mongodb://localhost:27017/geospatial-events2';
const mongoUrl = process.env.DB_URL;
mongoose.connect(mongoUrl, mongoOptions);
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
	console.log('Database connected');
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const store = MongoStore.create({
	mongoUrl,
	touchAfter: 24 * 3600,
	secret: process.env.SECRET
});

store.on('error', e => {
	console.log('SESSION STORE ERROR', e);
});

const secure = true; // process.env.NODE_ENV === 'production';
// Make sure secure works — otherwise set to false
sessionConfig.secret = secret;
sessionConfig.store = store;
sessionConfig.cookie.secure = secure;
app.set('trust proxy', 1);
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet(), helmet.contentSecurityPolicy(CSP));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// Testing these
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use(require('./routes'));

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong!';
	res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
