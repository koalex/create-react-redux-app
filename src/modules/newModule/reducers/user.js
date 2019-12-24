import * as AT from '../actionTypes';

export const init = {
	user: null,
	isLoading: false,
	error: null
};

export default function (state = init, action) {
	const { type, payload } = action;

	switch (type) {
		default:
			return state;

		case AT.LOAD_USER:
			return {
				...state,
				isLoading: true,
				error: null
			};

		case AT.LOAD_USER_SUCCESS:
			return {
				...state,
				isLoading: false,
				user: payload
			};
		case AT.LOAD_USER_ERROR:
			return {
				...state,
				isLoading: false,
				error: payload
			};
	}
}
