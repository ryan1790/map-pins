const options = {};

options.mongoOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
};

options.sessionConfig = {
	name: 'irate',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};

options.CSP = {};

const scriptSrcUrls = [
	'https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js',
	'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.min.js',
	'https://api.tiles.mapbox.com/',
	'https://api.mapbox.com/',
	// 	'https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js'
	// 'https://kit.fontawesome.com/',
	'https://kit.fontawesome.com/47211c119c.js',
	// 'https://cdnjs.cloudflare.com/',
	'https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js'
	// 'https://cdn.jsdelivr.net',
];

const styleSrcUrls = [
	'https://kit-free.fontawesome.com/',
	'https://api.mapbox.com/',
	'https://api.tiles.mapbox.com/',
	'https://fonts.googleapis.com/',
	'https://use.fontawesome.com/',
	'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css',
	'https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css'
];

const connectSrcUrls = [
	'https://api.mapbox.com/',
	'https://a.tiles.mapbox.com/',
	'https://b.tiles.mapbox.com/',
	'https://events.mapbox.com/',
	'https://ka-f.fontawesome.com/'
	// 'https://ka-f.fontawesome.com/releases/v5.15.2/css/free.min.css',
	// 'https://ka-f.fontawesome.com/releases/v5.15.2/css/free-v4-shims.min.css?token=47211c119c'
];

const fontSrcUrls = [ 'https://ka-f.fontawesome.com/' ];

options.CSP.directives = {
	defaultSrc: [],
	connectSrc: [ "'self'", ...connectSrcUrls ],
	scriptSrc: [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
	styleSrc: [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
	workerSrc: [ "'self'", 'blob:' ],
	objectSrc: [],
	imgSrc: [ "'self'", 'blob:', 'data:', 'https://res.cloudinary.com/dbdar3i0e/', 'https://images.unsplash.com/' ],
	fontSrc: [ "'self'", ...fontSrcUrls ]
};

module.exports = options;
