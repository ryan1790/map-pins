const Collection = require('../models/collection'),
	Pin = require('../models/pin'),
	Comment = require('../models/comment'),
	{ cloudinary } = require('../cloudinary');

module.exports.renderNewForm = (req, res) => {
	res.render('pins/new', { collection_id: req.params.collection_id });
};

module.exports.create = async (req, res) => {
	const { files = [], user } = req;
	const { pin, coordinates } = req.body;
	const { collection_id } = req.params;
	const images = files.map(file => ({ url: file.path, fileName: file.filename }));
	pin.geometry = { type: 'Point', coordinates: JSON.parse(coordinates) };
	const newPin = new Pin({ ...pin, images, creator: user._id });
	await Collection.findByIdAndUpdate(collection_id, { $push: { pins: newPin } });
	await newPin.save();
	req.flash('success', 'Created a new Pin!');
	res.redirect(`/collections/${collection_id}/pins/${newPin._id}`);
};

module.exports.show = async (req, res) => {
	const pin = await Pin.findById(req.params.pin_id).populate('creator').exec();
	// .populate({
	// 	path: 'comments',
	// 	populate: {
	// 		path: 'creator'
	// 	}});
	const pageDisplay = res.pagination;
	const collection = await Collection.findById(req.params.collection_id).populate('creator');
	let userRated;
	if (req.user) {
		const userComments = await Comment.find({ _id: { $in: pin.comments }, creator: req.user._id });
		if (userComments.length) {
			for (let comment of userComments) {
				if ([ 1, 2, 3, 4, 5 ].includes(comment.rating)) {
					userRated = true;
					break;
				}
			}
		}
	}
	if (!userRated) userRated = false;
	const title = pin.title;
	res.render('pins/show', { title, pin, collection, userRated, pageDisplay });
};

module.exports.renderEditForm = async (req, res) => {
	const pin = await Pin.findById(req.params.pin_id);
	const title = `Edit ${pin.title}`;
	res.render('pins/edit', { title, pin, collection_id: req.params.collection_id });
};

module.exports.update = async (req, res) => {
	const { pin, coordinates } = req.body;
	const { collection_id, pin_id } = req.params;
	geometry = { type: 'Point', coordinates: JSON.parse(coordinates) };
	await Pin.findByIdAndUpdate(pin_id, { ...pin, geometry });
	req.flash('success', 'Updated Pin');
	res.redirect(`/collections/${collection_id}/pins/${pin_id}`);
};

module.exports.delete = async (req, res) => {
	await Collection.findByIdAndUpdate(req.params.collection_id, { $pull: { pins: req.params.pin_id } });
	await Pin.findByIdAndDelete(req.params.pin_id);
	req.flash('success', 'Deleted Pin!');
	res.redirect(`/collections/${req.params.collection_id}`);
};

module.exports.images = async (req, res) => {
	const { pin_id } = req.params;
	const pin = await Pin.findById(pin_id);
	const title = `Edit Images`;
	res.render('pins/images', { title, pin, collection_id: req.params.collection_id });
};

module.exports.updateImages = async (req, res) => {
	const { pin_id, collection_id } = req.params;
	const { deleteImages } = req.body;
	const { files } = req;
	let imageList;
	if (typeof deleteImages === 'string') {
		imageList = [ deleteImages ];
	} else {
		imageList = deleteImages;
	}
	if (imageList) {
		await Pin.findByIdAndUpdate(pin_id, {
			$pull: { images: { fileName: { $in: imageList } } }
		});
		for (let image of imageList) {
			cloudinary.uploader.destroy(image);
		}
	}

	const addImages = files.map(f => ({ url: f.path, fileName: f.filename }));
	if (addImages.length) {
		await Pin.findByIdAndUpdate(pin_id, { $push: { images: { $each: addImages } } });
	}

	req.flash('success', 'Updated Images');
	res.redirect(`/collections/${collection_id}/pins/${pin_id}`);
};
