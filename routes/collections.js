const express = require('express'),
	router = express.Router(),
	Pin = require('../models/pin'),
	catchAsync = require('../utilities/catchAsync'),
	{ validateCollection } = require('../middlewares/validation'),
	collections = require('../controllers/collections'),
	multer = require('multer'),
	{ storage } = require('../cloudinary'),
	upload = multer({ storage });

const { isLoggedIn, checkCollectionOwnership } = require('../middlewares/auth');
const { paginate, findPins } = require('../middlewares/pagination');

router
	.route('/')
	.get(catchAsync(collections.index))
	.post(isLoggedIn, upload.single('image'), validateCollection, catchAsync(collections.create));

router.get('/new', isLoggedIn, collections.renderNewForm);

router
	.route('/:collection_id')
	.get(catchAsync(findPins), catchAsync(paginate(Pin)), catchAsync(collections.show))
	.put(
		isLoggedIn,
		checkCollectionOwnership,
		upload.single('image'),
		validateCollection,
		catchAsync(collections.update)
	)
	.delete(isLoggedIn, checkCollectionOwnership, catchAsync(collections.delete));

router.get('/:collection_id/edit', isLoggedIn, checkCollectionOwnership, catchAsync(collections.renderEditForm));

module.exports = router;
