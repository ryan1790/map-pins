const Pin = require('../models/pin');
const Comment = require('../models/comment');

module.exports.checkRating = async (req, res, next) => {
	// Immediately continue if no rating is given for new comment
	const rating = req.body.comment.rating;
	// req.body.comment.rating = toString(req.body.comment.rating);
	if (![ '1', '2', '3', '4', '5' ].includes(rating)) return next();
	// Check to see if user has already rated this pin before
	const { pin_id, collection_id } = req.params;
	const pin = await Pin.findById(pin_id);
	const userComments = await Comment.find({ _id: { $in: pin.comments }, creator: req.user._id });
	if (!userComments.length) return next();
	for (let comment of userComments) {
		if ([ '1', '2', '3', '4', '5' ].includes(comment.rating)) {
			// Redirect with failure message if a rating already exists
			req.flash('error', 'Cannot leave a second rating!');
			return res.redirect(`/collections/${collection_id}/pins/${pin_id}`);
		}
	}
	next();
};
