import Fingerprint2 from 'fingerprintjs2';

let murmur;

export default async function getBrowserFingerPrint () {
	if (murmur) return murmur;

	return await new Promise(resolve => {
		if (window.requestIdleCallback) {
			window.requestIdleCallback(() => {
				Fingerprint2.get(components => {
					let values = components.map(component => component.value);
					murmur = Fingerprint2.x64hash128(values.join(''), 31);
					resolve(murmur);
				});
			});
		} else {
			setTimeout(function () {
				Fingerprint2.get(components => {
					let values = components.map(component => component.value);
					murmur = Fingerprint2.x64hash128(values.join(''), 31);
					resolve(murmur);
				});
			}, 500);
		}
	});
}
