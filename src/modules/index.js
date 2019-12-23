import { all } from 'redux-saga/effects';
import newModule, {
	sagas as newModuleSagas,
} from 'modules/newModule';

export const middlewares = [];

export const rootSaga = function* rootSaga () {
	yield all([
		...newModuleSagas
	]);
};

export default {
	newModule
}