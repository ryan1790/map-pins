const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const CommentSchema = new Schema({
	body: String,
	rating: String,
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	date: { type: Date, default: Date.now }
});

CommentSchema.index({ body: 'text', rating: 'text', 'creator.username': 'text' });

module.exports = mongoose.model('Comment', CommentSchema);
