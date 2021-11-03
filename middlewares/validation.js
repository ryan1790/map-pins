const { collectionSchema, pinSchema, commentSchema } = require('../utilities/validationSchemas');
const ExpressError = require('../utilities/ExpressError');

const validation = {};

validation.validateCollection = (req, res, next) => {
	console.log(req);
	const { error } = collectionSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

validation.validatePin = (req, res, next) => {
	const { error } = pinSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

validation.validateComment = (req, res, next) => {
	const { error } = commentSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports = validation;
