const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		'index': path.resolve(process.cwd(), 'src', 'index.js'),
		carousel: path.resolve(process.cwd(), 'src', 'carousel.js'),
	},
}; 