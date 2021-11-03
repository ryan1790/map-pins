const express = require('express'),
	router = express.Router();

router.use('/', require('./users'));
router.use('/collections/', require('./collections'));
router.use('/collections/:collection_id/pins/', require('./pins'));
router.use('/collections/:collection_id/pins/:pin_id/', require('./comments'));

router.get('/', (req, res) => {
	res.render('home', { title: 'Map Pins' });
});

module.exports = router;
