const express = require('express'),
	router = express.Router({ mergeParams: true }),
	catchAsync = require('../utilities/catchAsync'),
	{ validateComment } = require('../middlewares/validation'),
	{ checkRating } = require('../middlewares/checkRating');

const { isLoggedIn, checkCommentOwnership } = require('../middlewares/auth');

const comments = require('../controllers/comments');

router.post('/', isLoggedIn, validateComment, catchAsync(checkRating), catchAsync(comments.create));

router.delete('/:comment_id', isLoggedIn, checkCommentOwnership, catchAsync(comments.delete));

module.exports = router;
