import { combineReducers } from 'redux';
import { connectRouter }   from 'connected-react-router';
import modules             from '../modules';
import history             from '../middlewares/history';
import i18n                from '../i18n/reducers/i18n';

export default function createRootReducer (asyncReducers) {
	return combineReducers({
		router: connectRouter(history),
		i18n,
		...modules,
		...asyncReducers
	});
}
