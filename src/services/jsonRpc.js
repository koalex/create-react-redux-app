import uuid           from 'uuid/v3';
import getFingerPrint from 'utils/getBrowserFingerPrint';

const API_ROOT = '/api';
const defaultHeaders = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'X-Requested-With': 'XMLHttpRequest',
	// Host: 'https://localhost:8080',
};

export default async function callJsonrpc (jsonrpc) {
	const fullUrl     = API_ROOT;
	const fingerprint = await getFingerPrint();
	let body;

	if (Array.isArray(jsonrpc)) {
		body = jsonrpc.map(jsonrpc => {
			const request = {jsonrpc: '2.0', method: jsonrpc.method};
			if (jsonrpc.params) request.params = jsonrpc.params;
			if (!jsonrpc.notification) {
				request.id = (uuid(fingerprint + Date.now() + Math.random(), fingerprint)).replace(/-/g, '');
			}
			return request;
		});
	} else {
		body = {
			jsonrpc: '2.0',
			method: jsonrpc.method
		};
		if (jsonrpc.params) body.params = jsonrpc.params;
		if (!jsonrpc.notification) {
			body.id = (uuid(fingerprint + Date.now() + Math.random(), fingerprint)).replace(/-/g, '');
		}
	}

	const headers = {
		...defaultHeaders,
		'X-FP': fingerprint,
		'X-Request-ID': uuid(fingerprint + Date.now() + Math.random(), fingerprint),
	};

	// TODO: credentials property MUST be one of the strings omit, same-origin or include.
	const request = {
		method: 'POST',
		mode: process.env.NODE_ENV === 'production' ? 'same-origin' : 'cors', // FIXME: check
		credentials: 'same-origin',
		cache: 'no-cache',
		headers,
	};
	if ('object' === typeof body) request.body = JSON.stringify(body);

	const timeout = 1000 * 60;

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

	if (contentType && ~contentType.indexOf('json')) {
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
