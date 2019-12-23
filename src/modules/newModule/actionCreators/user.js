import * as AT from '../actionTypes';

export function loadUser (userId) {
	return {
		type: AT.LOAD_USER,
		payload: {
			userId
		}
	}
}
