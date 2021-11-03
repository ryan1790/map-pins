const User = require('../models/user');
const Pin = require('../models/pin');
const Collection = require('../models/collection');

module.exports.renderLoginForm = (req, res) => {
	const title = 'Log In';
	res.render('users/login', { title });
};

module.exports.login = (req, res) => {
	req.flash('success', 'Welcome back!');
	redirectUrl = req.session.returnTo || '/collections';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
	req.logout();
	res.redirect('/');
};

module.exports.renderRegisterForm = (req, res) => {
	const title = 'Register';
	res.render('users/register', { title });
};

module.exports.create = async (req, res, next) => {
	try {
		const { user, password } = req.body;
		const newUser = new User(user);
		const registeredUser = await User.register(newUser, password);
		req.login(registeredUser, err => {
			if (err) return next(err);
		});
		req.flash('success', 'Welcome here...');
		redirectUrl = req.session.returnTo || '/collections';
		delete req.session.returnTo;
		res.redirect(redirectUrl);
	} catch (err) {
		req.flash('error', err.message);
		return res.redirect('register');
	}
};

module.exports.account = async (req, res) => {
	const display = await User.findById(req.params.user_id).populate('friends');
	let isUser;
	let displayRequest = true;
	let displayRespond = false;
	let displayRemove = false;
	if (req.user) {
		isUser = req.user._id.equals(display._id);
		const user = await User.findById(req.user._id);
		for (let request of user.requests) {
			if (request.equals(display._id)) {
				displayRequest = false;
				displayRespond = true;
				displayRemove = false;
			}
		} // Check to see if users has been requested
		if (displayRequest) {
			for (let request of display.requests) {
				if (request.equals(user._id)) {
					displayRequest = false;
					displayRespoond = true;
					displayRemove = false;
				}
			}
		} // Check to see if target has been requested
		if (displayRequest) {
			for (let friend of user.friends) {
				if (friend.equals(display._id)) {
					displayRequest = false;
					displayRespond = false;
					displayRemove = true;
				}
			}
		} // Check to see if already friends
	} else {
		isUser = false;
	}
	const collections = await Collection.find({ creator: display._id });
	const pins = await (await Pin.find({ creator: display._id })).slice(0, 5);
	const matchCollections = [];
	for (let i = 0; i < pins.length; i++) {
		const collection = await Collection.find({ pins: { $in: [ pins[i]._id ] } }).select('_id');
		// matchCollections.push(collection['0']['_doc']['_id']);
		matchCollections.push(collection[0]._id);
	}
	const title = display.username;
	res.render('users/display', {
		title,
		userDisplay: display,
		isUser,
		displayRequest,
		displayRespond,
		displayRemove,
		collections,
		pins,
		matchCollections
	});
};

module.exports.request = async (req, res) => {
	await User.findByIdAndUpdate(req.body.userId, { $push: { requests: req.user._id } });
	res.redirect(`/users/${req.body.userId}`);
};

module.exports.respond = async (req, res) => {
	const requester = req.body.userId;
	const user = req.user._id;
	if (req.body.response === 'accept') {
		await User.findByIdAndUpdate(requester, { $push: { friends: user } });
		await User.findByIdAndUpdate(user, {
			$push: { friends: requester },
			$pull: { requests: requester }
		});
		req.flash('success', 'Friend request accepted');
	} else if (req.body.response === 'decline') {
		await User.findByIdAndUpdate(user, { $pull: { requests: requester } });
		req.flash('success', 'Friend request declined');
	} else {
		req.flash('error', 'Invalid operation');
	}

	return res.redirect(`/users/${user}`);
};

module.exports.remove = async (req, res) => {
	const user = req.user._id;
	const userTwo = req.body.userId;
	await User.findByIdAndUpdate(user, { $pull: { friends: userTwo } });
	await User.findByIdAndUpdate(userTwo, { $pull: { friends: user } });
	res.redirect(`/users/${user}`);
};
