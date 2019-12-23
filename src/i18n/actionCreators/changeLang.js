import { CHANGE_LOCALE } from '../actionTypes';

export default function changeLang (locale) {
	return {
		type: CHANGE_LOCALE,
		data: locale
	}
}
