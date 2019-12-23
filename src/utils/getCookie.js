export default function (cookieName) {
	let matches = document.cookie.match(new RegExp(
		// eslint-disable-next-line
		"(?:^|; )" + cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));

	return matches ? decodeURIComponent(matches[1]) : undefined;
}
