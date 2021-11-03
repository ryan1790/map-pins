const Collection = require('../models/collection');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
	const collections = await Collection.find({}).populate('creator');
	const title = 'Map Pins';
	res.render('collections/index', { collections, title });
};

module.exports.renderNewForm = (req, res) => {
	const title = 'New Collection';
	res.render('collections/new', { title });
};

module.exports.create = async (req, res) => {
	const { user, file } = req;
	const { collection } = req.body;
	collection.image = { url: file.path, fileName: file.filename };
	const newCollection = new Collection({ ...collection, creator: user._id });
	await newCollection.save();
	req.flash('success', 'Created a new Collection!');
	res.redirect(`/collections/${newCollection._id}`);
};

module.exports.show = async (req, res) => {
	const pageDisplay = res.pagination;
	const [ MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE ] = [ process.env.MAPBOX_ACCESS_TOKEN, process.env.MAPBOX_STYLE ];
	const collection = await Collection.findById(req.params.collection_id).populate('creator').populate({
		path: 'pins',
		populate: {
			path: 'creator'
		}
	});
	if (!collection) {
		req.flash('error', 'Collection not found!');
		res.redirect('/collections');
	}
	const title = collection.title;
	res.render('collections/show', { title, collection, pageDisplay, MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE });
};

module.exports.renderEditForm = async (req, res) => {
	const collection = await Collection.findById(req.params.collection_id);
	if (!collection) {
		req.flash('error', 'Collection not found!');
		res.redirect('/collections');
	}
	const title = `Edit ${collection.title}`;
	res.render('collections/edit', { title, collection });
};

module.exports.update = async (req, res) => {
	const [ collection_id, collection ] = [ req.params.collection_id, req.body.collection ];
	let url, fileName;
	if (req.file) {
		[ url, fileName ] = [ req.file.path, req.file.filename ];
		const { image } = await Collection.findById(collection_id);
		await cloudinary.uploader.destroy(image.fileName);
		collection.image = { url: url, fileName: fileName };
	}

	await Collection.findByIdAndUpdate(collection_id, collection);
	req.flash('success', 'Updated collection');
	res.redirect(`/collections/${collection_id}`);
};

module.exports.delete = async (req, res) => {
	await Collection.findOneAndDelete({ _id: req.params.collection_id });
	req.flash('success', 'Deleted Collection');
	res.redirect('/collections');
};
