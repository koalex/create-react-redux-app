export default function (data) {
	const { type, ...rest } = data;

	let action =  { type };

	for (let k in rest) action[k] = rest[k];

	return action;
}