const User = require('../models/user');
const Collection = require('../models/collection');
const Pin = require('../models/pin');

const pagination = {};

pagination.paginate = model => {
	return async (req, res, next) => {
		const limit = parseInt(req.query.limit) || 10;
		let page = parseInt(req.query.page) || 1;
		const filter = req.query.filter || '';
		const author = req.query.author || '';
		const find = { _id: { $in: res.itemList } };
		const sort = {};
		const pag = {};
		const totalDocuments = await model.find(find).countDocuments().exec();

		pag.filter = filter;
		pag.author = author;

		pag.queryString = `limit=${limit}`;
		if (filter) {
			pag.queryString += `&filter=${filter}`;
		}
		if (author) {
			pag.queryString += `&author=${author}`;
		}

		if (author) {
			const creators = await User.find({ $text: { $search: author } });
			find.creator = { $in: creators.map(el => el._id) };
		}
		if (filter) {
			find['$text'] = { $search: filter };
			sort.score = { $meta: 'textScore' };
		} else {
			sort.datefield = -1;
		}

		const numDocuments = await model.find(find).countDocuments().exec();

		if (numDocuments === 0) {
			if (totalDocuments === 0) {
				pag.empty = false;
			} else {
				pag.empty = true;
			}
			res.pagination = pag;
			return next();
		}
		// If current page would have 0 documents, sets page to last page with results

		if ((page - 1) * limit >= numDocuments) {
			page = Math.ceil(numDocuments / limit);
		}

		if (page > 1) {
			pag.prevPage = { page: page - 1, limit, filter, author };
		}

		if (page * limit < numDocuments) {
			pag.nextPage = { page: page + 1, limit, filter, author };
		}
		pag.currentPage = await model
			.find(find)
			.sort(sort)
			.limit(limit)
			.skip(limit * (page - 1))
			.populate('creator')
			.exec();
		res.pagination = pag;
		next();
	};
};

pagination.findPins = async (req, res, next) => {
	const collection = await Collection.findById(req.params.collection_id);
	res.itemList = collection.pins;
	next();
};

pagination.findComments = async (req, res, next) => {
	const pin = await Pin.findById(req.params.pin_id);
	res.itemList = pin.comments;
	next();
};

module.exports = pagination;
