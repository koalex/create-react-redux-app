/*if (!('FormData' in window)) {
	window.FormData = require('formdata-polyfill'); // https://caniuse.com/#search=formdata
}*/

export default function formDataFromObject (obj, form, namespace) {
	let fd = form || new FormData();
	let formKey;

	for (let property in obj) {
		if (obj.hasOwnProperty(property)) {
			if (namespace) {
				formKey = namespace + '[' + property + ']';
			} else {
				formKey = property;
			}

			if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
				formDataFromObject(obj[property], fd, property);

			} else {
				fd.append(formKey, obj[property]);
			}
		}
	}

	return fd;
}
