const express = require('express'),
	router = express.Router({ mergeParams: true }),
	catchAsync = require('../utilities/catchAsync'),
	{ validatePin } = require('../middlewares/validation'),
	multer = require('multer'),
	{ storage } = require('../cloudinary'),
	upload = multer({ storage });

const pins = require('../controllers/pins');
const { isLoggedIn, checkPinOwnership } = require('../middlewares/auth');
const Comment = require('../models/comment');
const { findComments, paginate } = require('../middlewares/pagination');

router.get('/new', isLoggedIn, pins.renderNewForm);

router.post('/', isLoggedIn, upload.array('images', 3), validatePin, catchAsync(pins.create));

router
	.route('/:pin_id')
	.get(catchAsync(findComments), catchAsync(paginate(Comment)), catchAsync(pins.show))
	.put(isLoggedIn, checkPinOwnership, validatePin, catchAsync(pins.update))
	.delete(isLoggedIn, checkPinOwnership, catchAsync(pins.delete));

router.get('/:pin_id/edit', isLoggedIn, checkPinOwnership, catchAsync(pins.renderEditForm));

router
	.route('/:pin_id/images')
	.get(isLoggedIn, checkPinOwnership, catchAsync(pins.images))
	.put(isLoggedIn, checkPinOwnership, upload.array('images', 3), catchAsync(pins.updateImages));

module.exports = router;
