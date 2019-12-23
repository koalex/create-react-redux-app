import getFingerPrint from 'utils/getBrowserFingerPrint';

export default (/*store*/) => next => async action => {
	const { CALL_API, ...rest } = action;

	if (!CALL_API) return next({ ...rest });

	const fingerprint = await getFingerPrint();

	if (CALL_API.headers && 'object' === typeof CALL_API.headers) {
		CALL_API.headers = Object.assign({}, CALL_API.headers, {
			'X-FP': fingerprint,
			'X-Requested-With': 'XMLHttpRequest'
		});
	} else if (!CALL_API.headers) {
		CALL_API.headers = {
			'X-FP': fingerprint,
			'X-Requested-With': 'XMLHttpRequest'
		};
	}

	return next({ CALL_API, ...rest });
}
