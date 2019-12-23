// https://medium.com/manato/introduce-babel-new-plugins-to-create-react-app-ea55f56c3811
const path = require('path');
const { override, useBabelRc, addWebpackPlugin } = require('customize-cra');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = override(
	useBabelRc(),
	addWebpackPlugin(new FaviconsWebpackPlugin({
		logo: path.join(__dirname, 'src/assets/img/logo1x1.png'),
		mode: 'webapp', // optional can be 'webapp' or 'light' - 'webapp' by default
		devMode: 'webapp', // optional can be 'webapp' or 'light' - 'light' by default
		inject: true,
		persistentCache: true,
		prefix: '[hash:6]',
		emitStats: true,
		statsFilename: 'favicons.json',
		background: '#fff',
		theme_color: '#fff',
		title: process.env.REACT_APP_NAME,
		appName: process.env.REACT_APP_NAME,
		appDescription: process.env.REACT_APP_DESC,
		developerName: null, // pkg.contributors[0].name,
		developerURL: null, // pkg.contributors[0].url,
		// silhouette: false,
		icons: {
			android: true,
			appleIcon: true,
			appleStartup: true,
			coast: true,
			favicons: true,
			firefox: true,
			opengraph: true,
			twitter: true,
			yandex: true,
			windows: true
		}
	}))
);