const express = require('express'),
	router = express.Router(),
	catchAsync = require('../utilities/catchAsync'),
	passport = require('passport'),
	{ isLoggedIn, isUser, canRequest, canRespond, canRemove } = require('../middlewares/auth'),
	multer = require('multer'),
	{ storage } = require('../cloudinary'),
	upload = multer({ storage });

const users = require('../controllers/users');
const passportOptions = {
	failureFlash: true,
	failureRedirect: '/login'
};

router.route('/login').get(users.renderLoginForm).post(passport.authenticate('local', passportOptions), users.login);

router.route('/register').get(users.renderRegisterForm).post(upload.single('image'), catchAsync(users.create));

router.get('/logout', users.logout);

router
	.route('/users/:user_id')
	.get(catchAsync(users.account))
	.put(isLoggedIn, isUser, upload.single('image'), catchAsync(users.edit));

router.get('/users/:user_id/edit', isLoggedIn, isUser, catchAsync(users.renderEditForm));

router
	.route('/users/:user_id/friend')
	.post(isLoggedIn, canRequest, catchAsync(users.request))
	.put(isLoggedIn, canRespond, catchAsync(users.respond))
	.delete(isLoggedIn, canRemove, catchAsync(users.remove));

module.exports = router;
