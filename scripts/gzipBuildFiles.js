const fs     = require('fs');
const glob   = require('glob');
const zopfli = require('node-zopfli');

const files = glob.sync(__dirname + '/../build/**/*.{css,js,json,svg,jpg,jpeg,png,ttf,eot,woff,woff2}');

files.forEach(file => {
	fs.createReadStream(file)
		.pipe(zopfli.createGzip({
			verbose: false,
			verbose_more: false,
			numiterations: 15,
			blocksplitting: true,
			blocksplittinglast: false,
			blocksplittingmax: 15
		}))
		.pipe(fs.createWriteStream(file + '.gz'));
});
