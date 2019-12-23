import setCookie from './setCookie';

export default function (cookieName) {
	setCookie(cookieName, '', {
		expires: -1
	});
}
