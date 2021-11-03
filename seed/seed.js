const mongoose = require('mongoose');
const cities = require('all-the-cities');
const Pin = require('../models/pin');
const User = require('../models/user');
const Collection = require('../models/collection');

const iterations = 200;

const { userInfo, collectionInfo, pinInfo } = require('./seedHelper');
const { usernames, emails, passwords } = userInfo;
const { collectionTitles, collectionDescriptions } = collectionInfo;
const { pinTitles, pinDescriptions, imageUrls } = pinInfo;
const mongooseOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
};
mongoose.connect('mongodb://localhost:27017/geospatial-events', mongooseOptions);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = a => a[Math.floor(Math.random() * a.length)];

const usCities = cities.filter(city => city.country === 'US');

async function constructUsers() {
	for (let i in usernames) {
		const newUser = new User({
			username: usernames[i],
			email: emails[i]
		});
		await User.register(newUser, passwords[i]);
	}
}

async function constructCollections() {
	const users = [];
	for (let alias of usernames) {
		const foundUser = await User.findOne({ username: alias });
		users.push(foundUser);
	}
	for (let i in collectionTitles) {
		const newCollection = new Collection({
			title: collectionTitles[i],
			image: sample(imageUrls),
			description: collectionDescriptions[i],
			pins: [],
			creator: sample(users)
		});
		await newCollection.save();
	}
}

async function constructPins() {
	const users = [];
	const collections = [];
	for (let alias of usernames) {
		const foundUser = await User.findOne({ username: alias });
		users.push(foundUser);
	}
	for (let title of collectionTitles) {
		const foundCollection = await Collection.findOne({ title: title });
		collections.push(foundCollection);
	}
	for (let i = 0; i < iterations; i++) {
		const area = sample(usCities);
		const newPin = new Pin({
			title: sample(pinTitles),
			description: sample(pinDescriptions),
			location: area.name,
			creator: sample(users),
			geometry: area.loc,
			images: [ sample(imageUrls) ]
		});
		c = sample(collections);
		c['pins'].push(newPin._id);
		await c.save();
		await newPin.save();
	}
}

async function clearDB() {
	await Collection.deleteMany({});
	await User.deleteMany({});
	await Pin.deleteMany({});
}

const seed = async () => {
	await clearDB();
	await constructUsers();
	await constructCollections();
	await constructPins();
};

// seed().then(() => {
// 	mongoose.connection.close(() => {
// 		console.log('Disconnected from database.');
// 	});
// });
