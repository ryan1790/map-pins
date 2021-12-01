const mongoose = require('mongoose'),
	Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const RequestSchema = new Schema({
	pin: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	username: String
});

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
	requests: [ RequestSchema ]
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.index({ username: 'text' });

UserSchema.virtual('display').get(function() {
	return this.image.url.replace('/upload', '/upload/h_300,w_300,c_limit');
});

UserSchema.virtual('thumbnail').get(function() {
	return this.image.url.replace('/upload', '/upload/c_fill,h_200,w_200');
});

module.exports = mongoose.model('User', UserSchema);
