const Pin = require('../models/pin');
const Comment = require('../models/comment');

module.exports.create = async (req, res) => {
	const newComment = new Comment({ ...req.body.comment, creator: req.user._id });
	const pin = await Pin.findById(req.params.pin_id);
	const compare = [ '1', '2', '3', '4', '5' ];
	if (!compare.includes(newComment.rating)) {
		newComment.rating = '0';
	}
	pin.comments.push(newComment);
	const newRating = parseInt(newComment.rating);
	if ([ 1, 2, 3, 4, 5 ].includes(newRating)) {
		pin.ratings.push(newRating);
	}
	await pin.save();
	await newComment.save();
	req.flash('success', 'Comment added!');
	res.redirect(`/collections/${req.params.collection_id}/pins/${req.params.pin_id}`);
};

module.exports.delete = async (req, res) => {
	const { comment_id, collection_id, pin_id } = req.params;
	const pin = await Pin.findById(pin_id);
	await Comment.findByIdAndDelete(comment_id, (err, doc) => {
		if (doc.rating) {
			const values = pin.ratings;
			values.splice(values.indexOf(doc.rating), 1);
		}
	});
	await pin.save();
	await Pin.findByIdAndUpdate(pin_id, { $pull: { comments: comment_id } });
	req.flash('success', 'Comment deleted!');
	res.redirect(`/collections/${collection_id}/pins/${pin_id}`);
};
