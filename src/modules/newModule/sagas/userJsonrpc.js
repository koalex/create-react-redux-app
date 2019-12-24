import { call, put, takeEvery/*, takeLatest*/ } from 'redux-saga/effects'
import jsonrpc                                  from 'services/jsonRpc';
import * as AT                                  from '../actionTypes';

function* saveUser (action) {
	try {
		const user = yield call(jsonrpc, action);

		yield put({type: AT.SAVE_USER_SUCCESS, user: user});
	} catch (err) {
		yield put({type: AT.LOAD_USER_ERROR, message: ('string' === typeof err) ? err : err.message});
	}
}

export default function* userJsonrpcSaga () {
	yield takeEvery(AT.SAVE_USER, saveUser);
}