import getLocale          from '../selectors/locale';
import uuid               from 'uuid/v3';
import FileSaver          from 'file-saver';
import formDataFromObject from '../utils/formDataFromObject';

const defaultHeaders = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	// Host: 'https://localhost:8080',
};

export default store => next => async action => {
	const { CALL_API, type, ...rest } = action;

	if (!CALL_API) return next({ type, ...rest });
	const isGET = () => 'GET' === CALL_API.method.toUpperCase();

	if (CALL_API.success_type === undefined) {
		if (CALL_API.error_type) {
			return store.dispatch({ ...rest, type: CALL_API.error_type, payload: 'CALL_API must contain "success_action_type"' });
		} else {
			throw new Error('CALL_API must contain "success_action_type" or "false" for skip response');
		}
	} else if (CALL_API.error_type === undefined) {
		throw new Error('CALL_API must contain "error_action_type" or "false" for skip response');
	}

	next({ type, CALL_API, ...rest});

	let headers = defaultHeaders;

	if (CALL_API.headers && 'object' === typeof CALL_API.headers) {
		headers = Object.assign({}, defaultHeaders, CALL_API.headers);
	} else if (CALL_API.headers && 'object' !== typeof CALL_API.headers) {
		console.warn('API middleware: headers must be an object, but got ', (typeof CALL_API.headers) + '.', 'Skip headers');
	}

	if (isGET()) {
		delete headers['Content-Type'];
	}

	headers['X-Request-ID'] = uuid(CALL_API.headers['X-FP'] + Date.now(), CALL_API.headers['X-FP']);

	// TODO: credentials property MUST be one of the strings omit, same-origin or include.
	const request = {
		method: CALL_API.method,
		mode: process.env.NODE_ENV === 'production' ? 'same-origin' : 'cors', // FIXME: check
        credentials: 'same-origin',
		cache: 'no-cache',
		headers
	};

	if (!isGET() && ~request.headers['Content-Type'].indexOf('multipart/form-data') && CALL_API.body) {
		if (CALL_API.body instanceof FormData) {
			request.body = CALL_API.body;
		} else {
			request.body = formDataFromObject(CALL_API.body);
			delete request.headers['Content-Type'];
		}
	} else if (!isGET() && (~request.headers['Content-Type'].indexOf('json') || ~request.headers['Content-Type'].indexOf('x-www-form-urlencoded')) && CALL_API.body) {
		if ('object' === typeof CALL_API.body) {
			request.body = JSON.stringify(CALL_API.body);
		} else {
			request.body = CALL_API.body;
		}
	}

	const locale = getLocale(); // TODO: locale from state

	if (locale) {
		let parser      = document.createElement('a');
			parser.href = CALL_API.endpoint;

		if (parser.search) {
			parser.href += ('&locale=' + locale);
		} else {
			parser.href += ('?locale=' + locale);
		}

		CALL_API.endpoint = parser.href;
	}

	let timeout = CALL_API.timeout || 3600000, response;

	if (CALL_API.signal) request.signal = CALL_API.signal;

	try {
		response = await Promise.race([
			fetch(CALL_API.endpoint, request), // TODO: logger
			new Promise((_, reject) => {
				setTimeout(function () {
					reject({message: 'timeout'});
				}, timeout);
			})
		]);
	} catch (err) {
		if ('AbortError' === err.name && CALL_API.abort_type) {
            return store.dispatch({ type: CALL_API.abort_type, payload: { message: err.message }, ...rest });
		}

		if (Array.isArray(CALL_API.error_type)) {
            CALL_API.error_type.forEach(error_type => {
                store.dispatch({ type: error_type, payload: { message: err.message }, ...rest });
			})
		} else {
            store.dispatch({ type: CALL_API.error_type, payload: { message: err.message }, ...rest });
		}
		return;
	}

	if (Number(response.status) === 204) {
        if (Array.isArray(CALL_API.success_type)) {
            return CALL_API.success_type.forEach(success_type => {
                store.dispatch({ type: success_type, ...rest });
			})
		} else {
        	return store.dispatch({ type: CALL_API.success_type, ...rest });
        }
	}

	let payload;

	let contentType = response.headers.get('Content-Type');

	let isFile = response.headers.get('content-disposition') || false;

	 if (isFile) {
	 	payload = await response.blob();

		let filename = rest.data && rest.data.filename ? rest.data.filename : null;
		let disposition = response.headers.get('content-disposition');

		if (disposition && disposition.indexOf('inline') !== -1) {
			let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			let matches = filenameRegex.exec(disposition);
			if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
		} else if (~CALL_API.endpoint.indexOf('zip=true')) {
			filename += '.zip';
		}


		FileSaver.saveAs(payload, filename);
	} else if (contentType && ~contentType.indexOf('json')) {
        payload = await response.json();
    } else {
		payload = await response.text();
	}
	// TODO: response.status == 0
	if (response.status >= 200 && response.status < 300) {
		if (CALL_API.success_type) {
            if (Array.isArray(CALL_API.success_type)) {
                CALL_API.success_type.forEach(success_type => {
                    store.dispatch({ type: success_type, payload, ...rest });
                })
            } else {

                store.dispatch({ type: CALL_API.success_type, payload, ...rest });
            }
        }

		return;
	}

	if (Number(response.status) === 401) {
        if (Array.isArray(CALL_API.error_type)) {
            CALL_API.error_type.forEach(error_type => {
                store.dispatch({ type: error_type, payload, ...rest });
            })
        } else {
            store.dispatch({ type: CALL_API.error_type, payload, ...rest });
        }

		return store.dispatch({ type: 401 });
	}

	// TODO: response.status == 403
	if (response.status > 401 || Number(response.status) === 400) {
		if (CALL_API.error_type) {
            if (Array.isArray(CALL_API.error_type)) {
                CALL_API.error_type.forEach(error_type => {
                    store.dispatch({ type: error_type, payload, ...rest });
                })
            } else {
                store.dispatch({ type: CALL_API.error_type, payload, ...rest });
            }

			return;
		}
	}
}
