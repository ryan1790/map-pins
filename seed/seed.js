const mongoose = require('mongoose');
const cities = require('all-the-cities');
const Pin = require('../models/pin');
const User = require('../models/user');
const Collection = require('../models/collection');
const Comment = require('../models/comment');

const pins = 200;
const comments = 15;

const { userInfo, collectionInfo, pinInfo } = require('./seedHelper');
const { usernames, emails, passwords, userImages } = userInfo;
const { collectionTitles, collectionDescriptions, collImages } = collectionInfo;
const { restaurantTitles, shopTitles, pinDescriptions, restImages, shopImages } = pinInfo;
let [ rIndex, sIndex ] = [ 0, 0 ];
const mongooseOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
};
const mongoUrl = 'mongodb://localhost:27017/geospatial-events2';
mongoose.connect(mongoUrl, mongooseOptions);

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
			email: emails[i],
			image: userImages[i],
			friends: [],
			requests: []
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
			image: collImages[i],
			description: collectionDescriptions[i],
			pins: [],
			creator: sample(users)
		});
		await newCollection.save();
	}
}

async function constructPins() {
	const users = [];
	for (let alias of usernames) {
		const foundUser = await User.findOne({ username: alias });
		users.push(foundUser);
	}
	// Restaurant Collection
	const restaurants = await Collection.findOne({ title: 'Restaurants' });
	for (let i = 0; i < 10; i++) {
		const area = sample(usCities);
		const newPin = new Pin({
			title: sample(restaurantTitles),
			description: sample(pinDescriptions),
			location: area.name,
			creator: sample(users),
			geometry: area.loc,
			images: [ restImages[rIndex], restImages[rIndex + 1] ],
			comments: []
		});
		rIndex += 2;
		await newPin.save();
		restaurants['pins'].push(newPin._id);
		constructComments(newPin, users, 30);
	}
	restaurants.save();

	// Town Collection
	const towns = await Collection.findOne({ title: 'Towns and Cities' });
	for (let i = 0; i < pins; i++) {
		const area = sample(usCities);
		const newPin = new Pin({
			title: area.name,
			description: sample(pinDescriptions),
			location: area.name,
			creator: sample(users),
			geometry: area.loc,
			images: [],
			comments: []
		});
		await newPin.save();
		towns['pins'].push(newPin._id);
		constructComments(newPin, users, 6);
	}
	towns.save();

	// Shop Collection
	const shops = await Collection.findOne({ title: 'Shops' });
	for (let i = 0; i < 10; i++) {
		const area = sample(usCities);
		const newPin = new Pin({
			title: sample(shopTitles),
			description: sample(pinDescriptions),
			location: area.name,
			creator: sample(users),
			geometry: area.loc,
			images: [ shopImages[sIndex] ],
			comments: []
		});
		sIndex++;
		await newPin.save();
		shops['pins'].push(newPin._id);
		constructComments(newPin, users, comments);
	}
	shops.save();
}

async function constructComments(pin, users, n) {
	const comments = [];
	for (let i = 0; i < n; i++) {
		const newComment = new Comment({
			body: sample(pinDescriptions),
			rating: 0,
			creator: sample(users)._id
		});
		await newComment.save();
		comments.push(newComment._id);
	}
	pin.comments = comments;
	await pin.save();
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

// seed();
