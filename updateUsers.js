const mongoose = require('mongoose');
const User = require('./models/user');

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

const addFriending = async () => {
	const userList = await User.find();

	for (let user of userList) {
		user.requests = [];
		user.friends = [];
		await user.save();
	}
};

addFriending().then(() => {
	mongoose.connection.close(() => {
		console.log('Disconnected from database.');
	});
});
