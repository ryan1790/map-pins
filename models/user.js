const mongoose = require('mongoose'),
	Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
	email: { type: String, unique: true, required: true },
	image: {
		url: 'String',
		fileName: 'String'
	},
	friends: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	requests: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	]
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.index({ username: 'text' });

module.exports = mongoose.model('User', UserSchema);
