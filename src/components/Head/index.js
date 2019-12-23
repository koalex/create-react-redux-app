import React       from 'react';
import PropTypes   from 'prop-types';
import { Helmet }  from 'react-helmet';
import { connect } from 'react-redux';

const ogImagePropTypes = () => ({
	image: PropTypes.string,
	secureUrl: PropTypes.string,
	type: PropTypes.string,
	width: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	height: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	])
});
const ogVideoPropTypes = () => ({
	video: PropTypes.string,
	secureUrl: PropTypes.string,
	type: PropTypes.string,
	width: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	height: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	])
});
const ogAudioPropTypes = () => ({
	audio: PropTypes.string,
	secureUrl: PropTypes.string,
	type: PropTypes.string
});
const ogProfilePropTypes = () => ({
	firstName: PropTypes.string,
	lastName: PropTypes.string,
	username: PropTypes.string,
	gender: PropTypes.oneOf(['male', 'female'])
});
const ogArticlePropTypes = () => ({
	publishedTime: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.instanceOf(Date)
	]),
	modifiedTime: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.instanceOf(Date)
	]),
	expirationTime: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.instanceOf(Date)
	]),
	author: PropTypes.shape(ogProfilePropTypes()),
	section: PropTypes.string,
	tag: PropTypes.string
});
const openGraphPropTypes = () => ({
	title: PropTypes.string,
	description: PropTypes.string,
	type: PropTypes.oneOf([
		'website', 'article', 'book', 'profile', 'video.movie', 'video.episode', 'video.tv_show', 'video.other',
		'music.song', 'music.album', 'music.playlist', 'music.radio_station'
	]),
	url: PropTypes.string,
	name: PropTypes.string,
	determiner: PropTypes.oneOf(['a', 'an', 'the', '""', 'auto']),
	locale: PropTypes.string,
	locales: PropTypes.arrayOf(PropTypes.string),
	image: PropTypes.shape(ogImagePropTypes()),
	video: PropTypes.shape(ogVideoPropTypes),
	audio: PropTypes.shape(ogAudioPropTypes),
	article: PropTypes.shape(ogArticlePropTypes)
});

function HeadHelmet (props) {
	let {
		openGraph,
		twitter,
		dublinCore,

		img,
		image,
		locale,
		locales,
		title,
		description,
		keywords,
		appName,
		copyright,
		author,

		appleStatusBarColor,
		// fbAdmins,
		// latitude,
		// longitude,
		// country,
		// city,
		// streetAddress,
		// postalCode,
		// email,
		// phoneNumber,
		// placeName,
		// region
	} = props;

	if (img || image) {
		if (img && !img.startsWith('http')) img = window.location.origin + ( img.startsWith('/') ? '' : '/' ) + img;
		if (image && !image.startsWith('http')) image = window.location.origin + ( image.startsWith('/') ? '' : '/' ) + image;
	}

	let hrefWithLocale;

	if (locale) {
		let url = new URL(window.location.href);
		let query_string = url.search;
		let search_params = new URLSearchParams(query_string);
		search_params.set('locale', locale);
		url.search = search_params.toString();
		hrefWithLocale = url.toString();
	}

	const htmlAttributes = {lang: locale};

	if (openGraph) {
		htmlAttributes.prefix = 'og: http://ogp.me/ns#';
	}
	// TODO: html manifest="example.appcache"

	// https://wiki.whatwg.org/wiki/MetaExtensions
	// https://netpeak.net/ru/blog/kak-rabotat-s-open-graph/
	return (
		<React.Fragment>
			<Helmet htmlAttributes={htmlAttributes}>
				{title ? <title>{title}</title> : null}
				{keywords ? <meta name="keywords" content={keywords} /> : null}
				{description ? <meta name="description" content={description} /> : null}
				{description ? <meta name="msapplication-tooltip" content={description} /> : null}

				{locale ? <link rel="alternate" href={hrefWithLocale} hrefLang="x-default" /> : null}
				{locale && locales ? locales.reduce((acc, _locale) => {
						if (_locale === locale) return acc;
						let url = new URL(window.location.href);
						let query_string = url.search;
						let search_params = new URLSearchParams(query_string);
						search_params.set('locale', _locale);
						url.search = search_params.toString();
						acc.push(
							<link key={'hrefLang' + url.toString()} rel="alternate" href={url.toString()} hrefLang={_locale} />
						);
						return acc;
					}, [])
					: null}

				{/* https://developers.google.com/youtube/iframe_api_reference?hl=ru */}
				{/* <script src="https://www.youtube.com/iframe_api" type="text/javascript"></script> */}

				<meta name="msapplication-starturl" content="/" />
				<meta name="application-name" content={appName || process.env.REACT_APP_NAME} />
				<meta name="apple-mobile-web-app-title" content={appName || process.env.REACT_APP_NAME} />

				{(img || image) ? <link rel="image_src" href={img || image} /> : null} {/* min 200x200*/}

				{copyright ? <meta name="copyright" content={'© ' + copyright} /> : null}

				{/* Метатег Author и Copyright не используются одновременно - https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D1%82%D0%B0%D1%82%D0%B5%D0%B3%D0%B8#.D0.9C.D0.B5.D1.82.D0.B0.D1.82.D0.B5.D0.B3_Author_.D0.B8_Copyright */}
				{(author && !copyright) ? <meta name="author" content={author} /> : null}


				{(process.env.REACT_APP_APPLE_STORE_ID || twitter?.app?.appStoreId) ? <meta name="apple-itunes-app" content={'app-id=' + (process.env.REACT_APP_APPLE_STORE_ID || twitter?.app?.appStoreId)} /> : null}

				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content={appleStatusBarColor || process.env.REACT_APP_APPLE_STATUS_BAR_COLOR || 'black-translucent'} />

				<meta name="robots" content="noyaca" />
				<meta name="robots" content="noodp" />

				{/* https://habr.com/ru/post/445264/ */}

				{/*
				 <link rel="prefetch" href="/style.css" as="style" />
				 <link rel="preload" href="/style.css" as="style" />
				 <link rel="preconnect" href="https://example.com" />
				 <link rel="dns-prefetch" href="https://example.com" />
				 <link rel="prerender" href="https://example.com/about.html" />
				 */}
			</Helmet>
			{twitter ? (
				<Twitter title={title}
				         description={description}
				         {...twitter}
				/>
			) : null}
			{openGraph ? (
				<OpenGraph locale={locale}
				           locales={locales}
				           title={title}
				           description={description}
				           {...openGraph}
				/>
			) : null}
			{dublinCore ? (
				<DublinCore language={locale}
				            title={title}
				            description={description}
				            subject={keywords}
				            {...dublinCore}
				/>
			) : null}
		</React.Fragment>

	);
}
HeadHelmet.propTypes = {
	locale: PropTypes.string,
	locales: PropTypes.array,
	openGraph: PropTypes.shape(openGraphPropTypes())
};

/*
	Basic OpenGraph tags
	https://ogp.me
	https://github.com/niallkennedy/open-graph-protocol-examples
	https://ruogp.me
*/
function OpenGraph (props) { //
	const {
		title,
		description,
		type,
		url,
		name,
		determiner,
		locale,
		locales,
		image,
		video,
		audio,
		article,
	} = props;

	return (
		<React.Fragment>
			<Helmet>
				<meta property="og:type" content={type || 'website'} />
				{(name || process.env.REACT_APP_NAME) ? <meta property="og:site_name" content={name || process.env.REACT_APP_NAME} /> : null}
				<meta property="og:title" content={title} />
				{description ? (<meta property="og:description" content={
					description.length > 300 ? (description.substring(0, 297) + '...') : description
				} />) : null}
				<meta property="og:url" content={url || window.location.href} />
				{determiner ? <meta property="og:determiner" content="the" /> : null}
			</Helmet>

			{image ? <OpenGraphImage {...image} /> : null}
			{video ? <OpenGraphVideo {...video} /> : null}
			{audio ? <OpenGraphAudio {...audio} /> : null}
			{article ? <OpenGraphArticle {...article} /> : null}
			<Helmet>
				<meta property="og:locale" content={locale} />
				{locales ? locales.reduce((acc, _locale) => {
						if (_locale === locale) return acc;
						let url = new URL(window.location.href);
						let query_string = url.search;
						let search_params = new URLSearchParams(query_string);
						search_params.set('locale', _locale);
						url.search = search_params.toString();
						acc.push(<meta key={'og:locale:alternate' + _locale + url.toString()} property="og:locale:alternate" content={_locale} />);
						acc.push(<link key={'alternate' + _locale + url.toString()} rel="alternate" href={url.toString()} hrefLang={_locale} />);
						return acc;
					}, [])
					: null}
			</Helmet>
		</React.Fragment>

	);
}
OpenGraph.propTypes = openGraphPropTypes();

function OpenGraphImage (props) {
	let {
		image, // url
		secureUrl, // https-url
		type, // MIME-type
		width, // number
		height // number
	} = props;

	if (image && !image.startsWith('http')) {
		image = window.location.origin + ( image.startsWith('/') ? '' : '/' ) + image;
	}
	if (secureUrl && !secureUrl.startsWith('http')) {
		secureUrl = window.location.origin + ( secureUrl.startsWith('/') ? '' : '/' ) + secureUrl;
	}

	return (
		<Helmet>
			<meta property="og:image" content={image} />
			<meta property="og:image:secure_url" content={secureUrl} />
			{type ? <meta property="og:image:type" content={type} /> : null}
			{width ? <meta property="og:image:width" content={width} /> : null}
			{height ? <meta property="og:image:height" content={height} /> : null}
		</Helmet>
	);
}
OpenGraphImage.propTypes = ogImagePropTypes();

function OpenGraphVideo (props) {
	let {
		video, // url
		secureUrl, // https-url
		type, // MIME-type, example: application/x-shockwave-flash
		width, // number
		height // number
	} = props;

	if (video && !video.startsWith('http')) {
		video = window.location.origin + ( video.startsWith('/') ? '' : '/' ) + video;
	}
	if (secureUrl && !secureUrl.startsWith('http')) {
		secureUrl = window.location.origin + ( secureUrl.startsWith('/') ? '' : '/' ) + secureUrl;
	}

	return (
		<Helmet>
			<meta property="og:video" content={video} />
			{secureUrl ? <meta property="og:video:secure_url" content={secureUrl} /> : null}
			{type ? <meta property="og:video:type" content={type} /> : null}
			{width ? <meta property="og:video:width" content={width} /> : null}
			{height ? <meta property="og:video:height" content={height} /> : null}
		</Helmet>
	);
}
OpenGraphVideo.propTypes = ogVideoPropTypes();

function OpenGraphAudio (props) {
	let {
		audio, // url
		secureUrl, // https-url
		type, // MIME-type, example: audio/mpeg
	} = props;

	if (audio && !audio.startsWith('http')) {
		audio = window.location.origin + ( audio.startsWith('/') ? '' : '/' ) + audio;
	}
	if (secureUrl && !secureUrl.startsWith('http')) {
		secureUrl = window.location.origin + ( secureUrl.startsWith('/') ? '' : '/' ) + secureUrl;
	}

	return (
		<Helmet>
			<meta property="og:audio" content={audio} />
			{secureUrl ? <meta property="og:audio:secure_url" content={secureUrl} /> : null}
			{type ? <meta property="og:audio:type" content={type} /> : null}
		</Helmet>
	);
}
OpenGraphAudio.propTypes = ogAudioPropTypes();

function OpenGraphArticle (props) {
	let {
		publishedTime, // 2013-08-26T03:31:18+00:00 8601
		modifiedTime, // 2014-08-26T03:31:18+00:00
		expirationTime,
		author,
		section,
		tag,
	} = props;

	const dateStrToISO8601 = dateStr => {
		const dateMs = Date.parse(dateStr);
		if (isNaN(dateMs)) throw new Error('Wrong date format: ' + dateStr + '. Must be enum [RFC2822, ISO 8601]');
		return (new Date(dateMs)).toISOString();
	};

	if ('number' === typeof publishedTime) {
		publishedTime = (new Date(publishedTime)).toISOString();
	} else if (publishedTime instanceof Date) {
		publishedTime = publishedTime.toISOString();
	} else if ('string' === typeof publishedTime) {
		publishedTime = dateStrToISO8601(publishedTime);
	}
	if (/T00:00:00/.test(publishedTime)) publishedTime = publishedTime.replace(/T00:00:00.{0,}/, '');

	if ('number' === typeof modifiedTime) {
		modifiedTime = (new Date(modifiedTime)).toISOString();
	} else if (modifiedTime instanceof Date) {
		modifiedTime = modifiedTime.toISOString();
	} else if ('string' === typeof modifiedTime) {
		modifiedTime = dateStrToISO8601(modifiedTime);
	}
	if (/T00:00:00/.test(modifiedTime)) modifiedTime = modifiedTime.replace(/T00:00:00.{0,}/, '');

	if ('number' === typeof expirationTime) {
		expirationTime = (new Date(expirationTime)).toISOString();
	} else if (expirationTime instanceof Date) {
		expirationTime = expirationTime.toISOString();
	} else if ('string' === typeof expirationTime) {
		expirationTime = dateStrToISO8601(expirationTime);
	}
	if (/T00:00:00/.test(expirationTime)) expirationTime = expirationTime.replace(/T00:00:00.{0,}/, '');

	return (
		<React.Fragment>
			<Helmet>
				<meta property="og:type" content="article" />
				{publishedTime ? <meta property="og:article:published_time" content={publishedTime} /> : null }
				{modifiedTime ? <meta property="og:article:modified_time" content={modifiedTime} /> : null }
				{expirationTime ? <meta property="og:article:expiration_time" content={expirationTime} /> : null }
				{section ? <meta property="og:article:section" content={section} /> : null}
				{tag ? <meta property="og:article:tag" content={tag} /> : null}
			</Helmet>

			{author ? <OpenGraphProfile {...author} /> : null}
		</React.Fragment>
	);
}
OpenGraphArticle.propTypes = ogArticlePropTypes();

function OpenGraphProfile (props) {
	const {
		firstName,
		lastName,
		username,
		gender // male || female
	} = props;

	return (
		<Helmet>
			{firstName ? <meta property="og:profile:first_name" content={firstName} /> : null}
			{lastName ? <meta property="og:profile:last_name" content={lastName} /> : null}
			{gender ? <meta property="og:profile:gender" content={gender} /> : null}
			{username ? <meta property="og:profile:username" content={username} /> : null}
		</Helmet>
	);
}
OpenGraphProfile.propTypes = ogProfilePropTypes();

function Twitter (props) {
	// https://cards-dev.twitter.com/validator
	// https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started
	let {
		card,
		title, // max 70 characters
		description,
		url,
		site,
		creator,
		image, // max 5MB SVG is not supported.  && summary_large_image: ratio 2:1, min 300x157, max 4096x4096 || summary: ratio 1:1, min 144x144, max 4096x4096
		app, // {}
		// player // player:width + player:height
	} = props;
	if (image && !image.startsWith('http')) image = window.location.origin + ( image.startsWith('/') ? '' : '/' ) + image;

	return (
		<React.Fragment>
			<Helmet>
				<meta name="twitter:card" content={card} />
				<meta name="twitter:title" content={title} />

				{/* до 200 символов */}
				{
					description ? (
						<meta name="twitter:description" content={
							description.length > 200 ? (description.substring(0, 197) + '...') : description
						} />
					) : null
				}

				{url ? <meta name="twitter:url" content={url} /> : null}
				{image ? <meta name="twitter:image" content={image} /> : null}

				{/* аккаунт сайта в твиттере, включая '@' */}
				{(process.env.REACT_APP_TWITTER_ACCOUNT || site) ? <meta name="twitter:site" content={process.env.REACT_APP_TWITTER_ACCOUNT || site} /> : null}

				{/* аккаунт автора в твиттере, включая '@' */}
				{(process.env.REACT_APP_TWITTER_ACCOUNT || creator) ? <meta name="twitter:creator" content={process.env.REACT_APP_TWITTER_ACCOUNT || creator} /> : null}
			</Helmet>
			{
				app ? (
					<Helmet>
						{(app.name || process.env.REACT_APP_NAME) ? <meta name="twitter:app:name:iphone" content={app.name || process.env.REACT_APP_NAME} /> : null}
						{(app.name || process.env.REACT_APP_NAME) ? <meta name="twitter:app:name:ipad" content={app.name || process.env.REACT_APP_NAME} /> : null}
						{(app.name || process.env.REACT_APP_NAME) ? <meta name="twitter:app:name:googleplay" content={app.name || process.env.REACT_APP_NAME} /> : null}
						{(app.appStoreId || process.env.REACT_APP_APPLE_STORE_ID) ? <meta name="twitter:app:id:iphone" content={app.appStoreId || process.env.REACT_APP_APPLE_STORE_ID} /> : null}
						{(app.appStoreId || process.env.REACT_APP_APPLE_STORE_ID) ? <meta name="twitter:app:id:ipad" content={app.appStoreId || process.env.REACT_APP_APPLE_STORE_ID} /> : null}
						{(app.appStoreUrl || process.env.REACT_APP_APPLE_STORE_URL) ? <meta name="twitter:app:url:iphone" content={app.appStoreUrl || process.env.REACT_APP_APPLE_STORE_URL} /> : null}
						{(app.appStoreUrl || process.env.REACT_APP_APPLE_STORE_URL) ? <meta name="twitter:app:url:ipad" content={app.appStoreUrl || process.env.REACT_APP_APPLE_STORE_URL} /> : null}
						{(app.googlePlayId || process.env.REACT_APP_GOOGLE_PLAY_ID) ? <meta name="twitter:app:id:googleplay" content={app.googlePlayId || process.env.REACT_APP_GOOGLE_PLAY_ID} /> : null}
						{(app.googlePlayUrl || process.env.REACT_APP_GOOGLE_PLAY_URL) ? <meta name="twitter:app:url:googleplay" content={app.googlePlayUrl || process.env.REACT_APP_GOOGLE_PLAY_URL} /> : null}
					</Helmet>
				) : null
			}

		</React.Fragment>
	);
}
Twitter.propTypes = {
	card: PropTypes.oneOf(['summary', 'summary_large_image', 'app', 'player']),
	title: PropTypes.string,
	description: PropTypes.string,
	url: PropTypes.string,
	site: PropTypes.string,
	creator: PropTypes.string,
	image: PropTypes.string,
	app: PropTypes.shape({
		country: PropTypes.string,
		name: PropTypes.string,
		appStoreId: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		appStoreUrl: PropTypes.string,
		googlePlayId: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		googlePlayUrl: PropTypes.string,
	})
};

function DublinCore (props) { // TODO: допилить все тэги
	// https://www.dublincore.org/specifications/dublin-core/usageguide/elements/
	// https://www.dublincore.org/specifications/dublin-core/dcq-html/
	// https://www.dublincore.org/specifications/dublin-core/usageguide/2001-04-12/simple-html/
	// https://www.masterwebs.ru/topic/17437-metategi-dublin-core-%E2%80%94-poleznie-no-maloizvestnie/
	const {
		id,
		title,
		creator,
		subject, // keywords
		description,
		// publisher, // publisher.url
		// contributor,
		// date, // date.created
		type, // example: Text
		format, // example: text/html
		identifier,
		language,
		coverage,
		// rights
	} = props;
	return (
		<Helmet>
			{title ? <meta name="DC.Title" content={title} /> : null}
			{language ? <meta name="DC.Language" content={language} /> : null}
			{subject ? <meta name="DC.Subject" content={subject} /> : null}
			{description ? <meta name="DC.Description" content={description} /> : null}
			<meta name="DC.Coverage" content={coverage || 'World'} />
			<meta name="DC.Identifier" content={id || identifier || window.location.href} />
			{creator ? <meta name="DC.Creator" content={creator} /> : null}
			{type ? <meta name="DC.Type" content={type} /> : null}
			{format ? <meta name="DC.Format" content={format} /> : null}
		</Helmet>
	);
}

export default connect(state => ({
	locale: state.i18n.locale,
	locales: state.i18n.locales,
}), null)(HeadHelmet);
