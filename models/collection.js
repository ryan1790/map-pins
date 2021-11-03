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
	const imageFiles = [];
	if (collection.image && collection.image.url) {
		imageFiles.push(collection.image.fileName);
	}
	if (collection.pins.length) {
		for (pinId of collection.pins) {
			const pin = await Pin.findById(pinId);
			if (pin.images.length) {
				for (image in pin.images) {
					imageFiles.push(image.fileName);
				}
			}
			await pin.remove();
		}
	}
	for (let image of imageFiles) {
		cloudinary.uploader.destroy(image);
	}
});

module.exports = mongoose.model('Collection', CollectionSchema);
