const userInfo = {};
const collectionInfo = {};
const pinInfo = {};

userInfo.usernames = [ 'ryan', 'andrei', 'austen' ];
userInfo.emails = [ 'ryan@ryan', 'andrei@andrei', 'austen@austen' ];
userInfo.passwords = [ 'ryan', 'andrei', 'austen' ];
// userInfo.names = [ 'Ryan', 'Andrei', 'Austen' ];

collectionInfo.collectionTitles = [ 'Places I Want to Visit', 'Favorite Restaurants', 'Historical Events' ];

collectionInfo.collectionDescriptions = [
	'List of attractions I want to see',
	'Some of my favorite places to eat!',
	'Help studying for class'
];

pinInfo.pinTitles = [
	'Wispy Dream',
	"John's Pizza",
	'Clubs R Us',
	'Burgers 4 Not Free',
	'The Big Outdoors',
	'Landfill',
	'Poodle Store',
	'Gummy Bears Inc',
	'Great Big Stadium',
	"The Rhino's Nest",
	'New York Parliament',
	'Versailles',
	'Nom nom the Dom',
	'Open the Front Door',
	"Y Not's Pastries",
	'The Mango Club',
	'The Eternal Sunshine',
	'Washington Bridge',
	'Lincoln Memorial',
	'The Last Fruitcake'
];

pinInfo.pinDescriptions = [
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae ultrices tellus. Aliquam ullamcorper convallis nisl, in mattis orci maximus a. In eget sollicitudin elit, eu tempus erat. Phasellus vitae nunc eu velit aliquet hendrerit. Morbi ex eros, sodales scelerisque lorem id, scelerisque ullamcorper arcu. Praesent facilisis vitae quam a auctor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam eleifend quam nec fermentum laoreet. Nam consectetur vehicula felis quis.',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, posuere a metus et, pulvinar rutrum tortor. Sed arcu felis, mattis eget lobortis sed, ornare a tortor. Aenean quis orci pretium, condimentum orci in, vestibulum turpis. Aliquam consectetur venenatis tellus, sed pulvinar est consequat vel. Aliquam convallis eros id.',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit elit eget dictum luctus. Sed non augue sed lorem finibus vulputate eu id leo. Aliquam nec arcu interdum, euismod magna eu, tempor neque. Proin ac feugiat sapien, eget malesuada augue.',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mattis lectus vel lacus tempor, eget hendrerit mi aliquet. Etiam volutpat.',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet.'
];

pinInfo.imageUrls = [
	{
		url: 'https://res.cloudinary.com/dbdar3i0e/image/upload/v1611362086/Collections/yr1iqvkwlsvmmbeztmoi.jpg',
		fileName: 'Collections/yr1iqvkwlsvmmbeztmoi.jpg'
	},
	{
		url: 'https://res.cloudinary.com/dbdar3i0e/image/upload/v1611362086/Collections/yr1iqvkwlsvmmbeztmoi.jpg',
		fileName: 'Collections/yr1iqvkwlsvmmbeztmoi.jpg'
	},
	{
		url: 'https://res.cloudinary.com/dbdar3i0e/image/upload/v1611361961/Collections/p6johbr6xzbq3maxjif8.jpg',
		fileName: 'Collections/p6johbr6xzbq3maxjif8.jpg'
	},
	{
		url: 'https://res.cloudinary.com/dbdar3i0e/image/upload/v1611361961/Collections/p6johbr6xzbq3maxjif8.jpg',
		fileName: 'Collections/p6johbr6xzbq3maxjif8.jpg'
	},
	{
		url: 'https://res.cloudinary.com/dbdar3i0e/image/upload/v1610672419/Collections/hm49rmceht1culpptdxw.jpg',
		fileName: 'Collections/hm49rmceht1culpptdxw.jpg'
	},
	{
		url: 'https://res.cloudinary.com/dbdar3i0e/image/upload/v1609866417/Collections/nuyt4o2aadoxjaavekve.jpg',
		fileName: 'Collections/nuyt4o2aadoxjaavekve.jpg'
	},
	{
		url: 'https://res.cloudinary.com/dbdar3i0e/image/upload/v1609113494/Collections/mhiyd5qxwhcfapvt8ogr.jpg',
		fileName: 'Collections/mhiyd5qxwhcfapvt8ogr.jpg'
	},
	{
		url: 'https://res.cloudinary.com/dbdar3i0e/image/upload/v1609113434/Collections/oavwmpjqm2wgo3zwrxgs.jpg',
		fileName: 'Collections/oavwmpjqm2wgo3zwrxgs.jpg'
	},
	{
		url: 'https://res.cloudinary.com/dbdar3i0e/image/upload/v1609047295/Collections/exgagnoof8spc70bdgp0.jpg',
		fileName: 'Collections/exgagnoof8spc70bdgp0.jpg'
	},
	{
		url: 'https://res.cloudinary.com/dbdar3i0e/image/upload/v1609059010/Collections/pgk4kcg7ygnqajj0y2bt.jpg',
		fileName: 'Collections/pgk4kcg7ygnqajj0y2bt.jpg'
	}
];
// Not certain fileName is accurate.

module.exports = { userInfo, collectionInfo, pinInfo };
