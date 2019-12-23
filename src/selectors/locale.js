import getCookie from '../utils/getCookie';

export default function () {
	let locale;

	if (~window.location.search.toLowerCase().indexOf('locale=')) {
		let searchParams = new URLSearchParams(window.location.search);
		locale = searchParams.get('locale');
	} else if (getCookie('locale')) {
		locale = getCookie('locale');
	} else if (window.navigator.language || window.navigator.userLanguage || window.navigator.systemLanguage || window.navigator.browserLanguage) {
		return (window.navigator.language || window.navigator.userLanguage || window.navigator.systemLanguage || window.navigator.browserLanguage);
	}

	return locale;
}
