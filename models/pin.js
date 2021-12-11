const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	{ cloudinary } = require('../cloudinary');
const Comment = require('./comment');

const ImageSchema = new Schema({
	url: String,
	fileName: String
});

ImageSchema.virtual('thumbnail').get(function() {
	return this.url.replace('/upload', '/upload/w_200');
});

ImageSchema.virtual('display').get(function() {
	return this.url.replace('/upload', '/upload/h_500,w_500,c_pad,b_auto:predominant');
});

const options = { toJSON: { virtuals: true } };

const PinSchema = new Schema(
	{
		title: { type: String },
		images: [ ImageSchema ],
		description: { type: String },
		location: String,
		geometry: {
			type: {
				type: String,
				enum: [ 'Point' ],
				required: true
			},
			coordinates: {
				type: [ Number ],
				required: true
			}
		},
		date: { type: Date, default: Date.now },
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Comment'
			}
		],
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		ratings: [ Number ]
	},
	options
);

PinSchema.index({ title: 'text', description: 'text', location: 'text', 'creator.username': 'text' });

PinSchema.virtual('properties').get(function() {
	return {
		popupHtml: `<a class="cm-popup" href="/collections/#collection_id/pins/${this._id}">
						${this.location}</a>`
	};
});

PinSchema.virtual('displayRating').get(function() {
	if (!this.ratings.length) return 0;
	return Math.round(10 * this.ratings.reduce((p, n) => p + n) / this.ratings.length) / 10;
});

const deleteComments = async pin => {
	if (pin.comments.length) {
		await Comment.deleteMany({
			_id: {
				$in: pin.comments
			}
		});
	}
};

const deleteImages = async pin => {
	if (pin.images.length) {
		for (image of pin.images) {
			cloudinary.uploader.destroy(image.fileName);
		}
	}
};

PinSchema.post('findOneAndDelete', async pin => {
	deleteImages(pin);
	deleteComments(pin);
});

PinSchema.pre('remove', { document: true, query: false }, async function() {
	deleteComments(this);
});

module.exports = mongoose.model('Pin', PinSchema);
