import FileSaver          from 'file-saver';
import uuid               from 'uuid/v3';
import getFingerPrint     from 'utils/getBrowserFingerPrint';
import formDataFromObject from 'utils/formDataFromObject';

const API_ROOT = '/api/v1';
const defaultHeaders = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'X-Requested-With': 'XMLHttpRequest',
	// Host: 'https://localhost:8080',
};
const isGET = method => {
	if ('string' !== typeof method) return true;
	return method.toUpperCase().trim() === 'GET';
};

export default async function callRest (opts) {
	const { endpoint, method, body } = opts;
	const fullUrl     = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;
	const fingerprint = await getFingerPrint();

	const headers = {
		...defaultHeaders,
		'X-FP': fingerprint,
		'X-Request-ID': uuid(fingerprint + Date.now() + Math.random(), fingerprint),
		...opts.headers
	};

	if (isGET(method)) delete headers['Content-Type'];

	// TODO: credentials property MUST be one of the strings omit, same-origin or include.
	const request = {
		method,
		mode: process.env.NODE_ENV === 'production' ? 'same-origin' : 'cors', // FIXME: check
		credentials: 'same-origin',
		cache: 'no-cache',
		headers
	};

	if (!isGET(method) && ~request.headers['Content-Type'].indexOf('multipart/form-data') && body) {
		if (body instanceof FormData) {
			request.body = body;
		} else {
			request.body = formDataFromObject(body);
			delete request.headers['Content-Type'];
		}
	} else if (!isGET(method) && (~request.headers['Content-Type'].indexOf('json') || ~request.headers['Content-Type'].indexOf('x-www-form-urlencoded')) && body) {
		if ('object' === typeof body) {
			request.body = JSON.stringify(body);
		} else {
			request.body = body;
		}
	}

	const timeout = opts.timeout || 3600000;

	let response = await Promise.race([
		fetch(fullUrl, request),
		new Promise((_, reject) => {
			setTimeout(function () {
				reject(new Error('Request timeout.'));
			}, timeout);
		})
	]);

	let payload;

	const contentType = response.headers.get('Content-Type');
	const isFile      = response.headers.get('content-disposition') || false;

	if (isFile) {
		payload = await response.blob();

		let filename      = opts.filename || null;
		const disposition = response.headers.get('content-disposition'); // if file

		if (disposition && disposition.indexOf('inline') !== -1) {
			let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			let matches = filenameRegex.exec(disposition);
			if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
		} else if (endpoint.indexOf('zip=true')) {
			filename += '.zip';
		}
		FileSaver.saveAs(payload, filename);
	} else if (contentType && ~contentType.indexOf('json')) {
		payload = await response.json();
	} else {
		payload = await response.text();
	}

	if (response.status >= 400) {
		throw payload;
	} else if (response.status >= 200 && response.status < 300) {
		return payload;
	}
}
