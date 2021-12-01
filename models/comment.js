const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const CommentSchema = new Schema({
	body: String,
	rating: Number,
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

// CommentSchema.index({ body: 'text', rating: 'text', 'creator.username': 'text' });

module.exports = mongoose.model('Comment', CommentSchema);
