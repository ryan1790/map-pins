const mongoose = require('mongoose'),
	Pin = require('./pin'),
	Schema = mongoose.Schema,
	{ cloudinary } = require('../cloudinary');

const CollectionSchema = new Schema({
	title: { type: String, required: true },
	image: {
		url: String,
		fileName: String
	},
	description: { type: String, required: true },
	pins: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Pin'
		}
	],
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

CollectionSchema.post('findOneAndDelete', async collection => {
	if (collection.image && collection.image.url) {
		cloudinary.uploader.destroy(collection.image.fileName);
	}
	if (collection.pins.length) {
		for (pinId of collection.pins) {
			const pin = await Pin.findById(pinId);
			if (pin.images.length) {
				for (image of pin.images) {
					cloudinary.uploader.destroy(image.fileName);
				}
			}
			pin.remove();
		}
	}
});

module.exports = mongoose.model('Collection', CollectionSchema);
