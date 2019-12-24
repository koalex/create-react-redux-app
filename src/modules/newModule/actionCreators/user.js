import * as AT from '../actionTypes';

export function loadUser (userId) {
	return {
		type: AT.LOAD_USER,
		payload: {
			userId
		}
	}
}
export function saveUser (user) {
	return {
		type: AT.SAVE_USER,
		method: 'user.save',
		params: {
			...user
		}
	}
}
