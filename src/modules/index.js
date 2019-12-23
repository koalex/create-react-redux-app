import { all } from 'redux-saga/effects';

/*const fooSagas = [
	takeEvery("FOO_A", fooASaga),
	takeEvery("FOO_B", fooBSaga),
];
const barSagas = [
	takeEvery("BAR_A", barASaga),
	takeEvery("BAR_B", barBSaga),
];*/

export const middlewares = [];
export const rootSaga = function* rootSaga () {
	yield all([
		// ...fooSagas,
		// ...barSagas
	]);
};
export default {
/*
	foo: fooReducer,
	bar: barReducer,
	...
*/
}