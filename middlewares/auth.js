const express = require('express');

const User = require('../models/user');
const Collection = require('../models/collection');
const Pin = require('../models/pin');
const Comment = require('../models/comment');

const auth = {};

auth.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'Must be logged in to access!');
		return res.redirect('/login');
	}
	next();
};

auth.checkCollectionOwnership = async (req, res, next) => {
	const collection = await Collection.findById(req.params.collection_id);
	if (collection.creator.equals(req.user._id)) {
		next();
	} else {
		req.flash('error', 'You do not have permission to do that!');
		res.redirect('/collections');
	}
};

auth.checkPinOwnership = async (req, res, next) => {
	const pin = await Pin.findById(req.params.pin_id);
	if (pin.creator.equals(req.user._id)) {
		next();
	} else {
		req.flash('error', 'You do not have permission to do that!');
		res.redirect('/collections');
	}
};

auth.checkCommentOwnership = async (req, res, next) => {
	const comment = await Comment.findById(req.params.comment_id);
	if (comment.creator.equals(req.user._id)) {
		next();
	} else {
		req.flash('error', 'You do not have permission to do that!');
		res.redirect('/collections');
	}
};

auth.canRequest = async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const target = await User.findById(req.params.user_id);
	for (let request of target.requests) {
		if (request.equals(user._id)) {
			req.flash('error', 'Friend request already pending');
			return res.redirect(`/users/${target._id}`);
		}
	}
	for (let request of user.requests) {
		if (request.equals(target._id)) {
			req.flash('error', 'User already sent you a friend request! Respond to it instead');
			return res.redirect(`/users/${user._id}`);
		}
	}
	for (let friend of target.friends) {
		if (friend.equals(user._id)) {
			req.flash('error', 'User is already your friend!');
			return res.redirect(`/users/${target._id}`);
		}
	}
	req.flash('success', 'Friend request sent');
	return next();
};

auth.canRespond = async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const requester = await User.findById(req.body.userId); // alter on views to make value = requestor
	for (let request of user.requests) {
		if (request.pin.equals(requester._id)) {
			return next();
		}
	}
	req.flash('error', 'Request not found');
	return res.redirect(`/users/${user._id}`);
};

auth.canRemove = async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const remove = await User.findById(req.body.userId); // Add remove userId to form
	for (let friend of user.friends) {
		if (friend.equals(remove._id)) {
			return next();
		}
	}
	req.flash('error', 'User not found in friend list');
	res.redirect(`/users/${user._id}`);
};

auth.isUser = async (req, res, next) => {
	const foundUser = await User.findById(req.params.user_id);
	if (foundUser._id.equals(req.user._id)) return next();
	req.flash('error', "Cannot edit another user's account");
	res.redirect(`/users/${req.user._id}`);
};

module.exports = auth;
