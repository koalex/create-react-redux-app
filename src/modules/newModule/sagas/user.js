import { call, put, takeEvery/*, takeLatest*/ } from 'redux-saga/effects'
import rest                                     from 'services/rest';
import * as AT                                  from '../actionTypes';

function* fetchUser (/*action*/) {
	try {
		const user = yield call(rest, {
			endpoint: '/users',
			method: 'GET',
		});

		yield put({type: AT.LOAD_USER_SUCCESS, payload: user});
	} catch (err) {
		yield put({type: AT.LOAD_USER_ERROR, payload: ('string' === typeof err) ? err : err.message});
	}
}

export default function* userSaga () {
	yield takeEvery(AT.LOAD_USER, fetchUser);
}