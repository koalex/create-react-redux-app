const fs        = require('fs');
const path      = require('path');
const http      = require('http');
const puppeteer = require('puppeteer');
const globSync  = require('glob')['sync'];
const handler   = require('serve-handler');
const rimraf    = require('rimraf');

const urls              = ['/'];
const createScreenshots = true;
const PORT              = 5050;
const origin            = 'http://localhost:' + PORT;
const locales           = globSync(`${__dirname}/../src/i18n/messages/*.json`).map(filePath => path.basename(filePath, '.json'));
const snapshotsPath     = path.join(__dirname, '../build/snapshots');
const filename          = 'snapshots.json';
const UA                = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36';
const VIEWPORT          = { width: 1440, height: 900 };

rimraf['sync'](snapshotsPath);
fs.mkdirSync(snapshotsPath);
createScreenshots && locales.forEach(locale => fs.mkdirSync(path.join(snapshotsPath, locale)));

const server = http.createServer((request, response) => (
	handler(request, response, {
		public: path.join(__dirname, '../build')
	})
));

server.listen(PORT, start);

async function start () {
	const snapshotObject = {};
	console.log('Creating snapshots...');
	try {
		const browser = await puppeteer.launch({
			args: ['--ignore-certificate-errors', '--no-sandbox'/*, '--ntp-switch-to-existing-tab'*/],
			headless: true
		});
		let screenShotCounter = 1;
		while (urls.length) {
			const url = urls.pop();
			const address = new URL(url, origin);
			if (!snapshotObject[url]) snapshotObject[url] = {};
			const page = await browser.newPage();
			await page.setUserAgent(UA);
			await page.setViewport(VIEWPORT);
			page.on('error', console.error); // TODO
			page.on('pageerror', console.error); // TODO
			for (let i = 0, l = locales.length; i < l; i++) {
				const locale = locales[i];
				address.searchParams.set('locale', locale);
				await page.goto(address, { waitUntil: 'load', timeout: 0 });
				const pageContent = await page.content();
				snapshotObject[url][locale] = pageContent;
				if (createScreenshots) {
					await page.screenshot({path: path.join(snapshotsPath, locale, screenShotCounter + '_' + locale + '.png') });
				}
			}
			++screenShotCounter;
			await page.close();
		}
		fs.writeFileSync(path.join(snapshotsPath, filename), JSON.stringify(snapshotObject));
		await browser.close();
	} catch (err) {
		console.error(err);
	}
	server.close();
}
