const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const pattern = /^\[ {0,1}-{0,1}\d*\.{0,1}\d{0,2}, {0,1}-{0,1}\d*\.{0,1}\d{0,2} {0,1}\]$/;
const extension = joi => ({
	type: 'string',
	base: joi.string(),
	messages: {
		'string.escapeHTML': '{{#label}} must not include HTML!'
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {}
				});
				if (clean !== value) return helpers.error('string.escapeHTML', { value });
				return clean;
			}
		}
	}
});

const Joi = BaseJoi.extend(extension);

module.exports.userSchema = Joi.object();

module.exports.collectionSchema = Joi.object({
	collection: Joi.object({
		title: Joi.string().required().escapeHTML(),
		description: Joi.string().required().escapeHTML()
	}).required()
});

module.exports.pinSchema = Joi.object({
	pin: Joi.object({
		title: Joi.string().required().escapeHTML(),
		description: Joi.string().required().escapeHTML(),
		location: Joi.string().required().escapeHTML()
	}).required(),
	coordinates: Joi.string().regex(pattern).required()
});

module.exports.commentSchema = Joi.object({
	comment: Joi.alternatives().try(
		Joi.object({
			rating: Joi.string().valid('1', '2', '3', '4', '5').escapeHTML().required(),
			body: Joi.string().allow('').escapeHTML()
		}),
		Joi.object({
			rating: Joi.string().valid('0'),
			body: Joi.string().min(5).escapeHTML()
		})
	)
});
