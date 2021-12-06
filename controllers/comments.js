const Pin = require('../models/pin');
const Comment = require('../models/comment');

module.exports.create = async (req, res) => {
	const newComment = new Comment({ ...req.body.comment, creator: req.user._id });
	await Pin.findByIdAndUpdate(req.params.pin_id, { $push: { comments: newComment } });
	await newComment.save();
	req.flash('success', 'Comment added!');
	res.redirect(`/collections/${req.params.collection_id}/pins/${req.params.pin_id}`);
};

// module.exports.update = async (req, res)=>{
//     await Comment.findByIdAndUpdate(req.params.comment_id, { ...req.body.comment });
//     res.redirect(`/collections/${req.params.collection_id}/pins/${req.params.pin_id}`);
// }

module.exports.delete = async (req, res) => {
	const { comment_id, collection_id, pin_id } = req.params;
	await Comment.findByIdAndDelete(comment_id);
	await Pin.findByIdAndUpdate(pin_id, { $pull: { comments: comment_id } });
	req.flash('success', 'Comment deleted!');
	res.redirect(`/collections/${collection_id}/pins/${pin_id}`);
};
