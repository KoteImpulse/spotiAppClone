const path = require('path');
const { i18n } = require('./next-i18next.config');

module.exports = {
	reactStrictMode: true,
	images: {
		domains: [
			'localhost',
			'links.papareact.com',
			'i.scdn.co',
			'mosaic.scdn.co',
			'seed-mix-image.spotifycdn.com',
			'res.cloudinary.com',
		],
	},
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	i18n,
	// experimental: { images: { layoutRaw: true } }
};
