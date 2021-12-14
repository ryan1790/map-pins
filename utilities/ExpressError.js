class ExpressError extends Error {
	constructor(message, statusCode) {
		super();
		this.message = message;
		this.statusCode = statusCode;
		this.title = 'Error';
	}
}

module.exports = ExpressError;
